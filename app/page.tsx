/**
 * Author: Libra
 * Date: 2024-05-22 15:43:28
 * LastEditors: Libra
 * Description:
 */

import { LoginButton } from "@/components/auth/loginButton";
import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-sky-500">
      <div className=" space-y-6 text-center">
        <h1 className=" text-6xl font-semibold text-white drop-shadow-md">
          Auth
        </h1>
        <p className=" text-white text-lg">A simple authentication service</p>
        <div>
          <LoginButton>
            <Button variant="secondary" size="lg">
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
