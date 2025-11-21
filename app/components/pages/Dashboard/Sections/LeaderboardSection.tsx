import React from "react";
import { Trophy, ListOrdered } from "lucide-react";
import DashboardSectionWrapper from "./Wrapper";

interface LeaderboardItem {
  label: string;
  value: number;
}

interface LeaderboardProps {
  title: string;
  data: LeaderboardItem[];
  valueType: string;
  isLoading?: boolean;
}

const rankColors = {
  1: "from-yellow-400 to-yellow-600 text-yellow-900",
  2: "from-gray-300 to-gray-400 text-gray-800",
  3: "from-amber-600 to-amber-800 text-amber-50",
};

export const LeaderboardSection = ({
  title,
  data,
  valueType,
  isLoading,
}: LeaderboardProps) => {
  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-card border border-outline shadow-sm">
        <div className="animate-pulse h-6 w-40 bg-muted rounded mb-5" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3">
            <div className="h-8 w-8 bg-muted rounded-full" />
            <div className="flex-1 h-4 bg-muted rounded" />
            <div className="h-4 w-12 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-card border border-outline shadow-sm text-center text-muted-foreground">
        No data available.
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <DashboardSectionWrapper title={title} icon={ListOrdered}>
      <div className="space-y-3">
        {data.map((item, index) => {
          const rank = index + 1;
          const isTop3 = rank <= 3;

          return (
            <div
              key={index}
              className="
                flex items-center gap-4 p-3 rounded-xl
                hover:bg-muted/40 transition cursor-pointer group
              "
            >
              {/* Rank circle */}
              <div
                className={`
                  h-10 w-10 flex items-center justify-center font-bold rounded-full
                  ${
                    isTop3
                      ? `bg-gradient-to-br ${rankColors[rank]}`
                      : "bg-muted text-tx-muted"
                  }
                `}
              >
                {rank === 1
                  ? "🥇"
                  : rank === 2
                  ? "🥈"
                  : rank === 3
                  ? "🥉"
                  : rank}
              </div>

              {/* Task name */}
              <div className="flex-1">
                <p
                  title={item.label}
                  className="font-medium text-tx-primary line-clamp-1"
                >
                  {item.label}
                </p>

                {/* Visual scale bar */}
                <div className="h-1 mt-2 rounded-full bg-light-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${(item.value / maxValue) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Value */}
              <div className="text-sm font-semibold text-primary">
                {`${item.value} ${valueType}`}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardSectionWrapper>
  );
};
