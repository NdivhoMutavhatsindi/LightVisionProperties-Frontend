import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { api } from "../lib/api.js";
import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/outline";
import "swiper/css/navigation";
import "swiper/css/pagination";

const fetchProperties = async () => {
  const response = await api.get("/api/properties");
  return response.data;
};

export default function Properties() {
  const { data = [], isLoading } = useQuery(["properties"], fetchProperties, {
    staleTime: 1000 * 60 * 2,
  });

  const properties = useMemo(
    () =>
      data.length
        ? data
        : [
            { title: "Oceanfront Retreat", location: "Camps Bay", price: "R 24,500,000", beds: 5, baths: 4, area: "640 m²" },
            { title: "Skyline Penthouse", location: "Sandton Central", price: "R 18,900,000", beds: 3, baths: 3, area: "320 m²" },
            { title: "Linden Residence", location: "Bryanston", price: "R 42,000 / mo", beds: 4, baths: 3, area: "410 m²" },
          ],
    [data],
  );

  return (
    <div className="space-y-10">
      <header className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Properties</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Browse the latest listings.</h1>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
            <SparklesIcon className="h-5 w-5 text-gold" /> Trusted collection
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="rounded-3xl bg-white p-10 text-center text-slate-600 shadow-sm">Loading properties...</div>
      ) : (
        <Swiper modules={[Navigation, Pagination]} spaceBetween={24} slidesPerView={1} navigation pagination={{ clickable: true }} breakpoints={{ 768: { slidesPerView: 2 } }}>
          {properties.map((property) => (
            <SwiperSlide key={property.title}>
              <motion.article className="rounded-[2rem] bg-white p-8 shadow-sm" whileHover={{ y: -6 }}>
                <div className="h-64 rounded-[1.75rem] bg-slate-200" />
                <div className="mt-6 space-y-3">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{property.location}</p>
                  <h2 className="text-2xl font-semibold text-slate-900">{property.title}</h2>
                  <p className="text-lg font-semibold text-slate-900">{property.price}</p>
                  <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
                    <span>{property.beds} beds</span>
                    <span>{property.baths} baths</span>
                    <span>{property.area}</span>
                  </div>
                </div>
              </motion.article>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
