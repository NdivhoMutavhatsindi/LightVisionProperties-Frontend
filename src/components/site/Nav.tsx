import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties" },
  { to: "/about", label: "About" },
  { to: "/agents", label: "Agents" },
  { to: "/services", label: "Services" },
  
  { to: "/contact", label: "Contact" },
];

const more = [
  { to: "/valuation", label: "Valuation" },
  { to: "/compliance", label: "Compliance" },
  { to: "/offer-to-purchase", label: "Offer to Purchase" },
  { to: "/legal", label: "Legal Advisors" },
  { to: "/bond-calculator", label: "Bond Calculator" },
  { to: "/careers", label: "Careers" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isAdminPath, setIsAdminPath] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    f(); window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    const check = () => {
      const isAdmin = typeof window !== 'undefined' && window.location?.pathname?.startsWith('/admin');
      setIsAdminPath(isAdmin);
    };
    check();
    window.addEventListener('popstate', check);
    return () => window.removeEventListener('popstate', check);
  }, []);

  useEffect(() => {
    if (!isAdminPath) return;
    let mounted = true;
    api.get('/api/auth/me')
      .then((res) => {
        if (!mounted) return;
        const name = res.data?.user?.name || res.data?.user?.email || null;
        setAdminName(name);
      })
      .catch(() => setAdminName(null));
    return () => { mounted = false; };
  }, [isAdminPath]);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-4"}`}>
      <div className="mx-auto max-w-7xl px-4">
        <div className={`flex items-center justify-between rounded-2xl px-4 md:px-6 py-3 transition-all ${scrolled ? "glass shadow-luxe" : "bg-white/40 backdrop-blur-md border border-white/40"}`}>
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Light Vision Property" className="h-10 w-auto" />
            <div className="hidden sm:block leading-tight">
              <div className="font-display text-[15px] font-semibold text-navy tracking-wide">LIGHT VISION</div>
              <div className="text-[10px] tracking-[0.3em] text-gold">PROPERTY</div>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium text-navy/80">
            {links.map(l => (
              <Link key={l.to} to={l.to} className="hover:text-gold transition-colors" activeProps={{ className: "text-gold" }}>{l.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {isAdminPath ? (
              <div className="flex items-center gap-3">
                <div className="text-sm text-navy/70">Dashboard</div>
                <div className="font-medium text-navy">{adminName ?? 'Admin'}</div>
              </div>
            ) : (
              <Link to="/valuation" className="hidden md:inline-flex items-center rounded-full bg-navy text-white text-[13px] font-medium px-5 py-2.5 hover:bg-navy/90 transition">Get Valuation</Link>
            )}
            {isAdminPath ? (
              <button
                onClick={async () => {
                  try {
                    await api.post('/api/auth/logout');
                  } catch (e) {
                    // ignore
                  }
                  window.location.href = '/';
                }}
                className="ml-3 rounded-full border border-navy/10 px-4 py-2 text-sm font-medium text-navy hover:bg-navy/5"
              >
                Logout
              </button>
            ) : (
              <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-navy" aria-label="Menu">
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            )}
          </div>
        </div>
        {open && (
          <div className="lg:hidden mt-2 glass rounded-2xl p-4 shadow-luxe">
            <div className="grid grid-cols-2 gap-2">
              {[...links, ...more].map(l => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg text-sm text-navy hover:bg-white/60">{l.label}</Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
