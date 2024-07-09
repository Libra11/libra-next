/**
 * Author: Libra
 * Date: 2024-06-04 17:46:57
 * LastEditors: Libra
 * Description:
 */
"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BreadcrumbComponent } from "./breadcrumb";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { GearIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useTheme } from "next-themes";
import { Switch } from "./ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { changeUserInfo } from "@/actions/user/modify";

export function CustomHeader() {
  const user = useCurrentUser();
  const image = user?.image;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(
    user?.isTwoFactorEnabled
  );
  const isGitHubOrGoogle =
    user?.image?.includes("github") || user?.image?.includes("google");
  const { theme, setTheme } = useTheme();
  const changeIsTwoFactorEnabled = async (value: boolean) => {
    if (!user?.id) return;
    const res = await changeUserInfo(user?.id, { isTwoFactorEnabled: value });
    if (res.code === 0) {
      setIsTwoFactorEnabled(value);
    }
  };
  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Setting</DialogTitle>
          </DialogHeader>
          <div className="flex-col justify-center space-y-4 text-sm my-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">Theme</span>
              <RadioGroup
                defaultValue={theme}
                onValueChange={(theme) => setTheme(theme)}
                className="flex"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="r1" />
                  <Label htmlFor="r1">System</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="r2" />
                  <Label htmlFor="r2">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="r3" />
                  <Label htmlFor="r3">Dark</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex justify-between items-center">
              <div className="font-bold flex justify-center items-center">
                <span className="mr-1">IsTwoFactorEnabled</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoCircledIcon />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        GitHub and Google users do not need to enable two-factor
                        authentication.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  disabled={isGitHubOrGoogle}
                  checked={isTwoFactorEnabled}
                  onCheckedChange={changeIsTwoFactorEnabled}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="default" onClick={() => setIsModalOpen(false)}>
              Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <header className="w-full flex justify-between items-center px-4 py-2 bg-[hsl(var(--background-nav))] rounded-lg mb-2">
        {/* <BreadcrumbComponent /> */}
        <div className="flex flex-col justify-center items-start">
          <span className="font-bold text-2xl mb-1">Dashboard</span>
          <span className=" text-[hsl(var(--muted-foreground))]">
            {new Date().toDateString()}
          </span>
        </div>
        <div className="h-20 flex justify-end items-center">
          <Avatar className=" mr-2 w-12 h-12">
            <AvatarImage src={image || undefined} />
            <AvatarFallback className="bg-[hsl(var(--background-main))] text-xl">
              L
            </AvatarFallback>
          </Avatar>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            size="icon"
          >
            <GearIcon width={20} height={20} />
          </Button>
        </div>
      </header>
    </>
  );
}
