/**
 * Author: Libra
 * Date: 2024-06-04 17:47:38
 * LastEditors: Libra
 * Description:
 */
"use client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExitIcon,
  HomeIcon,
} from "@radix-ui/react-icons";
import { NavMenuItem } from "./navMenuItem";
import Image from "next/image";
import { Button } from "../ui/button";
import { logout } from "@/actions/logout";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GeminiIcon from "@/public/gemini.svg";
import EnglishIcon from "@/public/english.svg";
import InterviewIcon from "@/public/interview.svg";

export const menuData = [
  {
    title: "Dashboard",
    icon: <HomeIcon width={20} height={20} />,
    link: "/main",
  },
  {
    title: "Gemini",
    icon: <GeminiIcon width={24} height={24} />,
    link: "/main/gemini",
  },
  {
    title: "English",
    icon: <EnglishIcon width={24} height={24} />,
    link: "/main/english",
  },
  {
    title: "Interview",
    icon: <InterviewIcon width={24} height={24} />,
    link: "/main/interview",
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
      } flex flex-col items-center py-4 px-2 transition-all bg-[hsl(var(--background-nav))] max-sm:hidden`}
    >
      <div className="w-full flex-1">
        <div className="h-20 flex justify-center items-center mb-4">
          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff40]"
            src="/Libra.svg"
            alt="Libra Logo"
            width={`${isCollapsed ? 40 : 60}`}
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
