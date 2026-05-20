import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useState } from "react";

export function AdminHeader() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.post("/api/auth/logout");
    } catch (e) {
      // ignore
    }
    navigate({ to: "/login" });
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-black/5">
      <div className="mx-auto max-w-7xl px-6 py-8 flex items-center justify-between">
        <div>
          <div className="text-[11px] tracking-[0.35em] text-gold mb-3">O ADMIN PORTAL</div>
          <h1 className="font-display text-5xl md:text-6xl text-navy">Dashboard</h1>
          <p className="mt-4 text-lg text-navy/60">Manage your team, careers, and incoming client requests.</p>
        </div>
        <Button
          onClick={handleLogout}
          disabled={loading}
          variant="outline"
          className="rounded-full border-navy/20 text-navy hover:bg-navy/5"
        >
          {loading ? "Signing out..." : "Sign out"}
        </Button>
      </div>
    </header>
  );
}
