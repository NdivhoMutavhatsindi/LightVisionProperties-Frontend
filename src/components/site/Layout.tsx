import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { MessageCircle } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-charcoal">
      <Nav />
      <main className="pt-24">{children}</main>
      <Footer />
      <a href="https://wa.me/" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-[#25D366] text-white grid place-items-center shadow-luxe hover:scale-105 transition" aria-label="WhatsApp">
        <MessageCircle size={24} />
      </a>
    </div>
  );
}

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="grad-soft border-b border-black/5">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        {eyebrow && <div className="text-[11px] tracking-[0.35em] text-gold mb-5 reveal">{eyebrow}</div>}
        <h1 className="font-display text-5xl md:text-7xl text-navy max-w-4xl leading-[1.02] reveal delay-1">{title}</h1>
        {subtitle && <p className="mt-6 max-w-2xl text-lg text-navy/60 reveal delay-2">{subtitle}</p>}
      </div>
    </section>
  );
}
