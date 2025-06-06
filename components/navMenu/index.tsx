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
import ChatIcon from "@/public/chat.svg";
import EnglishIcon from "@/public/english.svg";
import InterviewIcon from "@/public/interview.svg";
import LeetcodeIcon from "@/public/leetcode.svg";
import BlogIcon from "@/public/blog.svg";
import STTIcon from "@/public/stt.svg";
import TTSIcon from "@/public/tts.svg";
import AnimateIcon from "@/public/animate.svg";
import LogoutDialog from "../LogoutDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const menuData = [
  {
    title: "Dashboard",
    icon: <HomeIcon width={20} height={20} />,
    link: "/main",
  },
  {
    title: "Chat",
    icon: <ChatIcon width={24} height={24} />,
    link: "/main/chat",
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
  {
    title: "Leetcode",
    icon: <LeetcodeIcon width={24} height={24} />,
    link: "/main/algorithm",
  },
  {
    title: "Blog",
    icon: <BlogIcon width={24} height={24} />,
    link: "/main/blog",
  },
  {
    title: "STT",
    icon: <STTIcon width={24} height={24} />,
    link: "/main/stt",
  },
  {
    title: "TTS",
    icon: <TTSIcon width={24} height={24} />,
    link: "/main/tts",
  },
  {
    title: "Animate",
    icon: <AnimateIcon width={24} height={24} />,
    link: "/main/animate",
  },
];

export function NavMenu() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <nav
      className={`h-full ${
        isCollapsed ? "w-20" : "w-60"
      } flex flex-col items-center py-4 px-2 transition-all bg-[hsl(var(--background-nav))] max-sm:hidden`}
    >
      <TooltipProvider>
        <div className="w-full flex flex-col h-full">
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
          <div className="flex-1 overflow-y-auto">
            {menuData.map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div>
                    <NavMenuItem item={item} isCollapsed={isCollapsed} />
                  </div>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    <p>{item.title}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>
          <div className="mt-auto">
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    onClick={() => setIsCollapsed(false)}
                    className="w-full mb-2 px-0"
                  >
                    <ChevronRightIcon className="mr-2" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Expand</p>
                </TooltipContent>
              </Tooltip>
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    onClick={() => setIsLogoutDialogOpen(true)}
                    className="w-full px-0"
                  >
                    <ExitIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Logout</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="secondary"
                onClick={() => setIsLogoutDialogOpen(true)}
                className="w-full"
              >
                <ExitIcon className="mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </TooltipProvider>

      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        setIsOpen={setIsLogoutDialogOpen}
        onConfirm={handleLogout}
      />
    </nav>
  );
}
