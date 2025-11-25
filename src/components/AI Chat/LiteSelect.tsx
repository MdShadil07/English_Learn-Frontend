import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  code: string;
  name: string;
  flag?: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

export default function LiteSelect({ value, onChange, options }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => setOpen((o) => !o), []);
  const close = useCallback(() => setOpen(false), []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains((e.target as Node))) close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [close]);

  const selected = options.find((o) => o.code === value);

  return (
    <div ref={ref} className="relative w-full">
      <button
        onClick={toggle}
        className="flex w-full justify-between items-center px-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm"
      >
        <span className="truncate">
          {selected?.flag} {selected?.name}
        </span>
        <ChevronDown className="w-4 h-4 opacity-70" />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-50 max-h-60 overflow-auto">
          {options.map((opt) => (
            <button
              key={opt.code}
              onClick={() => {
                onChange(opt.code);
                close();
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {opt.flag} {opt.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
