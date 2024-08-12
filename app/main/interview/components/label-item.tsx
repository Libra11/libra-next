/**
 * Author: Libra
 * Date: 2024-08-08 11:07:36
 * LastEditors: Libra
 * Description:
 */
import { Cross2Icon } from "@radix-ui/react-icons";

const labelItem = ({
  name,
  onClick,
}: {
  name: string;
  onClick: () => void;
}) => {
  return (
    <div className="flex items-center justify-center px-3 h-8 rounded-full cursor-pointer bg-[hsl(var(--primary))]">
      <span className="text-white text-xs">{name}</span>
      <Cross2Icon className="w-4 h-4 ml-1 text-white" onClick={onClick} />
    </div>
  );
};

export default labelItem;
