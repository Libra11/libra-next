/**
 * Author: Libra
 * Date: 2024-06-04 17:47:38
 * LastEditors: Libra
 * Description:
 */
"use client";
import {
  BackpackIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ExitIcon,
  GearIcon,
  HomeIcon,
  MagicWandIcon,
} from "@radix-ui/react-icons";
import { NavMenuItem } from "./navMenuItem";
import Image from "next/image";
import { Button } from "../ui/button";
import { logout } from "@/actions/logout";
import { useRouter } from "next/navigation";
import { useState } from "react";

const menuData = [
  {
    title: "Dashboard",
    icon: <HomeIcon width={20} height={20} />,
    link: "/main",
  },
  {
    title: "WordToExcel",
    icon: <BackpackIcon width={20} height={20} />,
    link: "/main/tool",
  },
  {
    title: "Gemini",
    icon: <MagicWandIcon width={20} height={20} />,
    link: "/main/gemini",
  },
];

export function NavMenu() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const logoutClick = async () => {
    await logout();
    router.push("/auth/login");
  };
  return (
    <nav
      className={`h-full ${
        isCollapsed ? "w-20" : "w-60"
      } flex flex-col items-center py-4 px-2 transition-all bg-[hsl(var(--background-nav))]`}
    >
      <div className="w-full flex-1">
        <div className="h-20 flex justify-center items-center mb-4">
          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
            src="/Libra.svg"
            alt="Libra Logo"
            width={80}
            height={29}
            priority
          />
        </div>
        {menuData.map((item, index) => (
          <NavMenuItem key={index} item={item} isCollapsed={isCollapsed} />
        ))}
      </div>
      {isCollapsed ? (
        <Button
          variant="secondary"
          onClick={() => setIsCollapsed(false)}
          className="w-full mb-2 px-0"
        >
          <ChevronRightIcon className="mr-2" />
        </Button>
      ) : (
        <Button
          variant="secondary"
          onClick={() => setIsCollapsed(true)}
          className="w-full mb-2"
        >
          <ChevronLeftIcon className="mr-2" />
          Collapse
        </Button>
      )}

      {isCollapsed ? (
        <Button
          variant="secondary"
          onClick={logoutClick}
          className="w-full px-0"
        >
          <ExitIcon />
        </Button>
      ) : (
        <Button variant="secondary" onClick={logoutClick} className="w-full">
          <ExitIcon className="mr-2" />
          Sign out
        </Button>
      )}
    </nav>
  );
}
