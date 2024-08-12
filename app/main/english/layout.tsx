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
import { useState } from "react";

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
  ];
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="h-full mr-2 bg-[hsl(var(--background-nav))] rounded-lg w-60">
        {menuData.map((item, index) => (
          <NavMenuItem key={index} item={item} isCollapsed={isCollapsed} />
        ))}
      </div>
      <div className="flex-1 h-full p-4 bg-[hsl(var(--background-nav))] rounded-lg">
        {children}
      </div>
    </div>
  );
}
