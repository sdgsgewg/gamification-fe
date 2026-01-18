"use client";

export type FilterOption<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export default function FilterBar<T extends string>({
  options,
  value,
  onChange,
}: Props<T>) {
  return (
    <div className="flex gap-4 mb-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 font-bold rounded-lg transition ${
            value === opt.value
              ? "bg-primary text-white"
              : "bg-card text-tx-primary border border-br-secondary"
          } cursor-pointer`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
