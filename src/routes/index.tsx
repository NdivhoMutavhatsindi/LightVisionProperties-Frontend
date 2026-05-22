import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/site/Layout";
import { Search, MapPin, BedDouble, Bath, Maximize, Heart, ArrowUpRight, ShieldCheck, Award, Building2, Sparkles, Calculator, FileText, Scale, Star } from "lucide-react";
import { api } from "@/lib/api";
import { normalizeUploadUrl } from "@/lib/utils";
import p1 from "@/assets/prop-1.jpg";
import p2 from "@/assets/prop-2.jpg";
import p3 from "@/assets/prop-3.jpg";
import p4 from "@/assets/prop-4.jpg";
import logoImage from "@/assets/logo.png";
import neighborhood from "@/assets/neighborhood.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Light Vision Property — Exceptional Homes, Effortless Experience" },
      { name: "description", content: "Discover, value and invest in exceptional properties with Light Vision Property — a premium real estate brand built around clarity, trust and craftsmanship." },
    ],
  }),
});

const sampleProperties = [
  { img: p2, title: "Atelier Villa", loc: "Camps Bay", price: "R 24,500,000", beds: 5, baths: 4, area: "640 m²", tag: "For Sale" },
  { img: p3, title: "Skyline Penthouse", loc: "Sandton Central", price: "R 18,900,000", beds: 3, baths: 3, area: "320 m²", tag: "For Sale" },
  { img: p1, title: "Linden Residence", loc: "Bryanston", price: "R 42,000 / mo", beds: 4, baths: 3, area: "410 m²", tag: "To Rent" },
  { img: p4, title: "Maison Verte", loc: "Constantia", price: "R 11,750,000", beds: 4, baths: 3, area: "380 m²", tag: "For Sale" },
];

interface AgentCard {
  id: string;
  name: string;
  role: string;
  img: string;
  rating: number;
  reviews: number;
}

function parsePrice(value: string | number) {
  if (typeof value === "number") return value;
  return Number(String(value).replace(/[R,\s\/mo]/g, "")) || 0;
}

function Home() {
  const [properties, setProperties] = useState<typeof sampleProperties>(sampleProperties);
  const [featuredProperty, setFeaturedProperty] = useState(() =>
    sampleProperties.reduce((current, next) => {
      return parsePrice(next.price) > parsePrice(current.price) ? next : current;
    }, sampleProperties[0]),
  );
  const [topAgents, setTopAgents] = useState<AgentCard[]>([]);

  useEffect(() => {
    api
      .get("/api/properties")
      .then((response) => {
        const items = Array.isArray(response.data) ? response.data : sampleProperties;
        if (items.length === 0) {
          setProperties(sampleProperties);
          setFeaturedProperty(sampleProperties[0]);
          return;
        }

        const normalized = items.map((item) => ({
          img: normalizeUploadUrl(item.main_image ?? item.img) ?? sampleProperties[0].img,
          title: item.title ?? "Property",
          loc: item.location ?? item.loc ?? "Unknown",
          price: typeof item.price === "number" ? `R ${item.price.toLocaleString()}` : item.price ?? "R 0",
          beds: item.beds ?? item.bedrooms ?? 0,
          baths: item.baths ?? item.bathrooms ?? 0,
          area: item.area ?? item.property_size ?? "—",
          tag: item.type ?? item.status ?? "For Sale",
        }));

        setProperties(normalized);
        setFeaturedProperty(
          normalized.reduce((current, next) => {
            return parsePrice(next.price) > parsePrice(current.price) ? next : current;
          }, normalized[0]),
        );

        api
          .get('/api/agents')
          .then((agentResponse) => {
            const agentsData = Array.isArray(agentResponse.data) ? agentResponse.data : [];
            const ranked = agentsData
              .map((agent: any) => ({
                id: String(agent.id),
                name: agent.name ?? agent.full_name ?? 'Agent',
                role: agent.position ?? 'Agent',
                img: normalizeUploadUrl(agent.profileImage ?? agent.image) ?? sampleProperties[0].img,
                rating: Math.min(5, Math.max(3, 3 + (Number(agent.listingsCount) || 0) / 5)),
                reviews: 12 + (Number(agent.listingsCount) || 0) * 3,
              }))
              .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
              .slice(0, 5);
            setTopAgents(ranked);
          })
          .catch(() => {
            setTopAgents([]);
          });
      })
      .catch(() => {
        setProperties(sampleProperties);
        setFeaturedProperty(sampleProperties[0]);
      });

  }, []);

  return (
    <Layout>
      {/* HERO */}
      <section className="relative -mt-24 pt-28 overflow-hidden">
        <div className="absolute inset-0 grad-warm" />
        <div className="absolute -top-32 -right-32 h-[600px] w-[600px] rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-navy/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-28 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] tracking-[0.25em] text-navy/70 reveal">
              <Sparkles size={12} className="text-gold" /> A NEW STANDARD IN PROPERTY
            </div>
            <h1 className="mt-6 font-display text-5xl md:text-7xl text-navy leading-[1.02] reveal delay-1">
              Find exceptional<br />properties with <em className="text-gold not-italic">confidence.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-navy/60 reveal delay-2">
              From Venda listings to Thohoyandou support — a calm, considered experience for buyers, sellers and investors across Limpopo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 reveal delay-3">
              <Link to="/properties" className="inline-flex items-center gap-2 rounded-full bg-navy text-white px-6 py-3 text-sm font-medium hover:bg-navy/90 transition">Browse Properties <ArrowUpRight size={16} /></Link>
              <Link to="/valuation" className="inline-flex items-center gap-2 rounded-full bg-white border border-navy/15 text-navy px-6 py-3 text-sm font-medium hover:border-gold transition">Free Valuation</Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md reveal delay-4">
              {[{ k: "1,200+", v: "Properties listed" }, { k: "R 4.2bn", v: "Sales closed" }, { k: "98%", v: "Client satisfaction" }].map(s => (
                <div key={s.v}>
                  <div className="font-display text-3xl text-navy">{s.k}</div>
                  <div className="text-xs text-navy/50 mt-1">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 relative reveal delay-2">
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-luxe">
              <img src={featuredProperty.img} alt={featuredProperty.title} className="absolute inset-0 h-full w-full object-cover" width={1280} height={1600} />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent" />
            </div>
            {/* floating card 1 */}
            <div className="absolute -left-4 md:-left-10 top-10 glass rounded-2xl p-4 shadow-luxe w-56">
              <div className="text-[10px] tracking-[0.25em] text-gold">FEATURED</div>
              <div className="mt-1 font-display text-lg text-navy leading-tight">{featuredProperty.title}, {featuredProperty.loc}</div>
              <div className="mt-2 flex items-center gap-3 text-[11px] text-navy/60">
                <span className="flex items-center gap-1"><BedDouble size={12} /> {featuredProperty.beds}</span>
                <span className="flex items-center gap-1"><Bath size={12} /> {featuredProperty.baths}</span>
                <span className="flex items-center gap-1"><Maximize size={12} /> {featuredProperty.area}</span>
              </div>
            </div>
            {/* floating card 2 */}
            <div className="absolute -right-2 md:-right-8 bottom-10 glass rounded-2xl p-4 shadow-luxe w-60">
              <div className="flex items-center gap-2 text-[11px] text-navy/60"><ShieldCheck size={14} className="text-gold" /> Verified by Light Vision</div>
              <div className="mt-2 font-display text-xl text-navy">{featuredProperty.price}</div>
              <div className="mt-1 text-[11px] text-navy/50">Listed 3 days ago • 12 viewings booked</div>
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative mx-auto max-w-6xl px-6 -mt-10 pb-20">
          <div className="glass rounded-3xl shadow-luxe p-3 md:p-4">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-3">
              <SearchField label="Intent" value="Buy" />
              <SearchField label="Location" value="Any area" icon={<MapPin size={14} />} />
              <SearchField label="Property type" value="All types" />
              <SearchField label="Bedrooms" value="2+" />
              <SearchField label="Price range" value="R 1M – R 10M" />
              <button className="flex items-center justify-center gap-2 rounded-2xl bg-navy text-white text-sm font-medium px-5 py-3.5 hover:bg-navy/90 transition">
                <Search size={16} /> Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES — horizontal auto-scroll */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 flex items-end justify-between mb-10">
          <div>
            <div className="text-[11px] tracking-[0.35em] text-gold">FEATURED LISTINGS</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-navy leading-tight max-w-2xl">A curated selection of homes worth a second look.</h2>
          </div>
          <Link to="/properties" className="hidden md:inline-flex items-center gap-2 text-sm text-navy/70 hover:text-gold">View all <ArrowUpRight size={14} /></Link>
        </div>
        <div className="marquee-pause relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
          <div className="marquee-track flex gap-6 w-max pl-6">
            {properties.length > 0 ? (
              [...properties, ...properties].map((p, i) => (
                <article key={i} className="hover-lift shrink-0 w-[280px] sm:w-[320px] rounded-3xl overflow-hidden bg-white border border-black/5 shadow-[0_10px_40px_-20px_rgba(27,43,69,0.15)]">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img src={p.img} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
                    <span className="absolute top-3 left-3 rounded-full bg-white/90 text-navy text-[10px] tracking-[0.2em] px-3 py-1">{p.tag}</span>
                    <button className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 grid place-items-center text-navy hover:text-gold" aria-label="Favorite"><Heart size={15} /></button>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl text-navy">{p.title}</h3>
                    <div className="mt-1 flex items-center gap-1 text-xs text-navy/50"><MapPin size={12} /> {p.loc}</div>
                    <div className="mt-4 flex items-center gap-4 text-xs text-navy/60">
                      <span className="flex items-center gap-1"><BedDouble size={13} /> {p.beds}</span>
                      <span className="flex items-center gap-1"><Bath size={13} /> {p.baths}</span>
                      <span className="flex items-center gap-1"><Maximize size={13} /> {p.area}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
                      <div className="font-display text-lg text-navy">{p.price}</div>
                      <span className="text-[11px] text-gold tracking-widest">VIEW →</span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full rounded-[2rem] border border-dashed border-navy/20 bg-white/80 p-14 text-center text-navy/70">
                <div className="text-[11px] tracking-[0.35em] text-gold">NO LISTINGS YET</div>
                <div className="mt-4 text-3xl font-display">New properties will appear here once added by your admin or agents.</div>
                <p className="mt-4 text-sm leading-7 max-w-2xl mx-auto">There are currently no active property listings. Check back after the first Venda property has been added.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TOP 5 RATED AGENTS */}
      <section className="bg-warmgray/40">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-[11px] tracking-[0.35em] text-gold">TOP FIVE RATED AGENTS</div>
              <h2 className="mt-3 font-display text-4xl md:text-5xl text-navy leading-tight max-w-2xl">The names clients keep recommending.</h2>
            </div>
            <Link to="/agents" className="hidden md:inline-flex items-center gap-2 text-sm text-navy/70 hover:text-gold">Meet the team <ArrowUpRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {topAgents.length > 0 ? (
              topAgents.map((a, i) => (
                <article key={a.name} className="hover-lift relative rounded-3xl overflow-hidden bg-white border border-black/5 shadow-[0_10px_40px_-20px_rgba(27,43,69,0.15)]">
                  <div className="absolute top-3 left-3 z-10 h-8 w-8 rounded-full bg-navy text-gold font-display text-sm grid place-items-center">{i + 1}</div>
                  <div className="aspect-square overflow-hidden">
                    <img src={a.img} alt={a.name} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg text-navy leading-tight">{a.name}</h3>
                    <div className="text-[11px] text-navy/50 mt-0.5">{a.role}</div>
                    <div className="mt-3 flex items-center gap-1 text-gold">
                      <Star size={13} className="fill-gold" />
                      <span className="font-display text-base text-navy">{a.rating.toFixed(1)}</span>
                      <span className="text-[11px] text-navy/50 ml-1">({a.reviews})</span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full rounded-[2rem] border border-dashed border-navy/20 bg-white/80 p-14 text-center text-navy/70">
                <div className="text-[11px] tracking-[0.35em] text-gold">NO AGENTS AVAILABLE</div>
                <div className="mt-4 text-3xl font-display">Agent profiles will appear here once your admin adds them.</div>
                <p className="mt-4 text-sm leading-7 max-w-2xl mx-auto">No agents are listed yet. Once you add a local Limpopo specialist, this section will populate automatically.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* QUICK TOOLS / SERVICES */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-[11px] tracking-[0.35em] text-gold">OUR SERVICES</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-navy leading-tight">Everything you need to move forward.</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Calculator, t: "Bond Calculator", d: "Estimate your monthly repayments and total interest in seconds.", to: "/bond-calculator" },
              { icon: FileText, t: "Offer to Purchase", d: "Submit or download a legally reviewed, plain-English offer template.", to: "/offer-to-purchase" },
              { icon: Scale, t: "Legal Advisors", d: "A trusted network of attorneys, conveyancers and bond originators.", to: "/legal" },
            ].map(({ icon: Icon, t, d, to }) => (
              <Link key={t} to={to} className="hover-lift group rounded-3xl bg-white border border-black/5 p-8 shadow-[0_10px_40px_-25px_rgba(27,43,69,0.2)]">
                <div className="h-14 w-14 rounded-2xl grid place-items-center bg-gold/15 text-gold group-hover:bg-gold group-hover:text-white transition"><Icon size={22} /></div>
                <h3 className="mt-6 font-display text-2xl text-navy">{t}</h3>
                <p className="mt-2 text-sm text-navy/60">{d}</p>
                <div className="mt-6 text-[11px] tracking-[0.3em] text-gold">EXPLORE <ArrowUpRight size={12} className="inline" /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND PROMISE */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[5/6] rounded-[2rem] overflow-hidden shadow-luxe flex items-center justify-center bg-navy/5">
            <img src={logoImage} alt="Light Vision logo" className="h-32 w-auto object-contain" loading="lazy" />
          </div>
          <div>
            <div className="text-[11px] tracking-[0.35em] text-gold">WHY LIGHT VISION</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-navy leading-tight">A property partner, not a portal.</h2>
            <p className="mt-5 text-navy/60 max-w-lg">We've replaced the noise of typical listing sites with a slower, considered experience — built on quality photography, accurate data, and humans who actually answer the phone.</p>
            <div className="mt-10 grid sm:grid-cols-2 gap-6">
              {[
                { icon: ShieldCheck, t: "Verified Listings", d: "Every property personally vetted and photographed by our team." },
                { icon: Award, t: "Expert Agents", d: "Specialists by area, not generalists by volume." },
                { icon: Building2, t: "End-to-End", d: "Bond, legal and compliance handled in one place." },
                { icon: Sparkles, t: "Quiet Luxury", d: "A premium experience without the bravado." },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t}>
                  <div className="h-11 w-11 rounded-2xl grid place-items-center bg-gold/15 text-gold"><Icon size={18} /></div>
                  <div className="mt-3 font-display text-lg text-navy">{t}</div>
                  <p className="mt-1 text-sm text-navy/60">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-navy text-white px-8 md:px-16 py-16 md:py-24">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gold/30 blur-3xl" />
          <div className="relative grid lg:grid-cols-3 gap-10 items-center">
            <div className="lg:col-span-2">
              <div className="text-[11px] tracking-[0.35em] text-gold">THINKING OF SELLING?</div>
              <h2 className="mt-3 font-display text-4xl md:text-5xl leading-tight">Know exactly what your home is worth.</h2>
              <p className="mt-4 text-white/70 max-w-lg">A precise, no-pressure valuation from an area specialist — delivered within 48 hours.</p>
            </div>
            <div className="lg:justify-self-end">
              <Link to="/valuation" className="inline-flex items-center gap-2 rounded-full bg-gold text-navy font-semibold px-7 py-3.5 text-sm hover:bg-gold-soft transition">Request a Valuation <ArrowUpRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function SearchField({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/70 border border-white/80 px-4 py-2.5 hover:border-gold/40 transition">
      <div className="text-[10px] tracking-[0.25em] text-navy/40">{label.toUpperCase()}</div>
      <div className="mt-0.5 flex items-center gap-1.5 text-sm text-navy">{icon}{value}</div>
    </div>
  );
}
