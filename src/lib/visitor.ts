export function getVisitorId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem("visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("visitor_id", id);
  }
  return id;
}
