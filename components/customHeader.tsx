/**
 * Author: Libra
 * Date: 2024-06-04 17:46:57
 * LastEditors: Libra
 * Description:
 */
"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ModeToggle } from "./modeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BreadcrumbComponent } from "./breadcrumb";

export function CustomHeader() {
  const user = useCurrentUser();
  const image = user?.image;
  return (
    <header className="w-full flex justify-between items-center px-4 border-b border-[hsl(var(--border))] ">
      <BreadcrumbComponent />
      <div className="h-20 flex justify-end items-center">
        <Avatar className=" mr-2">
          <AvatarImage src={image || undefined} />
          <AvatarFallback>L</AvatarFallback>
        </Avatar>

        <ModeToggle />
      </div>
    </header>
  );
}
