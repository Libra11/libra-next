/**
 * Author: Libra
 * Date: 2024-06-04 17:38:11
 * LastEditors: Libra
 * Description:
 */
"use client";
import { BreadcrumbComponent } from "@/components/breadcrumb";
import { CustomHeader } from "@/components/customHeader";
import FullscreenIcon from "@/public/fullscreen.svg";
import FullscreenExitIcon from "@/public/fullscreen_exit_line.svg";
import { NavMenu } from "@/components/navMenu/index";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { usePathname, useSearchParams } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export const collapseContext = createContext(false);
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapse, setCollapse] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
    return () => {
      NProgress.start();
    };
  }, [pathname, searchParams]);
  return (
    <collapseContext.Provider value={collapse}>
      <div className="w-screen h-dvh flex justify-center items-center relative">
        <NavMenu />
        <div className="flex-1 h-full flex flex-col p-2 justify-center items-center bg-[hsl(var(--background-main))]">
          <CustomHeader />
          <BreadcrumbComponent />
          <div className="flex-1 w-full h-0">{children}</div>
        </div>
        <Toaster />
        <Button
          variant="outline"
          onClick={() => setCollapse((prev) => !prev)}
          className="absolute bottom-4 right-4 rounded-full w-14 h-14"
        >
          {!collapse ? (
            <FullscreenIcon width={24} height={24} />
          ) : (
            <FullscreenExitIcon width={24} height={24} />
          )}
        </Button>
      </div>
    </collapseContext.Provider>
  );
}
