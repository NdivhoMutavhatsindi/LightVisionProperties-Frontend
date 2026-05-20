import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHeader } from "@/components/site/Layout";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/bond-calculator")({ component: Page, head: () => ({ meta: [{ title: "Bond Calculator — Light Vision Property" }] }) });

function fmt(n: number) { return "R " + Math.round(n).toLocaleString(); }

function Page() {
  const [price, setPrice] = useState(3500000);
  const [deposit, setDeposit] = useState(350000);
  const [rate, setRate] = useState(11.25);
  const [term, setTerm] = useState(20);

  const { monthly, total, interest, loan } = useMemo(() => {
    const loan = Math.max(price - deposit, 0);
    const r = rate / 100 / 12;
    const n = term * 12;
    const monthly = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
    const total = monthly * n;
    return { loan, monthly, total, interest: total - loan };
  }, [price, deposit, rate, term]);

  return (
    <Layout>
      <PageHeader eyebrow="BOND CALCULATOR" title="See your repayment in seconds." subtitle="A simple, fintech-grade calculator to help you plan with confidence." />
      <section className="mx-auto max-w-7xl px-6 py-16 grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 rounded-[2rem] bg-white border border-black/5 p-8 md:p-10 shadow-[0_20px_60px_-30px_rgba(27,43,69,0.25)] space-y-8">
          <Slider label="Property Price" value={price} setValue={setPrice} min={500000} max={50000000} step={50000} format={fmt} />
          <Slider label="Deposit" value={deposit} setValue={setDeposit} min={0} max={Math.max(price*0.6, 100000)} step={10000} format={fmt} />
          <Slider label="Interest Rate (%)" value={rate} setValue={setRate} min={5} max={20} step={0.25} format={(v: number) => v.toFixed(2) + "%"} />
          <Slider label="Loan Term (years)" value={term} setValue={setTerm} min={5} max={30} step={1} format={(v: number) => v + " years"} />
        </div>
        <div className="lg:col-span-2 rounded-[2rem] bg-navy text-white p-8 md:p-10 shadow-luxe space-y-6 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative">
            <div className="text-[11px] tracking-[0.3em] text-gold">ESTIMATED MONTHLY</div>
            <div className="mt-2 font-display text-5xl">{fmt(monthly)}</div>
          </div>
          <div className="relative space-y-3 pt-4 border-t border-white/10 text-sm">
            <Row label="Loan amount" value={fmt(loan)} />
            <Row label="Total interest" value={fmt(interest)} />
            <Row label="Total repaid" value={fmt(total)} />
          </div>
          <button className="relative w-full rounded-full bg-gold text-navy font-semibold py-3 text-sm hover:bg-gold-soft transition">Apply for a bond</button>
        </div>
      </section>
    </Layout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between text-white/70"><span>{label}</span><span className="text-white font-medium">{value}</span></div>;
}

function Slider({ label, value, setValue, min, max, step, format }: any) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[10px] tracking-[0.25em] text-navy/50">{label.toUpperCase()}</span>
        <span className="font-display text-2xl text-navy">{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => setValue(parseFloat(e.target.value))} className="w-full accent-[#C8A96B]" />
    </div>
  );
}
