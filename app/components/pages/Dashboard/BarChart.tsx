import React from "react";

interface BarChartProps {
  data: { label: string; value: number }[];
}

const BarChart = ({ data }: BarChartProps) => {
  const max = Math.max(...data.map((d) => d.value)) || 1;

  return (
    <div className="relative h-64 w-full bg-surface">
      {/* gridlines */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-light-emphasis"
            style={{ top: `${i * 20}%` }}
          />
        ))}
      </div>

      {/* bars */}
      <div className="absolute inset-0 px-2 pb-8 flex items-end gap-6">
        {data.map((d) => {
          const h = (d.value / max) * 100;
          return (
            <div
              key={d.label}
              className="flex-1 h-full flex flex-col items-center justify-end"
            >
              <div className="mb-2 text-sm font-semibold text-dark select-none">
                {d.value}
              </div>
              <div
                className="w-full max-w-[60px] rounded-md bg-primary"
                style={{ height: `${h}%` }}
                aria-label={`${d.label} ${d.value}`}
              />
              <div className="mt-3 text-xs text-tx-secondary select-none">
                {d.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarChart;
