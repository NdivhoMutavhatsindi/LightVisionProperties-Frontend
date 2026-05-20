import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHeader } from "@/components/site/Layout";
import { Upload } from "lucide-react";

export const Route = createFileRoute("/careers")({ component: Page, head: () => ({ meta: [{ title: "Careers — Light Vision Property" }] }) });

const roles = [
  { t: "Senior Property Agent", loc: "Sandton · Full-time" },
  { t: "Rentals Coordinator", loc: "Cape Town · Full-time" },
  { t: "Marketing Manager", loc: "Remote · Full-time" },
  { t: "Compliance Coordinator", loc: "Johannesburg · Hybrid" },
];

function Page() {
  return (
    <Layout>
      <PageHeader eyebrow="CAREERS" title="Build a quieter, better real estate company." subtitle="We're hiring deliberate, curious people who care about craft." />
      <section className="mx-auto max-w-7xl px-6 py-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-3">
          {roles.map(r => (
            <div key={r.t} className="hover-lift flex items-center justify-between rounded-2xl bg-white border border-black/5 p-6">
              <div>
                <div className="font-display text-xl text-navy">{r.t}</div>
                <div className="text-xs text-navy/50 mt-1">{r.loc}</div>
              </div>
              <span className="text-[11px] tracking-[0.3em] text-gold">APPLY →</span>
            </div>
          ))}
        </div>
        <form className="rounded-3xl bg-white border border-black/5 p-8 space-y-4 self-start">
          <div className="text-[11px] tracking-[0.3em] text-gold">GENERAL APPLICATION</div>
          <h3 className="font-display text-2xl text-navy">Upload your CV</h3>
          <input className="w-full rounded-xl bg-warmgray/60 border border-black/10 px-4 py-3 text-sm" placeholder="Full name" />
          <input className="w-full rounded-xl bg-warmgray/60 border border-black/10 px-4 py-3 text-sm" placeholder="Email" />
          <label className="flex items-center gap-3 rounded-xl border border-dashed border-navy/20 px-4 py-6 text-sm text-navy/60 cursor-pointer hover:border-gold">
            <Upload size={18} className="text-gold" /> Choose a PDF
            <input type="file" hidden />
          </label>
          <button className="w-full rounded-full bg-navy text-white text-sm py-3 hover:bg-navy/90 transition">Submit</button>
        </form>
      </section>
    </Layout>
  );
}
