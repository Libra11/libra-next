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
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import QuestionIcon from "@/public/question.svg";
import SentenceIcon from "@/public/sentence.svg";
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
      icon: <QuestionIcon width={20} height={20} />, // 需要导入或创建 QuestionIcon
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
              <ChevronRight className="h-6 w-6" />
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
      <div className="h-full mr-2 bg-[hsl(var(--background-nav))] rounded-lg w-60 max-lg:hidden">
        {menuData.map((item, index) => (
          <NavMenuItem key={index} item={item} isCollapsed={isCollapsed} />
        ))}
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 w-0 h-full p-4 bg-[hsl(var(--background-nav))] rounded-lg">
        {children}
      </div>
    </div>
  );
}
