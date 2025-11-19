// components/MenuAction.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const MenuAction = ({
  label,
  icon,
  onClick,
  isDanger,
}: {
  label: string;
  icon: any;
  onClick: (e: React.MouseEvent) => void;
  isDanger?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 w-full text-left px-1 py-2 hover:bg-light-emphasis text-sm ${
        isDanger ? "text-red-500" : "text-tx-secondary"
      }`}
    >
      <FontAwesomeIcon icon={icon} className="w-4 h-4" />
      {label}
    </button>
  );
};
