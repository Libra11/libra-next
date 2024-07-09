import { BreadcrumbComponent } from "@/components/breadcrumb";
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
      <div className="flex-1 h-full flex flex-col p-2 justify-center items-center bg-[hsl(var(--background-main))]">
        <CustomHeader />
        <BreadcrumbComponent />
        <div className="flex-1 w-full pb-4 h-0 bg-[hsl(var(--background-nav))] rounded-lg">
          {children}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
