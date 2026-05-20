import { ArrowUpRightIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/95 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-10 md:grid-cols-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Light Vision</p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
            Thoughtful property advisory and seamless buying experiences for modern clients.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Contact</h3>
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <PhoneIcon className="h-5 w-5 text-gold shrink-0" />
              <div>
                <div className="font-semibold text-slate-900">Contact</div>
                <div>079 961 7443 or 071 709 3059</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <PhoneIcon className="h-5 w-5 text-gold shrink-0" />
              <div>
                <div className="font-semibold text-slate-900">WhatsApp</div>
                <div>079 961 7443</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <EnvelopeIcon className="h-5 w-5 text-gold shrink-0" />
              <div>
                <div className="font-semibold text-slate-900">Emails</div>
                <div className="space-y-1">
                  <a href="mailto:info@lightvisionproperties.co.za" className="block hover:text-slate-900">info@lightvisionproperties.co.za</a>
                  <a href="mailto:sales@lightvisionproperties.co.za" className="block hover:text-slate-900">sales@lightvisionproperties.co.za</a>
                  <a href="mailto:invoices@lightvisionproperties.co.za" className="block hover:text-slate-900">invoices@lightvisionproperties.co.za</a>
                  <a href="mailto:careers@lightvisionproperties.co.za" className="block hover:text-slate-900">careers@lightvisionproperties.co.za</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Locations & Social</h3>
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <MapPinIcon className="h-5 w-5 text-gold shrink-0" />
              <div>
                <div className="font-semibold text-slate-900">Office address</div>
                <div>Office number B02 Mashapha Complex<br />Thohoyandou<br />0950</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPinIcon className="h-5 w-5 text-gold shrink-0" />
              <div>
                <div className="font-semibold text-slate-900">Head office</div>
                <div>Narehousing Tswinga Block 09, House number 283<br />Thohoyandou<br />0950</div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="https://www.facebook.com/share/17ioDvXerQ/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:border-slate-300 hover:bg-slate-100 transition">
              <GlobeAltIcon className="h-4 w-4" /> Facebook
            </a>
            <a href="https://www.tiktok.com/@netshiavhamunei?_r=1&_t=ZS-96SMVV4juZ2" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:border-slate-300 hover:bg-slate-100 transition">
              <GlobeAltIcon className="h-4 w-4" /> TikTok
            </a>
            <a href="https://wa.me/message/LZH72TN7AOW5G1" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:border-slate-300 hover:bg-slate-100 transition">
              <GlobeAltIcon className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
