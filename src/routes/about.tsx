import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHeader } from "@/components/site/Layout";
import brand from "@/assets/brand-hero.png";
import neighborhood from "@/assets/neighborhood.jpg";

export const Route = createFileRoute("/about")({ component: Page, head: () => ({ meta: [{ title: "About — Light Vision Property" }] }) });

function Page() {
  return (
    <Layout>
      <PageHeader eyebrow="ABOUT" title="A modern real estate brand built on trust." subtitle="We're rethinking what a property experience can feel like — slower, more considered, and entirely on your side." />
      <section className="mx-auto max-w-7xl px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
        <div className="aspect-square rounded-[2rem] overflow-hidden shadow-luxe grad-warm grid place-items-center p-12">
          <img src={brand} alt="Light Vision Property" className="max-h-full w-auto" />
        </div>
        <div>
          <h2 className="font-display text-4xl text-navy">Our story</h2>
          <p className="mt-5 text-navy/60">Light Vision Property was founded on a simple idea: the experience of buying, selling or renting a home should feel as considered as the home itself. We've built a small, deliberate team of specialists who take the time to know each property and each client personally.</p>
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[["12+","Years"],["1,200+","Listings"],["R 4.2bn","Closed"]].map(([k,v]) => (
              <div key={v}><div className="font-display text-3xl text-navy">{k}</div><div className="text-xs text-navy/50 mt-1">{v}</div></div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-warmgray/60 border-y border-black/5">
        <div className="mx-auto max-w-7xl px-6 py-20 grid md:grid-cols-2 gap-12">
          <div>
            <div className="text-[11px] tracking-[0.35em] text-gold">MISSION</div>
            <h3 className="mt-3 font-display text-3xl text-navy">Bring clarity and craft to every property decision.</h3>
            <p className="mt-4 text-navy/60">We're here to remove friction — not add features. Every listing, valuation and contract is handled by someone accountable.</p>
          </div>
          <div>
            <div className="text-[11px] tracking-[0.35em] text-gold">VISION</div>
            <h3 className="mt-3 font-display text-3xl text-navy">Become the most trusted property name in the country.</h3>
            <p className="mt-4 text-navy/60">A digital experience that feels personal — and a personal experience that's digitally effortless.</p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative aspect-[21/9] rounded-[2rem] overflow-hidden shadow-luxe">
          <img src={neighborhood} alt="Neighborhood" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/70 to-transparent" />
          <div className="relative h-full grid items-center px-10 md:px-16 max-w-2xl">
            <div>
              <div className="text-[11px] tracking-[0.35em] text-gold">LEADERSHIP</div>
              <h3 className="mt-3 font-display text-4xl text-white">People you can call directly.</h3>
              <p className="mt-4 text-white/70">A flat team of senior specialists — no call centres, no handoffs.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
