import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AOS from "aos";
import { FaHandshake, FaLeaf, FaBuilding } from "react-icons/fa";
import { api } from "../lib/api.js";
import Lottie from "lottie-react";
import { gsap } from "gsap";

const features = [
  { title: "Premium listings", description: "Curated properties across South Africa's strongest suburbs.", icon: FaBuilding },
  { title: "Reliable advice", description: "Transparent pricing, bond coaching, and legal guidance.", icon: FaHandshake },
  { title: "Green growth", description: "Sustainably minded properties with strong long-term value.", icon: FaLeaf },
];

const featuredProperties = [
  { title: "Oceanfront Retreat", location: "Camps Bay", price: "R 24,500,000", beds: 5, baths: 4, area: "640 m²" },
  { title: "Skyline Penthouse", location: "Sandton Central", price: "R 18,900,000", beds: 3, baths: 3, area: "320 m²" },
  { title: "Linden Residence", location: "Bryanston", price: "R 42,000 / mo", beds: 4, baths: 3, area: "410 m²" },
  { title: "Maison Verte", location: "Constantia", price: "R 11,750,000", beds: 4, baths: 3, area: "380 m²" },
  { title: "Atelier Villa", location: "Camps Bay", price: "R 24,500,000", beds: 5, baths: 4, area: "640 m²" },
];

export default function Home() {
  const [animationData, setAnimationData] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, delay: 100 });
    gsap.from(".hero-card", { y: 40, opacity: 0, stagger: 0.18, duration: 0.8, ease: "power3.out" });
    fetch("https://assets7.lottiefiles.com/packages/lf20_s2lphzky.json")
      .then((response) => response.json())
      .then(setAnimationData)
      .catch(() => null);
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    let rafId;
    const step = () => {
      if (!element) return;
      element.scrollLeft += 0.8;
      if (element.scrollLeft >= element.scrollWidth - element.clientWidth) {
        element.scrollLeft = 0;
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="space-y-16">
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 px-6 py-16 text-white overflow-hidden shadow-2xl sm:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">New launch</span>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">A smarter property experience for buyers and investors.</h1>
            <p className="max-w-xl text-slate-300">Browse premium homes, book valuation consultations, and get straight-to-the-point guidance from our local team.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/properties" className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-gold/20 transition hover:bg-orange-400">
                Browse properties
              </Link>
              <Link to="/valuation" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-gold hover:bg-white/20">
                Get a valuation
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-950/90 p-4 shadow-2xl shadow-black/30">
            {animationData ? (
              <Lottie animationData={animationData} loop={true} />
            ) : (
              <div className="h-80 w-full rounded-[1.5rem] bg-slate-800" />
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        {features.map(({ title, description, icon: Icon }) => (
          <article key={title} className="hero-card rounded-3xl border border-slate-200/70 bg-white p-8 shadow-sm" data-aos="fade-up">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
              <Icon className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
          </article>
        ))}
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Featured listings</p>
            <h2 className="text-3xl font-semibold text-slate-900">A curated collection of homes worth a second look.</h2>
          </div>
          <Link to="/properties" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            View all properties
          </Link>
        </div>

        <div ref={scrollRef} className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto rounded-[2rem] bg-slate-950/5 p-6 shadow-sm">
          {featuredProperties.map((property) => (
            <article key={property.title} className="min-w-[20rem] snap-start rounded-[2rem] bg-white shadow-lg shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="h-56 w-full rounded-t-[2rem] bg-slate-200" />
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
                  <span>{property.location}</span>
                  <span>{property.area}</span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold text-slate-900">{property.title}</h3>
                  <p className="text-lg font-semibold text-slate-900">{property.price}</p>
                </div>
                <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
                  <span>{property.beds} beds</span>
                  <span>{property.baths} baths</span>
                  <span>{property.area}</span>
                </div>
                <Link to="/properties" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                  View details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 p-8 text-white shadow-2xl" data-aos="fade-right">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Today's market</p>
            <h2 className="text-3xl font-semibold">Find the right balance of lifestyle and investment.</h2>
            <p className="text-sm leading-7 text-slate-200/90">Our team offers valuation guidance, property marketing, and purchase support for buyers who want a calm, confident transaction.</p>
            <p className="rounded-3xl bg-white/10 px-4 py-3 text-sm text-slate-100">Trusted by agents, developers, and private clients across coastal and inland markets.</p>
          </div>
        </div>
        <div className="space-y-6 rounded-3xl bg-white p-8 shadow-sm" data-aos="fade-left">
          <h2 className="text-3xl font-semibold text-slate-900">Why Light Vision</h2>
          <p className="text-sm leading-7 text-slate-600">A calm, high-end home buying experience built around great photography, reliable data, and personal support from our local team.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Verified listings</p>
              <p className="mt-3 text-sm text-slate-600">Every property personally vetted and photographed by our team.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Expert agents</p>
              <p className="mt-3 text-sm text-slate-600">Specialists by area, not generalists by volume.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
