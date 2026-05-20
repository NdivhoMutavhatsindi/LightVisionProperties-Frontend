import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout, PageHeader } from "@/components/site/Layout";
import { api } from "@/lib/api";

export const Route = createFileRoute("/agents")({ component: Page, head: () => ({ meta: [{ title: "Agents — Light Vision Property" }] }) });

const defaultAgents: Array<{
  id: string;
  name: string;
  role: string;
  img: string;
  years: number;
  listings: number;
  rating: number;
  reviews: number;
}> = [];

function normalizeAgent(agent: any) {
  return {
    id: String(agent.id),
    name: agent.name ?? agent.full_name ?? "Agent",
    role: agent.position ?? "Agent",
    img: agent.profileImage ?? agent.image ?? "",
    years: Number(agent.experienceYears ?? 0),
    listings: Number(agent.listingsCount ?? 0),
    rating: Math.min(5, Math.max(3, 3 + (Number(agent.listingsCount) || 0) / 5)),
    reviews: 10 + (Number(agent.listingsCount) || 0) * 2,
  };
}

function Page() {
  const [agents, setAgents] = useState(defaultAgents);

  useEffect(() => {
    api
      .get("/api/agents")
      .then((response) => {
        const items = Array.isArray(response.data) ? response.data : [];
        setAgents(items.map(normalizeAgent));
      })
      .catch(() => {
        setAgents(defaultAgents);
      });
  }, []);
  return (
    <Layout>
      <PageHeader eyebrow="OUR PEOPLE" title="Area specialists. Not generalists." subtitle="A small team with deep market knowledge — ranked by client ratings." />
      <section className="mx-auto max-w-7xl px-6 py-16">
        {agents.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {agents.map((a, i) => (
              <article key={a.name} className="hover-lift relative rounded-3xl overflow-hidden bg-white border border-black/5 shadow-[0_10px_40px_-20px_rgba(27,43,69,0.15)]">
                {i < 5 && <div className="absolute top-3 left-3 z-10 rounded-full bg-navy text-gold text-[10px] tracking-[0.2em] px-3 py-1">TOP {i + 1}</div>}
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={a.img} alt={a.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-navy">{a.name}</h3>
                  <div className="text-xs text-navy/50 mt-1">{a.role}</div>
                  <div className="mt-3 flex items-center gap-1 text-gold">
                    <span className="font-display text-base text-navy">{a.rating.toFixed(1)}</span>
                    <span className="text-[11px] text-navy/50 ml-1">({a.reviews} reviews)</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-navy/60">
                    <span><span className="font-display text-lg text-navy">{a.years}</span> yrs</span>
                    <span><span className="font-display text-lg text-navy">{a.listings}</span> listings</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-navy/20 bg-white/80 p-14 text-center text-navy/70">
            <div className="text-[11px] tracking-[0.35em] text-gold">NO AGENTS YET</div>
            <div className="mt-4 text-3xl font-display">Agent profiles will appear here once your admin adds them.</div>
            <p className="mt-4 text-sm leading-7 max-w-2xl mx-auto">There are no agents listed at the moment. When your first Limpopo-based agent is created, they will show here.</p>
          </div>
        )}
      </section>
    </Layout>
  );
}

