interface ChartWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const ChartWrapper = ({ title, description, children }: ChartWrapperProps) => {
  return (
    <div className="rounded-xl border bg-surface p-4 shadow-sm">
      <h3 className="text-md font-semibold mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500">{description}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
};

export default ChartWrapper;
