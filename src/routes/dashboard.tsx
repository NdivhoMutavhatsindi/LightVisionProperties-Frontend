import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHeader } from "@/components/site/Layout";
import { api } from "@/lib/api";

type DashboardMetrics = {
  database: string;
  userCounts: Array<{ role: string; count: number }>;
  tables?: string[];
};

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard | Light Vision Property" },
      { name: "description", content: "Agent dashboard with database overview and metrics." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/dashboard")
      .then((response) => setMetrics(response.data))
      .catch((err) => setError(err?.response?.data?.message ?? err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <PageHeader
        eyebrow="AGENT DASHBOARD"
        title="Welcome back, agent"
        subtitle="Review database health, user counts, and quick system access."
      />
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-[2rem] border border-black/5 bg-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.18)] p-10">
          {loading ? (
            <div className="text-center text-lg text-navy/70">Loading dashboard metrics...</div>
          ) : error ? (
            <div className="rounded-3xl bg-rose-50 p-6 text-sm text-rose-700">{error}</div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl border border-black/10 bg-slate-50 p-6">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-navy/60">Database</h2>
                  <p className="mt-4 text-xl font-semibold text-navy">{metrics?.database ?? "Unavailable"}</p>
                  <p className="mt-2 text-sm text-navy/60">Connected to local MySQL instance.</p>
                </div>
                <div className="rounded-3xl border border-black/10 bg-slate-50 p-6">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-navy/60">Users by role</h2>
                  <div className="mt-4 space-y-3">
                    {metrics?.userCounts?.length ? (
                      metrics.userCounts.map((item) => (
                        <div key={item.role} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                          <span className="text-sm text-navy">{item.role}</span>
                          <span className="text-lg font-semibold text-navy">{item.count}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-navy/60">No user data available.</p>
                    )}
                  </div>
                </div>
              </div>
              {metrics?.tables && metrics.tables.length > 0 && (
                <div className="mt-8 rounded-3xl border border-black/10 bg-slate-50 p-6">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-navy/60">Detected tables</h2>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {metrics.tables.map((table) => (
                      <span key={table} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-navy/80">
                        {table}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
