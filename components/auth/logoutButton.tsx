/**
 * Author: Libra
 * Date: 2024-05-29 15:03:56
 * LastEditors: Libra
 * Description:
 */
"use client";

import { logout } from "@/actions/logout";

interface LogoutButtonProps {
  children: React.ReactNode;
}

export const LoginButton = ({ children }: LogoutButtonProps) => {
  const onclick = () => {
    logout();
  };
  return (
    <span className="cursor-pointer" onClick={onclick}>
      {children}
    </span>
  );
};
