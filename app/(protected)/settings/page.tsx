/**
 * Author: Libra
 * Date: 2024-05-24 10:18:52
 * LastEditors: Libra
 * Description:
 */
import { auth, signOut } from "@/auth";

export default async function SettingsPage() {
  const session = await auth();
  return (
    <div>
      {JSON.stringify(session)}
      <form
        action={async () => {
          "use server";
          await signOut({
            redirectTo: "/auth/login",
          });
        }}
      >
        <button type="submit">Sign out</button>
      </form>
    </div>
  );
}
