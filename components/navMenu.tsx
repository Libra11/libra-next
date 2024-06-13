import Link from "next/link";
import { Separator } from "./ui/separator";

/**
 * Author: Libra
 * Date: 2024-06-04 17:47:38
 * LastEditors: Libra
 * Description:
 */
export function NavMenu() {
  return (
    <nav className="h-full flex justify-center items-center">
      <div className="h-full w-20">
        <ul className="h-full flex flex-col justify-center items-center gap-8">
          <li>
            <Link
              className=" hover:bg-[hsl(var(--primary))] flex justify-center items-center  w-14 h-14 rounded-2xl  hover:text-white"
              href="/main"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className=" hover:bg-[hsl(var(--primary))] flex justify-center items-center  w-14 h-14 rounded-2xl hover:text-white"
              href="/main/tool"
            >
              tool
            </Link>
          </li>
        </ul>
      </div>
      <Separator orientation="vertical" />
    </nav>
  );
}
