import { CustomHeader } from "@/components/customHeader";
import { NavMenu } from "@/components/navMenu/index";
import { Toaster } from "@/components/ui/sonner";

/**
 * Author: Libra
 * Date: 2024-06-04 17:38:11
 * LastEditors: Libra
 * Description:
 */
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <NavMenu />
      <div className="flex-1 h-full flex flex-col justify-center items-center">
        <CustomHeader />
        <div className="flex-1 w-full p-4">{children}</div>
      </div>
      <Toaster />
    </div>
  );
}
