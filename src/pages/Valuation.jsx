import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

const schema = yup.object({
  propertyType: yup.string().required("Choose a property type"),
  price: yup.number().typeError("Enter a valid price").positive("Price must be positive").required("Price estimate is required"),
  beds: yup.number().typeError("Enter a valid number").positive("Must be at least 1").integer("Must be a whole number").required("Bedrooms are required"),
  area: yup.number().typeError("Enter a valid area").positive("Area must be positive").required("Area is required"),
});

export default function Valuation() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { propertyType: "home", price: 5500000, beds: 3, area: 210 },
  });

  const onSubmit = (values) => {
    toast.success(`Valuation request submitted for a ${values.beds}-bed property.`);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[0.95fr_0.85fr]">
      <section className="space-y-6 rounded-[2rem] bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Valuation</p>
        <h1 className="text-3xl font-semibold text-slate-900">Estimate your property's market value.</h1>
        <p className="text-slate-600">Complete the form and our valuation team will share a locally calibrated estimate within one business day.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Property type</span>
            <select {...register("propertyType")} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none">
              <option value="home">Residential home</option>
              <option value="townhouse">Townhouse</option>
              <option value="apartment">Apartment</option>
              <option value="land">Land parcel</option>
            </select>
            <p className="mt-1 text-xs text-red-500">{errors.propertyType?.message}</p>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Price guide</span>
            <input type="number" {...register("price")} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none" />
            <p className="mt-1 text-xs text-red-500">{errors.price?.message}</p>
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Bedrooms</span>
              <input type="number" {...register("beds")} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none" />
              <p className="mt-1 text-xs text-red-500">{errors.beds?.message}</p>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Size (m²)</span>
              <input type="number" {...register("area")} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none" />
              <p className="mt-1 text-xs text-red-500">{errors.area?.message}</p>
            </label>
          </div>

          <button type="submit" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Request valuation
          </button>
        </form>
      </section>

      <section className="rounded-[2rem] bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-500 p-8 text-white shadow-2xl">
        <h2 className="text-2xl font-semibold">How the process works</h2>
        <div className="mt-5 space-y-4 text-sm leading-7">
          <p>1. Share your property details and current asking price.</p>
          <p>2. We compare local market activity, demand, and finance sentiment.</p>
          <p>3. You receive a guided valuation report and next-step recommendation.</p>
        </div>
      </section>
    </div>
  );
}
