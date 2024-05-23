/**
 * Author: Libra
 * Date: 2024-05-22 16:41:34
 * LastEditors: Libra
 * Description:
 */
interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex-col gap-y-4 flex items-center justify-center">
      <h1 className="text-3xl font-semibold">Auth</h1>
      <p className=" text-muted-foreground text-sm">{label}</p>
    </div>
  );
};
