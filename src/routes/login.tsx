import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Mail, Shield, UserCog } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { api } from "@/lib/api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In | Light Vision Property" },
      { name: "description", content: "Secure sign in for Light Vision Property admins and agents." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"admin" | "agent">("agent");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/auth/login", { email, password, role });
      toast.success(`Welcome back, ${role === "admin" ? "Admin" : "Agent"}!`);
      navigate({ to: role === "admin" ? "/admin" : "/dashboard" });
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Unable to sign in. Please check your credentials.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-20 bg-gradient-to-br from-cream via-white to-cream/60">
        <div className="absolute inset-0 -z-10 opacity-40 [background:radial-gradient(60%_60%_at_50%_0%,oklch(0.92_0.05_85_/_0.6),transparent_70%)]" />
        <div className="w-full max-w-md">
          <div className="glass rounded-2xl shadow-luxe p-8 border border-white/60 bg-white/80 backdrop-blur-xl">
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <Label className="text-xs uppercase tracking-[0.2em] text-navy/60">Sign in as</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(v) => setRole(v as "admin" | "agent")}
                  className="mt-3 grid grid-cols-2 gap-3"
                >
                  <label
                    htmlFor="role-agent"
                    className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                      role === "agent"
                        ? "border-gold bg-gold/10 shadow-sm"
                        : "border-navy/10 hover:border-navy/30"
                    }`}
                  >
                    <RadioGroupItem id="role-agent" value="agent" />
                    <UserCog className="size-4 text-gold" />
                    <span className="text-sm font-medium text-navy">Agent</span>
                  </label>
                  <label
                    htmlFor="role-admin"
                    className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                      role === "admin"
                        ? "border-gold bg-gold/10 shadow-sm"
                        : "border-navy/10 hover:border-navy/30"
                    }`}
                  >
                    <RadioGroupItem id="role-admin" value="admin" />
                    <Shield className="size-4 text-gold" />
                    <span className="text-sm font-medium text-navy">Admin</span>
                  </label>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-navy/60">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-navy/40" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@lightvisionproperty.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs uppercase tracking-[0.2em] text-navy/60">Password</Label>
                  <button type="button" className="text-xs text-gold hover:underline">Forgot?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-navy/40" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 bg-white"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-full bg-navy hover:bg-navy/90 text-white text-sm font-medium"
              >
                {loading ? "Signing in…" : `Sign in as ${role === "admin" ? "Admin" : "Agent"}`}
              </Button>

              <p className="text-center text-xs text-navy/50">
                Accounts are created by administrators. Contact your office for access.
              </p>
            </form>
          </div>

          <p className="text-center text-xs text-navy/40 mt-6">
            <Link to="/" className="hover:text-navy">← Back to homepage</Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}
