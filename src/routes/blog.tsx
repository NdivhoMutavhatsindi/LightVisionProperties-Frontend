import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHeader } from "@/components/site/Layout";
import p1 from "@/assets/prop-1.jpg";
import p2 from "@/assets/prop-2.jpg";
import p3 from "@/assets/prop-3.jpg";

export const Route = createFileRoute("/blog")({ component: Page, head: () => ({ meta: [{ title: "Insights — Light Vision Property" }] }) });

const posts = [
  { img: p2, cat: "Market Insight", title: "South Africa's luxury market is shifting north — quietly.", read: "6 min" },
  { img: p3, cat: "Investment", title: "Why off-plan still wins in 2026 — if you pick the right node.", read: "4 min" },
  { img: p1, cat: "Lifestyle", title: "Designing a home that ages with you.", read: "5 min" },
];

function Page() {
  // Route removed: redirect to home
  if (typeof window !== "undefined") {
    window.location.replace("/");
    return null;
  }
  return null;
}
