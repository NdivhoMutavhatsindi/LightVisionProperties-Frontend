import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { Layout, PageHeader } from "@/components/site/Layout";
import { api } from "@/lib/api";
import { toast } from "sonner";
import brand from "@/assets/brand-hero.png";

export const Route = createFileRoute("/valuation")({
  component: Page,
  head: () => ({ meta: [{ title: "Free Property Valuation — Light Vision Property" }] }),
});

type ValuationFormValues = {
  fullName: string;
  email: string;
  phone: string;
  propertyAddress: string;
  propertyType: string;
  estimatedValue: string;
  notes: string;
};

function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ValuationFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      propertyAddress: "",
      propertyType: "House",
      estimatedValue: "",
      notes: "",
    },
  });

  const onSubmit = async (values: ValuationFormValues) => {
    try {
      await api.post("/api/valuations", {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone || null,
        propertyAddress: values.propertyAddress,
        propertyType: values.propertyType,
        estimatedValue: values.estimatedValue || null,
        notes: values.notes || null,
      });
      toast.success("Your valuation request was submitted. We'll be in touch shortly.");
      reset();
    } catch (error) {
      console.error("Valuation submit error:", error);
      toast.error("Unable to submit request. Please try again.");
    }
  };

  return (
    <Layout>
      <PageHeader
        eyebrow="VALUATION"
        title="Know exactly what your home is worth."
        subtitle="A precise, evidence-based valuation delivered in 48 hours by an area specialist."
      />
      <section className="mx-auto max-w-7xl px-6 py-16 grid lg:grid-cols-2 gap-12 items-start">
        <div className="rounded-[2rem] grad-warm aspect-[4/5] shadow-luxe grid place-items-center p-10">
          <img src={brand} alt="Light Vision" className="max-h-full w-auto" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-[2rem] bg-white border border-black/5 p-8 md:p-10 shadow-[0_20px_60px_-30px_rgba(27,43,69,0.25)] space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <label className="block">
              <span className="text-[10px] tracking-[0.25em] text-navy/50">FULL NAME</span>
              <input
                {...register("fullName", { required: "Full name is required" })}
                placeholder="Your full name"
                className="mt-1.5 w-full rounded-xl bg-white border border-black/10 px-4 py-3 text-sm text-navy outline-none focus:border-gold transition"
              />
              {errors.fullName && <p className="mt-2 text-xs text-rose-600">{errors.fullName.message}</p>}
            </label>
            <label className="block">
              <span className="text-[10px] tracking-[0.25em] text-navy/50">PHONE</span>
              <input
                {...register("phone")}
                type="tel"
                placeholder="+27 …"
                className="mt-1.5 w-full rounded-xl bg-white border border-black/10 px-4 py-3 text-sm text-navy outline-none focus:border-gold transition"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-[10px] tracking-[0.25em] text-navy/50">EMAIL</span>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
              })}
              type="email"
              placeholder="you@example.com"
              className="mt-1.5 w-full rounded-xl bg-white border border-black/10 px-4 py-3 text-sm text-navy outline-none focus:border-gold transition"
            />
            {errors.email && <p className="mt-2 text-xs text-rose-600">{errors.email.message}</p>}
          </label>

          <label className="block">
            <span className="text-[10px] tracking-[0.25em] text-navy/50">PROPERTY ADDRESS</span>
            <input
              {...register("propertyAddress", { required: "Property address is required" })}
              placeholder="Street, suburb, city"
              className="mt-1.5 w-full rounded-xl bg-white border border-black/10 px-4 py-3 text-sm text-navy outline-none focus:border-gold transition"
            />
            {errors.propertyAddress && <p className="mt-2 text-xs text-rose-600">{errors.propertyAddress.message}</p>}
          </label>

          <div className="grid sm:grid-cols-2 gap-5">
            <label className="block">
              <span className="text-[10px] tracking-[0.25em] text-navy/50">PROPERTY TYPE</span>
              <select
                {...register("propertyType", { required: "Property type is required" })}
                className="mt-1.5 w-full rounded-xl bg-white border border-black/10 px-4 py-3 text-sm text-navy outline-none focus:border-gold transition"
              >
                <option value="House">Residential home</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Apartment">Apartment</option>
                <option value="Land">Land parcel</option>
              </select>
              {errors.propertyType && <p className="mt-2 text-xs text-rose-600">{errors.propertyType.message}</p>}
            </label>
            <label className="block">
              <span className="text-[10px] tracking-[0.25em] text-navy/50">ESTIMATED VALUE</span>
              <input
                {...register("estimatedValue")}
                placeholder="R …"
                className="mt-1.5 w-full rounded-xl bg-white border border-black/10 px-4 py-3 text-sm text-navy outline-none focus:border-gold transition"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-[10px] tracking-[0.25em] text-navy/50">NOTES</span>
            <textarea
              {...register("notes")}
              rows={4}
              placeholder="Tell us anything else you'd like us to know about the property."
              className="mt-1.5 w-full rounded-xl bg-white border border-black/10 px-4 py-3 text-sm text-navy outline-none focus:border-gold transition"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-navy text-white text-sm font-medium py-3.5 hover:bg-navy/90 transition disabled:cursor-not-allowed disabled:bg-navy/60"
          >
            {isSubmitting ? "Sending request…" : "Request my valuation"}
          </button>
          <p className="text-[11px] text-navy/40 text-center">No obligation. We'll be in touch within one business day.</p>
        </form>
      </section>
    </Layout>
  );
}
