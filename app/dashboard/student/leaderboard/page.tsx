"use client";

/** demo rows */
const rows = Array.from({ length: 15 }).map((_, i) => ({
  rank: i + 4,
  name: i % 2 === 0 ? "Class 12D SMAN 1" : "Class 12E SMAN 1",
  points: i % 2 === 0 ? 110000 : 105000,
}));

/** small inline illustration for avatars */
const CLASS_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0' stop-color='#cfe3ff'/><stop offset='1' stop-color='#e8f0ff'/>
      </linearGradient></defs>
      <rect width='160' height='160' rx='80' fill='url(#g)'/>
      <circle cx='55' cy='80' r='26' fill='#9bb9f2'/>
      <rect x='84' y='65' width='50' height='30' rx='6' fill='#9bb9f2'/>
      <rect x='32' y='110' width='96' height='10' rx='5' fill='#99a8c8' opacity='.7'/>
      <text x='50%' y='54%' font-size='12' text-anchor='middle' fill='#5b6b8a' font-family='Inter,Arial'>CLASS</text>
    </svg>`
  );

export default function Page() {
  return (
    <div className="bg-[var(--background)] text-[var(--text-primary)]">
      <main className="mx-auto max-w-[1100px] px-6 pb-16 pt-7">
        <h1 className="mb-4 border-b-2 border-[var(--color-outline)] pb-3 text-[36px] font-extrabold">
          Inter-Class Leaderboard
        </h1>

        {/* layout: left banners + right table */}
        <div className="grid grid-cols-[360px_1fr] gap-6 max-[980px]:grid-cols-1">
          {/* LEFT — three fixed banners */}
          <div className="grid grid-cols-3 gap-4">
            <Banner tone="gold"   title1="Class 12A" title2="SMAN 1" points="125000" />
            <Banner tone="silver" title1="Class 12B" title2="SMAN 1" points="120000" />
            <Banner tone="bronze" title1="Class 12C" title2="SMAN 1" points="115000" />
          </div>

          {/* RIGHT — table */}
          <section className="overflow-hidden rounded-lg border-2 border-[var(--border-secondary)] bg-[var(--color-card)]">
            <div className="grid grid-cols-[120px_1fr_160px] bg-[var(--color-primary)] px-4 py-3 font-bold text-white">
              <div>Rank</div>
              <div>Name</div>
              <div className="text-right">Points</div>
            </div>

            <div>
              {rows.map((r, i) => (
                <div
                  key={r.rank}
                  className={`grid grid-cols-[120px_1fr_160px] items-center border-b-2 border-[var(--border-secondary)] px-4 py-3 ${
                    i % 2 === 0 ? "bg-[var(--color-tertiary)]" : "bg-[var(--background)]"
                  }`}
                >
                  <div className="font-bold">{r.rank}</div>
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="h-7 w-7 flex-shrink-0 rounded-full border border-[var(--border-secondary)] bg-[var(--color-card)]"
                      style={{
                        backgroundImage: `url("${CLASS_IMG}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <span className="truncate">{r.name}</span>
                  </div>
                  <div className="text-right font-bold">{r.points}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ---------------- Banner (podium column) ---------------- */

function Banner({
  tone,
  title1,
  title2,
  points,
}: {
  tone: "gold" | "silver" | "bronze";
  title1: string;
  title2: string;
  points: string | number;
}) {
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
      className="
        relative overflow-hidden rounded-xl
        border-2 border-[var(--border-secondary)]
        px-4
      "
      style={{ background: bg, height: 560 }}
    >
      {/* RIBBON */}
      <div className="absolute left-0 right-0 top-5 grid place-items-center">
        <div
          className="h-[60px] w-[50px] opacity-90"
          style={{
            background:
              `linear-gradient(180deg,var(--color-primary) 0,var(--color-primary) 14px,transparent 14px) 0 0/16px 100% no-repeat,` +
              `linear-gradient(180deg,var(--color-primary) 0,var(--color-primary) 14px,transparent 14px) 50% 0/16px 100% no-repeat,` +
              `linear-gradient(180deg,var(--color-primary) 0,var(--color-primary) 14px,transparent 14px) 100% 0/16px 100% no-repeat`,
            clipPath: "polygon(0 0,100% 0,70% 100%,30% 100%)",
          }}
        />
      </div>

      {/* MEDAL */}
      <div
        className="absolute left-1/2 top-[72px] grid h-[68px] w-[68px] -translate-x-1/2 place-items-center rounded-full border-[3px] border-[var(--border-secondary)] shadow"
        style={{ background: medalBg }}
      />

      {/* PHOTO */}
      <div
        className="absolute left-1/2 top-[170px] h-[110px] w-[110px] -translate-x-1/2 rounded-full border-[3px] border-[var(--border-secondary)] bg-[var(--color-card)] shadow-sm"
        style={{
          backgroundImage: `url("${CLASS_IMG}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* TITLE — smaller text */}
      <div className="absolute left-1/2 top-[310px] w-[86%] -translate-x-1/2 text-center text-[18px] font-bold leading-tight text-[var(--text-primary)]">
        {title1}
        <br />
        {title2}
      </div>

      {/* SCORE OVAL — smaller + tighter padding */}
      <div className="absolute left-1/2 bottom-28 -translate-x-1/2">
        <div className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--border-secondary)] bg-[var(--color-primary)] px-3 py-2 text-[16px] font-bold text-white shadow-sm">
          <span
            className="inline-block h-[16px] w-[16px] rounded-full border border-[var(--border-secondary)]"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,.65) 0 40%, transparent 41%), #FFD54F",
            }}
          />
          <span className="tabular-nums">{points}</span>
        </div>
      </div>

      {/* SOFT bottom highlight */}
      <div className="absolute inset-x-0 bottom-6 h-[64px] rounded-b-xl bg-black/10 mix-blend-multiply opacity-[.08]" />
    </section>
  );
}