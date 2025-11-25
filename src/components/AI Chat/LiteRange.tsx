import React from "react";

interface Props {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}

export default function LiteRange({
  value,
  min = 0.5,
  max = 2,
  step = 0.05,
  onChange
}: Props) {
  return (
    <div className="w-full">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="
          w-full
          accent-emerald-500
          h-2 rounded-lg cursor-pointer
        "
      />
      <div className="text-right text-xs opacity-70 mt-1">
        {value.toFixed(2)}
      </div>
    </div>
  );
}
