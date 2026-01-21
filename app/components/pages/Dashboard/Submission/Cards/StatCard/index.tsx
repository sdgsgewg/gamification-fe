import { Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

type StatCardProps = {
  label: string;
  value: number | string;
  tooltip?: React.ReactNode;
  tooltipPlacement?: "top" | "bottom" | "left" | "right";
};

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  tooltip,
  tooltipPlacement = "top",
}) => {
  return (
    <div className="rounded-lg bg-background p-3 text-center border">
      <div className="flex items-center justify-center gap-1">
        <p className="text-sm text-tx-secondary">{label}</p>

        {tooltip && (
          <Tooltip title={tooltip} placement={tooltipPlacement}>
            <InfoCircleOutlined className="text-xs text-tx-secondary cursor-help hover:text-primary transition" />
          </Tooltip>
        )}
      </div>

      <p className="text-xl font-semibold text-dark">{value}</p>
    </div>
  );
};

export default StatCard;
