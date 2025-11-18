"use client";

type Row = {
  id?: string;
  name?: string;
  image?: string;
  point?: number;
};

export default function LeaderboardTable({
  rows,
  isLoading,
  defaultImage,
}: {
  rows: Partial<Row>[];
  isLoading: boolean;
  defaultImage: string;
}) {
  const minRows = 10;

  const filledRows: Partial<Row>[] = [
    ...rows,
    ...Array.from(
      { length: Math.max(0, minRows - rows.length) },
      () => ({} as Partial<Row>) // <- FIXED
    ),
  ];

  return (
    <section className="overflow-hidden rounded-lg border-2 border-br-secondary bg-card">
      <div className="grid grid-cols-[120px_1fr_160px] bg-primary px-4 py-3 font-bold text-white">
        <div>Rank</div>
        <div>Name</div>
        <div className="text-right">Points</div>
      </div>

      <div>
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[120px_1fr_160px] items-center border-b-2 border-br-secondary px-4 py-3 bg-tertiary animate-pulse"
              >
                <div className="h-5 w-5 rounded bg-gray-300" />
                <div className="h-5 w-full rounded bg-gray-300" />
                <div className="h-5 w-16 rounded bg-gray-300 ml-auto" />
              </div>
            ))
          : filledRows.map((cl, i) => {
              const rank = i + 4;

              return (
                <div
                  key={cl.id ?? i}
                  className={`grid grid-cols-[120px_1fr_160px] items-center border-b-2 border-br-secondary px-4 py-3 ${
                    i % 2 === 0 ? "bg-tertiary" : "bg-background"
                  }`}
                >
                  <div className="font-bold">{rank}</div>

                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="h-7 w-7 flex-shrink-0 rounded-full border border-br-secondary bg-card"
                      style={{
                        backgroundImage: `url("${cl.image ?? defaultImage}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <span className="truncate">{cl.name || ""}</span>
                  </div>

                  <div className="text-right font-bold">{cl.point ?? ""}</div>
                </div>
              );
            })}
      </div>
    </section>
  );
}
