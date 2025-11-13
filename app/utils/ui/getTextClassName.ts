import { TextVariant } from "@/app/types/ui/TextVariant";

export const getTextClassName = (type: TextVariant) => {
  switch (type) {
    case "text-4xl-bold":
      return "text-3xl sm:text-4xl font-bold";
    case "text-3xl-bold":
      return "text-3xl font-bold";
    case "text-[1.8rem]-bold":
      return "text-[1.8rem] font-bold";
    case "text-[1.8rem]-semibold":
      return "text-[1.8rem] font-semibold";
    case "text-2xl-semibold":
      return "text-2xl font-semibold";
    case "text-xl-semibold":
      return "text-xl font-semibold";
    case "text-base-semibold":
      return "text-base font-semibold";
    default:
      return "";
  }
};
