/**
 * Author: Libra
 * Date: 2024-05-24 10:18:52
 * LastEditors: Libra
 * Description:
 */
"use client";
import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ModeToggle } from "@/components/modeToggle";

export default function SettingsPage() {
  const router = useRouter();

  const onClick = async () => {
    await logout();
    router.push("/auth/login");
  };
  const user = useCurrentUser();

  return (
    <div>
      {JSON.stringify(user)}
      <ModeToggle />
      <Button variant="secondary" onClick={onClick}>
        Sign out
      </Button>
    </div>
  );
}
