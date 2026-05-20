import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHeader } from "@/components/site/Layout";
import p1 from "@/assets/prop-1.jpg";
import p2 from "@/assets/prop-2.jpg";
import p3 from "@/assets/prop-3.jpg";
import p4 from "@/assets/prop-4.jpg";
import n from "@/assets/neighborhood.jpg";

export const Route = createFileRoute("/neighborhoods")({ component: Page, head: () => ({ meta: [{ title: "Neighborhoods — Light Vision Property" }] }) });

const hoods = [
  { name: "Sandton", img: p3, tag: "Lifestyle & Business" },
  { name: "Camps Bay", img: p2, tag: "Coastal Luxury" },
  { name: "Constantia", img: p4, tag: "Family & Schools" },
  { name: "Bryanston", img: p1, tag: "Suburban Calm" },
  { name: "Stellenbosch", img: n, tag: "Wine & Culture" },
  { name: "Rosebank", img: p3, tag: "Urban Living" },
];

const lenses = [
  { t: "Lifestyle", d: "Restaurants, parks, weekend rhythm." },
  { t: "Schools", d: "Public, private and international." },
  { t: "Security", d: "Estates, response times, infrastructure." },
  { t: "Entertainment", d: "Culture, nightlife, retail." },
  { t: "Accessibility", d: "Commute, transit, airports." },
];

function Page() {
  // Route removed: redirecting to home
  if (typeof window !== "undefined") {
    window.location.replace("/");
    return null;
  }
  return null;
}
