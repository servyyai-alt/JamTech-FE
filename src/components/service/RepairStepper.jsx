import React from "react";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

const STEPS_KEYS = ["steps.category", "steps.brand", "steps.model", "steps.variant", "steps.repair", "steps.booking"];

const RepairStepper = ({ current }) => {
  const { t } = useTranslation("repair");
  return (
    <div className="mb-10 flex items-center justify-center gap-1 overflow-x-auto">
      {STEPS_KEYS.map((key, i) => (
        <React.Fragment key={key}>
          <div className="flex flex-col items-center gap-1">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i < current ? "bg-primary-600 text-white" : i === current ? "bg-ink-900 text-white" : "bg-gray-100 text-gray-400"}`}>
              {i < current ? <Check size={14} /> : i + 1}
            </div>
            <span className={`text-[11px] font-medium ${i <= current ? "text-ink-900" : "text-gray-400"}`}>{t(key)}</span>
          </div>
          {i < STEPS_KEYS.length - 1 && <div className={`mx-1 h-0.5 w-6 md:w-10 ${i < current ? "bg-primary-600" : "bg-gray-100"}`} />}
        </React.Fragment>
      ))}
    </div>
  );
};
export default RepairStepper;
