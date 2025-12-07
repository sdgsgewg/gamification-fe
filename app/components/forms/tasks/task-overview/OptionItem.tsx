import { Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

export const TaskTypeOptionItem = ({
  label,
  description,
}: {
  label: string;
  description: string;
}) => {
  return (
    <div className="flex items-center justify-between w-full">
      <span>{label}</span>

      <Tooltip title={description}>
        <InfoCircleOutlined className="!ml-2 !text-tx-muted" />
      </Tooltip>
    </div>
  );
};
