// components/MenuLink.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

export const MenuLink = ({
  item,
  username,
}: {
  item: any;
  username?: string;
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (item.dynamicPath && username) {
      router.push(item.dynamicPath(username));
    } else if (item.url) {
      router.push(item.url);
    }
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className="flex items-center gap-2 px-1 py-2 hover:bg-light-emphasis"
    >
      {item.icon && <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />}
      <span className="text-sm text-tx-secondary">{item.menu}</span>
    </a>
  );
};
