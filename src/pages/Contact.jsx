import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";
import ReactDatePicker from "react-datepicker";
import { MapContainer, TileLayer } from "react-leaflet";
import { toast } from "react-toastify";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  inquiry: yup.object().required("Please choose an inquiry type"),
  date: yup.date().required("Select a contact date"),
  message: yup.string().required("Tell us what you need"),
});

const inquiryOptions = [
  { value: "valuation", label: "Property valuation" },
  { value: "purchase", label: "Buying advice" },
  { value: "sale", label: "Selling support" },
  { value: "rental", label: "Rental strategy" },
];

export default function Contact() {
  const { control, register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema), defaultValues: { inquiry: null, date: null } });

  const centre = useMemo(() => [-22.9474, 30.4589], []);

  const onSubmit = async (values) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          inquiry: values.inquiry?.value,
          date: values.date?.toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Unable to send request");
      toast.success("Thanks for reaching out. We’ll reply shortly.");
    } catch (error) {
      toast.error("Failed to send message. Try again later.");
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[0.95fr_0.9fr]">
      <section className="space-y-6 rounded-[2rem] bg-white p-8 shadow-sm">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Contact</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Let’s talk about your next move.</h1>
          <p className="mt-3 text-slate-600">Book a consultation, request a valuation, or ask about our latest listings.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Full name</span>
              <input type="text" {...register("name")} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none" />
              <p className="mt-1 text-xs text-red-500">{errors.name?.message}</p>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input type="email" {...register("email")} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none" />
              <p className="mt-1 text-xs text-red-500">{errors.email?.message}</p>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">What can we help with?</span>
              <Controller
                name="inquiry"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={inquiryOptions}
                    placeholder="Choose an inquiry type"
                    className="mt-2 text-sm"
                    classNamePrefix="react-select"
                  />
                )}
              />
              <p className="mt-1 text-xs text-red-500">{errors.inquiry?.message}</p>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Preferred date</span>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <ReactDatePicker
                    {...field}
                    selected={field.value}
                    onChange={field.onChange}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                    placeholderText="Pick a date"
                  />
                )}
              />
              <p className="mt-1 text-xs text-red-500">{errors.date?.message}</p>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Message</span>
            <textarea {...register("message")} rows="5" className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none" />
            <p className="mt-1 text-xs text-red-500">{errors.message?.message}</p>
          </label>

          <button type="submit" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Send message
          </button>
        </form>
      </section>

      <section className="space-y-6 rounded-[2rem] bg-white p-8 shadow-sm">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Office</p>
          <h2 className="text-2xl font-semibold text-slate-900">Thohoyandou, Limpopo</h2>
          <p className="text-sm leading-7 text-slate-600">Reach us from either our Mashapha Complex office or our Narehousing Tswinga head office.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Office</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">Office B02, Mashapha Complex<br />Thohoyandou, 0950</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Head office</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">Narehousing Tswinga Block 09<br />House number 283, Thohoyandou, 0950</p>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Contact</p>
          <p className="mt-3 text-sm leading-7 text-slate-700">Phone: +27 79 961 7443<br />Alt: +27 71 709 3059<br />WhatsApp: +27 79 961 7443</p>
          <p className="mt-4 text-sm leading-7 text-slate-700">Emails:<br />info@lightvisionproperties.co.za<br />sales@lightvisionproperties.co.za<br />invoices@lightvisionproperties.co.za<br />careers@lightvisionproperties.co.za</p>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200">
          <MapContainer center={centre} zoom={12} scrollWheelZoom={false} className="h-72 w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          </MapContainer>
        </div>
      </section>
    </div>
  );
}
