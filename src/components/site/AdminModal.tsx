import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Shield, Loader2 } from "lucide-react";

export function AdminModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back, Imbusi.");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Admin account created. Signing you in...");
      }
      onOpenChange(false);
      navigate({ to: "/admin" });
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-primary/30 max-w-md">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        <DialogHeader>
          <div className="mx-auto h-12 w-12 gradient-green clip-corner grid place-items-center box-glow animate-pulse-glow mb-2">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-center font-display text-2xl">
            Secure <span className="text-primary text-glow">Admin</span> Access
          </DialogTitle>
          <DialogDescription className="text-center">
            Restricted area — Imbusi Forex Trading only.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handle} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="david@imbusi.fx"
              className="bg-input border-primary/20 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-input border-primary/20 focus-visible:ring-primary"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full gradient-green text-primary-foreground font-semibold hover:opacity-90 box-glow-sm"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {mode === "signin" ? "Enter Dashboard" : "Create Admin Account"}
          </Button>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="w-full text-xs text-muted-foreground hover:text-primary transition"
          >
            {mode === "signin"
              ? "First time? Create the admin account →"
              : "← Back to sign in"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
