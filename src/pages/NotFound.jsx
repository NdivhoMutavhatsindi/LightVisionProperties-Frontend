import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="rounded-[2rem] bg-white p-12 text-center shadow-sm">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">404</p>
      <h1 className="mt-4 text-4xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-4 text-slate-600">The page you are looking for does not exist, or the link may be broken.</p>
      <Link to="/" className="mt-8 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
        Return home
      </Link>
    </div>
  );
}
