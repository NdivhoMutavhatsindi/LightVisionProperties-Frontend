import { useMemo, useState } from "react";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(value);
}

export default function BondCalculator() {
  const [price, setPrice] = useState(3500000);
  const [deposit, setDeposit] = useState(350000);
  const [rate, setRate] = useState(11.25);
  const [term, setTerm] = useState(20);

  const loanAmount = Math.max(price - deposit, 0);
  const monthlyPayment = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const months = term * 12;
    if (monthlyRate === 0) return loanAmount / months;
    return (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  }, [loanAmount, rate, term]);

  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Bond calculator</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Estimate your monthly bond repayment.</h1>
        <p className="mt-3 text-slate-600">Adjust the values below to see what your mortgage payment might look like.</p>

        <div className="grid gap-8 py-8 md:grid-cols-2">
          <div className="space-y-4 rounded-3xl bg-slate-50 p-6">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Property price</span>
              <input type="range" min="1000000" max="10000000" step="50000" value={price} onChange={(event) => setPrice(Number(event.target.value))} className="mt-4 w-full" />
              <div className="mt-2 text-sm text-slate-800">{formatCurrency(price)}</div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Deposit</span>
              <input type="range" min="0" max={price} step="25000" value={deposit} onChange={(event) => setDeposit(Number(event.target.value))} className="mt-4 w-full" />
              <div className="mt-2 text-sm text-slate-800">{formatCurrency(deposit)}</div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Interest rate (%)</span>
              <input type="range" min="5" max="18" step="0.25" value={rate} onChange={(event) => setRate(Number(event.target.value))} className="mt-4 w-full" />
              <div className="mt-2 text-sm text-slate-800">{rate.toFixed(2)}%</div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Term (years)</span>
              <input type="range" min="5" max="30" step="1" value={term} onChange={(event) => setTerm(Number(event.target.value))} className="mt-4 w-full" />
              <div className="mt-2 text-sm text-slate-800">{term} years</div>
            </label>
          </div>

          <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Your bond estimate</p>
            <div className="mt-6 space-y-5">
              <div className="rounded-3xl bg-white/10 p-6">
                <p className="text-sm text-slate-300">Loan amount</p>
                <p className="mt-3 text-3xl font-semibold text-white">{formatCurrency(loanAmount)}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-6">
                <p className="text-sm text-slate-300">Monthly payment</p>
                <p className="mt-3 text-3xl font-semibold text-white">{formatCurrency(monthlyPayment)}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-6 text-sm leading-6 text-slate-300">
                This estimate is for illustration only. Talk to your preferred bond originator for an exact repayment schedule and finance approval.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
