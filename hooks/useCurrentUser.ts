/*
 * @Author: Libra
 * @Date: 2024-05-29 14:40:44
 * @LastEditors: Libra
 * @Description:
 */
import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  const session = useSession();
  return session.data?.user;
};
