/**
 * Author: Libra
 * Date: 2024-06-04 17:46:57
 * LastEditors: Libra
 * Description:
 */
"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import LibraIcon from "@/public/Libra.svg";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { ExitIcon, GearIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { useContext, useEffect, useState } from "react";
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
import { collapseContext } from "@/app/main/layout";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { menuData } from "./navMenu";
import { NavMenuItem } from "./navMenu/navMenuItem";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/logout";

export function CustomHeader() {
  const user = useCurrentUser();
  const image = user?.image;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
  const collapse = useContext(collapseContext);
  const router = useRouter();
  const logoutClick = async () => {
    await logout();
    router.push("/auth/login");
  };
  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-sm:w-11/12 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Setting</DialogTitle>
          </DialogHeader>
          <div className="flex-col justify-center space-y-6 text-sm my-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user?.image || undefined} />
                  <AvatarFallback className="bg-[hsl(var(--background-main))] text-2xl">
                    {user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">
                    {user?.name || "No Name"}
                  </h3>
                  <p className="text-muted-foreground">
                    {user?.email || "No Email"}
                  </p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">User Role</h4>
                <p className="text-muted-foreground capitalize">
                  {user?.role.toLowerCase()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Theme</h4>
              <RadioGroup
                defaultValue={theme}
                onValueChange={(theme) => setTheme(theme)}
                className="flex space-x-4"
              >
                {["system", "light", "dark"].map((t) => (
                  <div key={t} className="flex items-center space-x-2">
                    <RadioGroupItem value={t} id={`theme-${t}`} />
                    <Label htmlFor={`theme-${t}`} className="capitalize">
                      {t}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="font-semibold flex items-center space-x-2">
                  <span>Two-factor authentication</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoCircledIcon />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          GitHub and Google users do not need to enable
                          two-factor authentication.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  disabled={isGitHubOrGoogle}
                  checked={isTwoFactorEnabled}
                  onCheckedChange={changeIsTwoFactorEnabled}
                />
              </div>
              {isGitHubOrGoogle && (
                <p className="text-sm text-muted-foreground">
                  Third-party account login does not need to be set
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="default" onClick={() => setIsModalOpen(false)}>
              Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <header
        className={`w-full flex justify-between items-center bg-[hsl(var(--background-nav))] transition-all rounded-lg ${
          collapse ? "max-h-0 overflow-hidden" : "px-4 py-2 mb-2"
        } `}
      >
        <div className="flex flex-col justify-center items-start">
          <Drawer
            direction="right"
            open={isDrawerOpen}
            onOpenChange={(open) => setIsDrawerOpen(open)}
          >
            <span className="font-bold text-2xl mb-1 max-sm:hidden">
              Dashboard
            </span>
            <DrawerTrigger>
              <span className="font-bold text-2xl mb-1 sm:hidden">
                Dashboard
              </span>
            </DrawerTrigger>
            <DrawerContent
              className="top-0 right-0 left-auto mt-0 w-[240px] rounded-none h-full flex flex-col"
              showBar={false}
            >
              <DrawerHeader>
                <DrawerTitle></DrawerTitle>
                <DrawerDescription className="flex justify-center items-center">
                  <LibraIcon className="w-16 h-16" />
                </DrawerDescription>
              </DrawerHeader>
              <div className="flex flex-col h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                  {menuData.map((item, index) => (
                    <NavMenuItem
                      key={index}
                      item={item}
                      isCollapsed={false}
                      onClick={() => setIsDrawerOpen(false)}
                    />
                  ))}
                </div>
                <DrawerFooter>
                  <Button
                    variant="secondary"
                    onClick={logoutClick}
                    className="w-full"
                  >
                    <ExitIcon className="mr-2" />
                    Sign out
                  </Button>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>

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
