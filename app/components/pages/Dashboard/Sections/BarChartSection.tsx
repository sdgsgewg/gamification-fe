import React from "react";
import DashboardSectionWrapper from "./Wrapper";
import { BarChart, BarChartSkeleton } from "../Charts";

export interface BarChartItem {
  label: string;
  value: number;
}

interface BarChartSectionProps {
  title: string;
  subtitle?: string;
  data: BarChartItem[];
  isLoading?: boolean;
}

const BarChartSection = ({ title, subtitle, data, isLoading }: BarChartSectionProps) => {
  return (
    <DashboardSectionWrapper title={title} subtitle={subtitle}>
      {isLoading ? (
        <BarChartSkeleton />
      ) : data.length === 0 ? (
        <div className="text-center text-muted-foreground py-6">
          No data available.
        </div>
      ) : (
        <BarChart data={data} />
      )}
    </DashboardSectionWrapper>
  );
};

export default BarChartSection;
