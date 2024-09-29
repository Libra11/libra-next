/**
 * Author: Libra
 * Date: 2024-07-25 10:33:59
 * LastEditors: Libra
 * Description:
 */
"use client";
import { NavMenuItem } from "@/components/navMenu/navMenuItem";
import WordIcon from "@/public/word.svg";
import PhraseIcon from "@/public/phrase.svg";
import ParagraphIcon from "@/public/paragraph.svg";
import { useState } from "react";
import { ChevronRightIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import QuestionIcon from "@/public/question.svg";
import SentenceIcon from "@/public/sentence.svg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function EnglishLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuData = [
    {
      title: "Word",
      icon: <WordIcon width={20} height={20} />,
      link: "/main/english/word",
    },
    {
      title: "Phrase",
      icon: <PhraseIcon width={20} height={20} />,
      link: "/main/english/phrase",
    },
    {
      title: "Paragraph",
      icon: <ParagraphIcon width={20} height={20} />,
      link: "/main/english/paragraph",
    },
    {
      title: "Questions",
      icon: <QuestionIcon width={20} height={20} />,
      link: "/main/english/questions",
    },
    {
      title: "Sentence",
      icon: <SentenceIcon width={20} height={20} />,
      link: "/main/english/sentences",
    },
  ];
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="w-full h-full flex">
        {/* 移动端侧边栏触发器 */}
        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="fixed -left-2 top-1/2 -translate-y-1/2 bg-[hsl(var(--primary))] text-white"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
              <div className="flex items-center justify-center pt-4">
                <h2 className="text-xl font-bold">English Learning</h2>
              </div>
              <nav className="flex flex-col">
                {menuData.map((item, index) => (
                  <NavMenuItem
                    key={index}
                    item={item}
                    isCollapsed={false}
                    onClick={() => setIsOpen(false)}
                  />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* 桌面端侧边菜单 */}
        <div
          className={`h-full mr-2 bg-[hsl(var(--background-nav))] rounded-lg ${
            isCollapsed ? "w-20" : "w-60"
          } flex flex-col justify-start items-center max-lg:hidden transition-all duration-300`}
        >
          <div className="w-full flex-1 overflow-y-auto">
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
          <div className="mb-4 w-full px-2 flex-shrink-0">
            <Button
              variant="secondary"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="mx-auto" />
              ) : (
                <>
                  <ChevronLeftIcon className="mr-2" />
                  Collapse
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 主内容区域 */}
        <div className="flex-1 w-0 h-full bg-[hsl(var(--background-nav))] rounded-lg">
          {children}
        </div>
      </div>
    </TooltipProvider>
  );
}
