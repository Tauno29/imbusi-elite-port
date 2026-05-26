/*
Migration script: convert existing Supabase Storage public URLs into data-URLs
and update DB rows so admin UI can use data-URLs instead of Storage links.

Usage:
  npm install @supabase/supabase-js node-fetch
  SUPABASE_URL=https://xyz.supabase.co SUPABASE_SERVICE_ROLE_KEY=your_service_role_key node supabase/scripts/migrate_storage_to_dataurls.cjs

Notes:
- This script requires the Supabase service_role key to download private objects if needed.
- It will process the buckets: profile, posts, gallery and update
  - site_content.profile_image
  - site_content.about_image_*
  - posts.media_url
  - gallery_items.image_url
  - news.images array values (array_replace)

Run in a dev/staging DB first and backup before running in production.
*/

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY_RUN = process.argv.includes('--dry-run') || process.env.DRY_RUN === '1';
const SINGLE_KEY = process.argv.includes('--key') ? process.argv[process.argv.indexOf('--key')+1] : process.env.MIGRATE_KEY || null;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function toDataUrlFromPublicUrl(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buffer = await res.arrayBuffer();
  const bytes = Buffer.from(buffer);
  // try to detect content-type from headers
  const contentType = res.headers.get('content-type') || 'application/octet-stream';
  const base64 = bytes.toString('base64');
  return `data:${contentType};base64,${base64}`;
}

async function doUpsert(table, row) {
  if (DRY_RUN) {
    console.log(`[dry-run] upsert ${table}:`, JSON.stringify(row).slice(0, 200));
    return { error: null };
  }
  return await supabase.from(table).upsert(row);
}

async function doUpdate(table, payload, filter) {
  if (DRY_RUN) {
    console.log(`[dry-run] update ${table} ${JSON.stringify(filter)} =>`, JSON.stringify(payload).slice(0,200));
    return { error: null };
  }
  return await supabase.from(table).update(payload).match(filter);
}

async function migrateProfile() {
  console.log('Migrating profile image (site_content.profile_image)...');
  // read current value
  const { data } = await supabase.from('site_content').select('key, value').eq('key', 'profile_image').single();
  if (!data) return console.log('No profile_image key found');
  const val = data.value;
  if (!val || !val.startsWith('http')) return console.log('Profile image is empty or not a URL, skipping');
  try {
    const dataUrl = await toDataUrlFromPublicUrl(val);
    await doUpsert('site_content', { key: 'profile_image', value: dataUrl, updated_at: new Date().toISOString() });
    console.log((DRY_RUN ? '[dry-run] ' : '') + 'Updated profile_image to data URL');
  } catch (e) {
    console.error('Profile migration failed:', e.message);
  }
}

async function migrateAboutImages() {
  console.log('Migrating about images (site_content.about_image_1..4)...');
  for (let i = 1; i <= 4; i++) {
    const key = `about_image_${i}`;
    const { data } = await supabase.from('site_content').select('key,value').eq('key', key).single();
    const val = data?.value;
    if (!val || !val.startsWith('http')) { console.log(`${key}: empty or not a URL, skipping`); continue; }
    if (SINGLE_KEY && SINGLE_KEY !== key) { console.log(`${key}: skipping due to SINGLE_KEY`); continue; }
    try {
      const dataUrl = await toDataUrlFromPublicUrl(val);
      await doUpsert('site_content', { key, value: dataUrl, updated_at: new Date().toISOString() });
      console.log((DRY_RUN ? '[dry-run] ' : '') + `${key}: migrated`);
    } catch (e) { console.error(`${key}: failed:`, e.message); }
  }
}

async function migratePosts() {
  console.log('Migrating posts.media_url...');
  const { data: posts } = await supabase.from('posts').select('id,media_url').gt('media_url', '').limit(1000);
  if (!posts?.length) return console.log('No posts with media_url found');
  for (const p of posts) {
    const url = p.media_url;
    if (!url || !url.startsWith('http')) continue;
    if (SINGLE_KEY && SINGLE_KEY !== p.id) { console.log(`post ${p.id}: skipping due to SINGLE_KEY`); continue; }
    try {
      const dataUrl = await toDataUrlFromPublicUrl(url);
      await doUpdate('posts', { media_url: dataUrl }, { id: p.id });
      // best-effort: update news arrays where this URL appears
      if (!DRY_RUN) {
        try { await supabase.rpc('array_replace_news_images', { old_url: url, new_url: dataUrl }).catch(()=>{}); } catch(e){}
      }
      console.log((DRY_RUN ? '[dry-run] ' : '') + `Post ${p.id}: migrated`);
    } catch (e) { console.error(`Post ${p.id}: failed:`, e.message); }
  }
}

async function migrateGallery() {
  console.log('Migrating gallery_items.image_url...');
  const { data: items } = await supabase.from('gallery_items').select('id,image_url').gt('image_url', '').limit(1000);
  if (!items?.length) return console.log('No gallery items found');
  for (const it of items) {
    const url = it.image_url;
    if (!url || !url.startsWith('http')) continue;
    if (SINGLE_KEY && SINGLE_KEY !== it.id) { console.log(`gallery ${it.id}: skipping due to SINGLE_KEY`); continue; }
    try {
      const dataUrl = await toDataUrlFromPublicUrl(url);
      await doUpdate('gallery_items', { image_url: dataUrl }, { id: it.id });
      console.log((DRY_RUN ? '[dry-run] ' : '') + `Gallery ${it.id}: migrated`);
    } catch (e) { console.error(`Gallery ${it.id}: failed:`, e.message); }
  }
}

async function migrateNewsArrays() {
  console.log('Migrating news.images arrays where entries are URLs...');
  // Get news rows that have images array containing http links
  const { data: rows } = await supabase.from('news').select('id, images').limit(1000);
  if (!rows?.length) return console.log('No news rows');
  for (const r of rows) {
    const imgs = r.images || [];
    let changed = false;
    const newImgs = [];
    for (const img of imgs) {
      if (img && img.startsWith('http')) {
        try {
          const dataUrl = await toDataUrlFromPublicUrl(img);
          newImgs.push(dataUrl);
          changed = true;
        } catch (e) {
          console.error(`news ${r.id} image convert failed:`, e.message);
          newImgs.push(img);
        }
      } else {
        newImgs.push(img);
      }
    }
    if (changed) {
      if (SINGLE_KEY && SINGLE_KEY !== r.id) { console.log(`news ${r.id}: skipping update due to SINGLE_KEY`); continue; }
      await doUpdate('news', { images: newImgs }, { id: r.id });
      console.log((DRY_RUN ? '[dry-run] ' : '') + `news ${r.id}: images updated`);
    }
  }
}

(async function main(){
  try {
    await migrateProfile();
    await migrateAboutImages();
    await migratePosts();
    await migrateGallery();
    await migrateNewsArrays();
    console.log('Migration finished');
  } catch (e) {
    console.error('Migration failed:', e);
    process.exit(1);
  }
})();
