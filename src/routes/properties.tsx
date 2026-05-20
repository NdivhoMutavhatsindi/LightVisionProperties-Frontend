import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout, PageHeader } from "@/components/site/Layout";
import { MapPin, BedDouble, Bath, Maximize, Heart, Search } from "lucide-react";
import { api } from "@/lib/api";
import p1 from "@/assets/prop-1.jpg";

export const Route = createFileRoute("/properties")({ component: Page, head: () => ({ meta: [{ title: "Properties — Light Vision Property" }] }) });

const defaultProperties: Array<{ img: string; title: string; loc: string; price: string; beds: number; baths: number; area: string; tag: string }> = [];

function normalizeProperty(item: any) {
  return {
    img: item.main_image ?? item.img ?? p1,
    title: item.title ?? item.address ?? "Property",
    loc: item.location ?? item.city ?? item.address ?? "Unknown location",
    price: typeof item.price === "number" ? `R ${item.price.toLocaleString()}` : item.price ?? "R 0",
    beds: Number(item.bedrooms ?? item.beds ?? 0),
    baths: Number(item.bathrooms ?? item.baths ?? 0),
    area: item.property_size ?? item.area ?? "—",
    tag: item.type ?? item.status ?? "For Sale",
  };
}

function Page() {
  const [properties, setProperties] = useState(defaultProperties);
  useEffect(() => {
    api
      .get("/api/properties")
      .then((response) => {
        const items = Array.isArray(response.data) ? response.data : [];
        setProperties(items.map(normalizeProperty));
      })
      .catch(() => {
        setProperties(defaultProperties);
      });
  }, []);
  return (
    <Layout>
      <PageHeader eyebrow="LISTINGS" title="Exceptional properties, beautifully curated." subtitle="Browse our latest residential and investment listings — every one verified, photographed and presented by our team." />
      <section className="mx-auto max-w-7xl px-6 -mt-10">
        <div className="glass rounded-3xl shadow-luxe p-3 md:p-4 grid grid-cols-2 md:grid-cols-6 gap-2">
          {["Buy","Any area","All types","2+","R 1M – R 10M"].map((v,i) => (
            <div key={i} className="rounded-2xl bg-white/70 border border-white/80 px-4 py-2.5 text-sm text-navy">{v}</div>
          ))}
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-navy text-white text-sm px-5 py-3.5"><Search size={16}/>Search</button>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-16">
        {properties.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p, i) => (
              <Link to="/properties" key={i} className="hover-lift rounded-3xl overflow-hidden bg-white border border-black/5 shadow-[0_10px_40px_-20px_rgba(27,43,69,0.15)]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={p.img} alt={p.title} className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105" loading="lazy" />
                  <span className="absolute top-3 left-3 rounded-full bg-white/90 text-navy text-[10px] tracking-[0.2em] px-3 py-1">{p.tag}</span>
                  <button className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 grid place-items-center text-navy hover:text-gold" aria-label="Favorite"><Heart size={15}/></button>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-navy">{p.title}</h3>
                  <div className="mt-1 flex items-center gap-1 text-xs text-navy/50"><MapPin size={12}/> {p.loc}</div>
                  <div className="mt-4 flex items-center gap-4 text-xs text-navy/60">
                    <span className="flex items-center gap-1"><BedDouble size={13}/> {p.beds}</span>
                    <span className="flex items-center gap-1"><Bath size={13}/> {p.baths}</span>
                    <span className="flex items-center gap-1"><Maximize size={13}/> {p.area}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
                    <div className="font-display text-lg text-navy">{p.price}</div>
                    <span className="text-[11px] text-gold tracking-widest">VIEW →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-navy/20 bg-white/80 p-14 text-center text-navy/70">
            <div className="text-[11px] tracking-[0.35em] text-gold">NO LISTINGS YET</div>
            <div className="mt-4 text-3xl font-display">Properties will appear here once admin or agents add listings.</div>
            <p className="mt-4 text-sm leading-7 max-w-2xl mx-auto">There are no active property listings at the moment. When your first Venda property is added, it will show up here immediately.</p>
          </div>
        )}
      </section>
    </Layout>
  );
}
