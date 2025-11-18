"use client";

import { IMAGES } from "@/app/constants/images";

const Banner = ({
  tone,
  title1,
  title2,
  points,
  image,
}: {
  tone: "gold" | "silver" | "bronze";
  title1: string;
  title2: string;
  points: string | number;
  image?: string;
}) => {
  const bg =
    tone === "gold"
      ? "linear-gradient(180deg,#FFE9A8 0%,#E6C26B 55%,#CFAB57 82%,#B88944 100%)"
      : tone === "silver"
      ? "linear-gradient(180deg,#EEF1F5 0%,#C9D0DC 55%,#BFC6D3 82%,#AAB1BF 100%)"
      : "linear-gradient(180deg,#F4E0C8 0%,#C48B56 55%,#B27B49 82%,#99683C 100%)";

  const medalBg =
    tone === "gold"
      ? "radial-gradient(circle at 40% 35%,#ffffffaa 0 35%,transparent 36%),#FFEF9B"
      : tone === "silver"
      ? "radial-gradient(circle at 40% 35%,#ffffffaa 0 35%,transparent 36%),#E6EBF2"
      : "radial-gradient(circle at 40% 35%,#ffffffaa 0 35%,transparent 36%),#E8C39F";

  return (
    <section
      className="relative overflow-hidden rounded-xl border-2 border-br-secondary px-4"
      style={{ background: bg, height: 560 }}
    >
      <div
        className="absolute left-1/2 top-[72px] grid h-[68px] w-[68px] -translate-x-1/2 place-items-center rounded-full border-[3px] border-br-secondary shadow"
        style={{ background: medalBg }}
      />

      <div
        className="absolute left-1/2 top-[170px] h-[110px] w-[110px] -translate-x-1/2 rounded-full border-[3px] border-br-secondary bg-card shadow-sm"
        style={{
          backgroundImage: `url("${image || IMAGES.DEFAULT_CLASS}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="absolute left-1/2 top-[310px] w-[86%] -translate-x-1/2 text-center text-[18px] font-bold leading-tight text-black">
        {title1}
        <br />
        {title2}
      </div>

      <div className="absolute left-1/2 bottom-28 -translate-x-1/2">
        <div className="inline-flex items-center gap-2 rounded-full border-2 border-br-secondary bg-primary px-3 py-2 text-[16px] font-bold text-white shadow-sm">
          <span
            className="inline-block h-[16px] w-[16px] rounded-full border border-br-secondary"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,.65) 0 40%, transparent 41%), #FFD54F",
            }}
          />
          <span className="tabular-nums px-1">{points}</span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 h-[64px] rounded-b-xl bg-black/10 mix-blend-multiply opacity-[.08]" />
    </section>
  );
};

export default Banner;
