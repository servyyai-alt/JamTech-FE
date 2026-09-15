import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const FAQ_KEYS = ["duration", "warranty", "methods", "track", "payment"];

const FAQ = () => {
  const { t } = useTranslation("static");
  const [open, setOpen] = useState(null);
  return (
    <div className="container-px section-y mx-auto max-w-3xl">
      <h1 className="mb-10 text-center font-display text-3xl font-bold">{t("faq.title")}</h1>
      <div className="space-y-3">
        {FAQ_KEYS.map((key, i) => (
          <div key={i} className="card overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between p-5 text-left font-medium">
              {t(`faq.items.${key}.q`)}
              <ChevronDown size={18} className={`transition ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <p className="border-t border-gray-100 p-5 text-sm text-gray-600">{t(`faq.items.${key}.a`)}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
export default FAQ;