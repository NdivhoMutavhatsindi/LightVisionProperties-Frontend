import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHeader } from "@/components/site/Layout";
import { Zap, Droplet, Flame, Bug, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/compliance")({ component: Page, head: () => ({ meta: [{ title: "Compliance Certificates — Light Vision Property" }] }) });

const items = [
  { icon: Zap, t: "Electrical Certificates", d: "Certified inspections by registered electricians." },
  { icon: Droplet, t: "Plumbing Certificates", d: "Water installations tested to municipal standards." },
  { icon: Flame, t: "Gas Compliance", d: "Safe-installation certificates for gas appliances." },
  { icon: Bug, t: "Beetle Certificates", d: "Coastal property timber inspections." },
];

function Page() {
  return (
    <Layout>
      <PageHeader eyebrow="COMPLIANCE" title="Every certificate. One trusted partner." subtitle="We coordinate every compliance certificate required for a smooth, lawful transfer." />
      <section className="mx-auto max-w-7xl px-6 py-16 grid sm:grid-cols-2 gap-6">
        {items.map(({ icon: Icon, t, d }) => (
          <article key={t} className="hover-lift rounded-3xl bg-white border border-black/5 p-8">
            <div className="h-12 w-12 rounded-2xl bg-gold/15 text-gold grid place-items-center"><Icon size={20}/></div>
            <h3 className="mt-5 font-display text-2xl text-navy">{t}</h3>
            <p className="mt-2 text-sm text-navy/60">{d}</p>
            <div className="mt-6 inline-flex items-center gap-2 text-xs text-navy/60"><ShieldCheck size={14} className="text-gold"/> Issued by accredited specialists</div>
          </article>
        ))}
      </section>
    </Layout>
  );
}
