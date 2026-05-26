import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async (uid: string | null) => {
      setUserId(uid);
      if (!uid) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
      setLoading(false);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      check(session?.user?.id ?? null);
    });

    supabase.auth.getSession().then(({ data }) => {
      check(data.session?.user?.id ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { isAdmin, userId, loading };
}
