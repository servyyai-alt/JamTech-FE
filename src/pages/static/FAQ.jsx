import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "How long does a typical repair take?", a: "Most screen and battery repairs are completed same-day, often within 45-90 minutes for in-store visits." },
  { q: "Do you offer a warranty on repairs?", a: "Yes, every repair includes a warranty ranging from 90 days to 12 months depending on the service." },
  { q: "What service methods are available?", a: "Store visit, pickup & delivery, mail-in repair, and on-site repair — availability depends on your location and device." },
  { q: "Can I track my repair or order?", a: "Yes, use the Track Repair or Track Order links in the navbar with your booking or order number." },
  { q: "What payment methods do you accept?", a: "We accept all major cards and popular local payment methods through our secure Adyen-powered checkout." },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);
  return (
    <div className="container-px section-y mx-auto max-w-3xl">
      <h1 className="mb-10 text-center font-display text-3xl font-bold">Frequently Asked Questions</h1>
      <div className="space-y-3">
        {FAQS.map((f, i) => (
          <div key={i} className="card overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between p-5 text-left font-medium">
              {f.q}
              <ChevronDown size={18} className={`transition ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <p className="border-t border-gray-100 p-5 text-sm text-gray-600">{f.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
export default FAQ;
