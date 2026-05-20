import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHeader } from "@/components/site/Layout";
import { Phone, Mail, MapPin, MessageCircle, Globe } from "lucide-react";

export const Route = createFileRoute("/contact")({ component: Page, head: () => ({ meta: [{ title: "Contact — Light Vision Property" }] }) });

function Page() {
  return (
    <Layout>
      <PageHeader eyebrow="CONTACT" title="We'd love to hear from you." subtitle="Reach out for a viewing, a valuation, or simply a conversation." />
      <section className="mx-auto max-w-7xl px-6 py-16 grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-5">
          {[
            { icon: Phone, t: "Call us", d: "+27 79 961 7443 / +27 71 709 3059" },
            { icon: MessageCircle, t: "WhatsApp", d: "+27 79 961 7443" },
            {
              icon: Mail,
              t: "Email",
              d: (
                <div className="space-y-1">
                  <span>info@lightvisionproperties.co.za</span>
                  <span>sales@lightvisionproperties.co.za</span>
                  <span>invoices@lightvisionproperties.co.za</span>
                  <span>careers@lightvisionproperties.co.za</span>
                </div>
              ),
            },
            {
              icon: Globe,
              t: "Social",
              d: (
                <div className="space-y-2 text-sm">
                  <a href="https://www.facebook.com/share/17ioDvXerQ/" target="_blank" rel="noreferrer" className="hover:text-gold">
                    Facebook
                  </a>
                  <a href="https://www.tiktok.com/@netshiavhamunei?_r=1&_t=ZS-96SMVV4juZ2" target="_blank" rel="noreferrer" className="hover:text-gold">
                    TikTok
                  </a>
                  <a href="https://wa.me/message/LZH72TN7AOW5G1" target="_blank" rel="noreferrer" className="hover:text-gold">
                    WhatsApp
                  </a>
                </div>
              ),
            },
            { icon: MapPin, t: "Office", d: "Office number B02 Mashapha Complex, Thohoyandou, 0950" },
            { icon: MapPin, t: "Head office", d: "Narehousing Tswinga Block 09, House number 283, Thohoyandou, 0950" },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="hover-lift rounded-2xl bg-white border border-black/5 p-6 flex items-start gap-4">
              <div className="h-11 w-11 rounded-2xl bg-gold/15 text-gold grid place-items-center"><Icon size={18}/></div>
              <div>
                <div className="font-display text-lg text-navy">{t}</div>
                <div className="text-sm text-navy/60 mt-0.5">{d}</div>
              </div>
            </div>
          ))}
          <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-black/5">
            <iframe title="map" className="w-full h-full" src="https://www.openstreetmap.org/export/embed.html?bbox=30.4415%2C-22.9575%2C30.4755%2C-22.9345&layer=mapnik" />
          </div>
        </div>
        <form className="lg:col-span-3 rounded-[2rem] bg-white border border-black/5 p-8 md:p-10 shadow-[0_20px_60px_-30px_rgba(27,43,69,0.25)] space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Full name" />
            <Input label="Email" type="email" />
          </div>
          <Input label="Phone" type="tel" />
          <Input label="Subject" />
          <label className="block">
            <span className="text-[10px] tracking-[0.25em] text-navy/50">MESSAGE</span>
            <textarea rows={6} className="mt-1.5 w-full rounded-xl bg-white border border-black/10 px-4 py-3 text-sm outline-none focus:border-gold" />
          </label>
          <button className="w-full rounded-full bg-navy text-white text-sm font-medium py-3.5 hover:bg-navy/90 transition">Send message</button>
        </form>
      </section>
    </Layout>
  );
}

function Input({ label, type="text" }: { label: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-[0.25em] text-navy/50">{label.toUpperCase()}</span>
      <input type={type} className="mt-1.5 w-full rounded-xl bg-white border border-black/10 px-4 py-3 text-sm text-navy outline-none focus:border-gold transition" />
    </label>
  );
}
