import { Link } from "@tanstack/react-router";
import { Facebook, Globe, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  const isAdminPath = typeof window !== "undefined" && window.location?.pathname?.startsWith("/admin");

  return (
    <footer className="mt-32 bg-navy text-white/80">
      <div className="mx-auto max-w-7xl px-6 py-20 grid gap-8 lg:grid-cols-[minmax(220px,280px)_minmax(140px,1fr)_minmax(140px,1fr)_minmax(260px,320px)]">
        <div className="space-y-6">
          <img src={logo} alt="Light Vision" className="h-12 w-auto bg-white/95 rounded-lg p-1 inline-block" />
          <p className="max-w-sm text-sm leading-7 text-white/70">A digital luxury property experience — buy, rent, value and invest with confidence.</p>
          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/share/17ioDvXerQ/" target="_blank" rel="noreferrer noopener" aria-label="Facebook" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-gold hover:bg-gold/10">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://www.tiktok.com/@netshiavhamunei?_r=1&_t=ZS-96SMVV4juZ2" target="_blank" rel="noreferrer noopener" aria-label="TikTok" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-gold hover:bg-gold/10">
              <Globe className="h-5 w-5" />
            </a>
            <a href="https://wa.me/message/LZH72TN7AOW5G1" target="_blank" rel="noreferrer noopener" aria-label="WhatsApp" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-gold hover:bg-gold/10">
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs tracking-[0.3em] text-gold mb-4">EXPLORE</h4>
          <ul className="space-y-3 text-sm text-white/80">
            <li><Link to="/properties" className="hover:text-gold">Properties</Link></li>
            <li><Link to="/agents" className="hover:text-gold">Agents</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-[0.3em] text-gold mb-4">SERVICES</h4>
          <ul className="space-y-3 text-sm text-white/80">
            <li><Link to="/valuation" className="hover:text-gold">Property Valuation</Link></li>
            <li><Link to="/bond-calculator" className="hover:text-gold">Bond Calculator</Link></li>
            <li><Link to="/compliance" className="hover:text-gold">Compliance</Link></li>
            <li><Link to="/legal" className="hover:text-gold">Legal Advisors</Link></li>
            <li><Link to="/offer-to-purchase" className="hover:text-gold">Offer to Purchase</Link></li>
            <li><Link to="/careers" className="hover:text-gold">Careers</Link></li>
          </ul>
        </div>

        <div className="grid gap-6">
          <div className="rounded-3xl bg-white/5 p-6">
            <h4 className="text-xs tracking-[0.3em] text-gold mb-4">CONNECT</h4>
            <div className="space-y-4 text-sm text-white/80">
              <div>
                <p className="text-[11px] tracking-[0.35em] text-white/50 uppercase">Phone & WhatsApp</p>
                <p className="mt-3 text-base text-white">079 961 7443</p>
                <p className="text-base text-white">071 709 3059</p>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.35em] text-white/50 uppercase">Inquiries</p>
                <div className="mt-3 space-y-2 text-sm text-white/80">
                  <a href="mailto:info@lightvisionproperties.co.za" className="block hover:text-gold">info@lightvisionproperties.co.za</a>
                  <a href="mailto:sales@lightvisionproperties.co.za" className="block hover:text-gold">sales@lightvisionproperties.co.za</a>
                  <a href="mailto:invoices@lightvisionproperties.co.za" className="block hover:text-gold">invoices@lightvisionproperties.co.za</a>
                  <a href="mailto:careers@lightvisionproperties.co.za" className="block hover:text-gold">careers@lightvisionproperties.co.za</a>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white/5 p-6">
            <h4 className="text-xs tracking-[0.3em] text-gold mb-4">OFFICES</h4>
            <div className="grid gap-6 text-sm text-white/80">
              <div>
                <p className="text-[11px] tracking-[0.35em] text-white/50 uppercase">Thohoyandou branch</p>
                <p className="mt-3 text-white">Office B02 Mashapha Complex</p>
                <p className="text-white">Thohoyandou, 0950</p>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.35em] text-white/50 uppercase">Head office</p>
                <p className="mt-3 text-white">Narehousing Tswinga Block 09, House 283</p>
                <p className="text-white">Thohoyandou, 0950</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <p>© {new Date().getFullYear()} Light Vision Property. All rights reserved.</p>
            <p>Crafted with care.</p>
          </div>
          {!isAdminPath && (
            <Link
              to="/login"
              aria-label="Admin or agent login"
              className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white/90 transition hover:border-gold hover:bg-gold/10 hover:text-gold"
            >
              Admin / Agent Login
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
