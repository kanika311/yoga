"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQList({ items = [] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item._id || item.question} className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <button
            className="flex w-full items-center justify-between px-6 py-5 text-left font-serif text-xl text-forest"
            onClick={() => setOpen(open === i ? -1 : i)}
          >
            {item.question}
            <ChevronDown className={`transition ${open === i ? "rotate-180" : ""}`} size={20} />
          </button>
          {open === i && <div className="px-6 pb-5 text-sm leading-relaxed text-forest-mid">{item.answer}</div>}
        </div>
      ))}
    </div>
  );
}
