import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)} className="rounded-lg border border-gray-200 p-2 disabled:opacity-40">
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button key={p} onClick={() => onChange(p)} className={`h-9 w-9 rounded-lg text-sm font-medium ${p === page ? "bg-ink-900 text-white" : "border border-gray-200 hover:bg-gray-50"}`}>
          {p}
        </button>
      ))}
      <button disabled={page >= pages} onClick={() => onChange(page + 1)} className="rounded-lg border border-gray-200 p-2 disabled:opacity-40">
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
