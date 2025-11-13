import Image from "next/image";
import { Tag } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

interface DetailPageTableHeaderProps {
  imageSrc: string;
  imageAlt: string;
  label: string;
}

export const DetailPageTableHeader = ({
  imageSrc,
  imageAlt,
  label,
}: DetailPageTableHeaderProps) => {
  return (
    <div className="bg-primary grid grid-cols-[3rem_1fr] items-center text-white px-4 py-2">
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={24}
        height={24}
        className="w-6 h-6"
      />
      <p className="text-base font-semibold">{label}</p>
    </div>
  );
};

interface DetailPageTableContentProps {
  imageSrc: string;
  imageAlt: string;
  label: string;
  value?: string | boolean | null;
}

export const DetailPageTableContent = ({
  imageSrc,
  imageAlt,
  label,
  value,
}: DetailPageTableContentProps) => {
  const renderValue = () => {
    if (typeof value === "boolean") {
      return value ? (
        <Tag icon={<CheckOutlined />} color="green">
          Ya
        </Tag>
      ) : (
        <Tag icon={<CloseOutlined />} color="red">
          Tidak
        </Tag>
      );
    }

    if (typeof value === "string") {
      return value.trim() !== "" ? value : "-";
    }

    return "-";
  };

  return (
    <div className="grid grid-cols-[3rem_1fr] text-dark px-4 py-2">
      {/* Icon */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={24}
        height={24}
        className="w-6 h-6"
      />

      {/* Label & Value */}
      <div className="grid grid-cols-2 w-full text-dark">
        <p className="text-base font-medium">{label}</p>
        <div className="text-base font-normal">{renderValue()}</div>
      </div>
    </div>
  );
};
