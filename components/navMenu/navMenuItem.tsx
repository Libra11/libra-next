/**
 * Author: Libra
 * Date: 2024-06-17 14:12:33
 * LastEditors: Libra
 * Description:
 */
import { usePathname, useRouter } from "next/navigation";

interface MenuDataProps {
  title: string;
  icon: JSX.Element;
  link: string;
}
export const NavMenuItem = ({
  item,
  isCollapsed,
  onClick,
}: {
  item: MenuDataProps;
  isCollapsed: boolean;
  onClick?: () => void;
}) => {
  let pathName = usePathname();

  const isActive =
    pathName === "/main"
      ? pathName === item.link
      : pathName.includes(item.link) && item.link !== "/main";
  const router = useRouter();

  const goLink = (link: string) => () => {
    link && router.push(link);
    onClick && onClick();
  };

  return (
    <div
      className={`${
        isCollapsed ? "flex justify-center items-center" : ""
      } w-full cursor-pointer my-4`}
      onClick={goLink(item.link)}
    >
      <div
        className={`${
          isCollapsed ? "w-12 justify-center" : "px-4 mx-4"
        } flex items-center transition-all h-12 rounded-lg py-2 hover:bg-[hsl(var(--accent))] cursor-pointe ${
          isActive
            ? "bg-[hsl(var(--primary))] hover:!bg-[hsl(var(--primary))] text-white"
            : ""
        }`}
      >
        <div className={`${isCollapsed ? "" : "mr-2"}`}>{item.icon}</div>
        {isCollapsed ? null : <div>{item.title}</div>}
      </div>
    </div>
  );
};
