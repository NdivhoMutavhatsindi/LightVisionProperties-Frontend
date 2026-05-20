import { ToastContainer } from "react-toastify";
import { useLenis } from "../hooks/useLenis.js";
import Footer from "./Footer.jsx";
import Nav from "./Nav.jsx";

export default function Layout({ children }) {
  useLenis();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-gold selection:text-slate-950">
      <Nav />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">{children}</main>
      <Footer />
      <ToastContainer position="top-right" theme="light" />
    </div>
  );
}
