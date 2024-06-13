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
import { Separator } from "./ui/separator";

export function CustomHeader() {
  const user = useCurrentUser();
  const image = user?.image;
  return (
    <header className="w-full flex justify-center items-center flex-col">
      <div className="w-full h-20 flex justify-end items-center p-4">
        <Avatar className=" mr-2">
          <AvatarImage src={image || undefined} />
          <AvatarFallback>L</AvatarFallback>
        </Avatar>

        <ModeToggle />
      </div>
      <Separator orientation="horizontal" />
    </header>
  );
}
