import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHeader } from "@/components/site/Layout";
import { Download, FileSignature } from "lucide-react";

export const Route = createFileRoute("/offer-to-purchase")({ component: Page, head: () => ({ meta: [{ title: "Offer to Purchase — Light Vision Property" }] }) });

function Page() {
  return (
    <Layout>
      <PageHeader eyebrow="OFFER TO PURCHASE" title="A simple, legally guided way to make your offer." subtitle="Submit online or download a clean, plain-English template — reviewed by our legal partners." />
      <section className="mx-auto max-w-7xl px-6 py-16 grid lg:grid-cols-3 gap-6">
        {[
          { n: "01", t: "Confirm details", d: "Property, parties, price and conditions." },
          { n: "02", t: "Sign & submit", d: "Digitally or in person, with witness." },
          { n: "03", t: "Acceptance & transfer", d: "We coordinate compliance, bond and legal." },
        ].map(s => (
          <div key={s.n} className="rounded-3xl bg-white border border-black/5 p-8">
            <div className="font-display text-5xl text-gold/60">{s.n}</div>
            <h3 className="mt-3 font-display text-2xl text-navy">{s.t}</h3>
            <p className="mt-2 text-sm text-navy/60">{s.d}</p>
          </div>
        ))}
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-20 grid md:grid-cols-2 gap-6">
        <a href="/OTP LIGHT VISION PROPERTY OTP.pdf" download className="hover-lift rounded-3xl bg-navy text-white p-8 flex items-center justify-between">
          <div>
            <div className="text-[11px] tracking-[0.3em] text-gold">DOWNLOAD</div>
            <div className="mt-2 font-display text-2xl">Offer to Purchase Template (PDF)</div>
          </div>
          <Download size={28} className="text-gold"/>
        </a>
        <a href="#" className="hover-lift rounded-3xl bg-white border border-black/5 p-8 flex items-center justify-between">
          <div>
            <div className="text-[11px] tracking-[0.3em] text-gold">SUBMIT ONLINE</div>
            <div className="mt-2 font-display text-2xl text-navy">Start a digital offer</div>
          </div>
          <FileSignature size={28} className="text-navy"/>
        </a>
      </section>
    </Layout>
  );
}
