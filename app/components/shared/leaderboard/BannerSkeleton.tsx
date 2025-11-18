"use client";

export default function BannerSkeleton() {
  return (
    <section
      className="relative overflow-hidden rounded-xl border-2 border-br-secondary px-4 bg-tertiary animate-pulse"
      style={{ height: 560 }}
    >
      <div className="absolute left-1/2 top-[72px] h-[68px] w-[68px] -translate-x-1/2 rounded-full bg-gray-300" />

      <div className="absolute left-1/2 top-[170px] h-[110px] w-[110px] -translate-x-1/2 rounded-full bg-gray-300" />

      <div className="absolute left-1/2 top-[310px] w-[60%] h-5 -translate-x-1/2 bg-gray-300 rounded" />
      <div className="absolute left-1/2 top-[340px] w-[40%] h-5 -translate-x-1/2 bg-gray-300 rounded" />

      <div className="absolute left-1/2 bottom-28 h-9 w-24 -translate-x-1/2 bg-gray-300 rounded-full" />
    </section>
  );
}
