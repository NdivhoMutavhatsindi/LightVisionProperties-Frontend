import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHeader } from "@/components/site/Layout";
import { Home, Key, Building2, Calculator, Megaphone, Scale, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/services")({ component: Page, head: () => ({ meta: [{ title: "Services — Light Vision Property" }] }) });

const services = [
  { icon: Home, t: "Property Sales", d: "Full-service representation for residential sellers." },
  { icon: Key, t: "Rentals", d: "Tenant placement, lease management and renewals." },
  { icon: Building2, t: "Commercial Property", d: "Office, retail and industrial across key nodes." },
  { icon: Calculator, t: "Property Valuation", d: "Accurate, evidence-based pricing in 48 hours." },
  { icon: Megaphone, t: "Property Marketing", d: "Photography, video, copy, distribution." },
  { icon: Scale, t: "Legal Assistance", d: "Conveyancing and bond legal partners on call." },
  { icon: ShieldCheck, t: "Compliance Services", d: "Electrical, plumbing, gas and beetle certificates." },
];

function Page() {
  return (
    <Layout>
      <PageHeader eyebrow="SERVICES" title="High-end property consultancy, end to end." subtitle="One team, one accountable point of contact — from valuation through to title transfer." />
      <section className="mx-auto max-w-7xl px-6 py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(({ icon: Icon, t, d }) => (
          <article key={t} className="hover-lift rounded-3xl bg-white border border-black/5 p-7 shadow-[0_10px_40px_-25px_rgba(27,43,69,0.2)]">
            <div className="h-12 w-12 rounded-2xl grid place-items-center bg-gold/15 text-gold"><Icon size={20} /></div>
            <h3 className="mt-5 font-display text-2xl text-navy">{t}</h3>
            <p className="mt-2 text-sm text-navy/60">{d}</p>
            <div className="mt-6 text-[11px] tracking-[0.3em] text-gold">LEARN MORE →</div>
          </article>
        ))}
      </section>
    </Layout>
  );
}
