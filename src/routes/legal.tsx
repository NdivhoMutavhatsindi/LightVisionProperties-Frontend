import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHeader } from "@/components/site/Layout";
import { Scale, Landmark, FileSignature, Briefcase } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/legal")({ component: Page, head: () => ({ meta: [{ title: "Legal Advisors — Light Vision Property" }] }) });

const groups = [
  { value: "Attorneys", label: "Attorneys" },
  { value: "Bond Originators", label: "Bond Originators" },
  { value: "Conveyancers", label: "Conveyancers" },
  { value: "Legal Consultants", label: "Legal Consultants" },
];

function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiry, setInquiry] = useState(groups[0].value);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, inquiry, message, phone, date: new Date().toISOString() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Failed to send request");
      }
      setSuccess("Your request has been sent. We'll be in touch shortly.");
      setName("");
      setEmail("");
      setPhone("");
      setInquiry(groups[0].value);
      setMessage("");
    } catch (err) {
      setError(String(err.message || err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <PageHeader eyebrow="LEGAL" title="Request a legal advisor" subtitle="Tell us what you need and we'll connect you with the right partner." />

      <section className="mx-auto max-w-3xl px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-3xl p-8 border border-black/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-xs text-navy/70">Full name</div>
              <input required value={name} onChange={e => setName(e.target.value)} className="mt-2 w-full rounded-lg border px-3 py-2" />
            </label>
            <label className="block">
              <div className="text-xs text-navy/70">Email</div>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full rounded-lg border px-3 py-2" />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-xs text-navy/70">Phone (optional)</div>
              <input value={phone} onChange={e => setPhone(e.target.value)} className="mt-2 w-full rounded-lg border px-3 py-2" />
            </label>
            <label className="block">
              <div className="text-xs text-navy/70">Type of advisor</div>
              <select value={inquiry} onChange={e => setInquiry(e.target.value)} className="mt-2 w-full rounded-lg border px-3 py-2">
                {groups.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <div className="text-xs text-navy/70">Message</div>
            <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={6} className="mt-2 w-full rounded-lg border px-3 py-2" />
          </label>

          <div className="flex items-center justify-between">
            <div className="text-sm text-navy/60">We respect your privacy. We'll only share details with vetted partners to respond to your request.</div>
            <div>
              <button type="submit" disabled={submitting} className="rounded-full bg-navy text-white px-4 py-2 font-semibold hover:opacity-95 disabled:opacity-50">
                {submitting ? "Sending…" : "Request Advisor"}
              </button>
            </div>
          </div>

          {success && <div className="text-sm text-green-600">{success}</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}
        </form>
      </section>
    </Layout>
  );
}
