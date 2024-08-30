/**
 * Author: Libra
 * Date: 2024-06-17 11:14:11
 * LastEditors: Libra
 * Description:
 */
"use client";
import { collapseContext } from "@/app/main/layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { useContext } from "react";

export function BreadcrumbComponent() {
  let pathName = usePathname();
  pathName = pathName.slice(1);
  const collapse = useContext(collapseContext);

  // Split the path and accumulate it step by step
  const pathSegments = pathName.split("/");
  let accumulatedPath = "";

  return (
    <Breadcrumb
      className={`w-full bg-[hsl(var(--background-nav))] rounded-lg transition-all ${
        collapse ? "max-h-0 overflow-hidden" : "px-4 py-2 mb-2 max-sm:hidden"
      } `}
    >
      <BreadcrumbList>
        <BreadcrumbItem key="home" className="ml-0">
          <BreadcrumbLink href="/">home</BreadcrumbLink>
          <BreadcrumbSeparator />
        </BreadcrumbItem>
        {pathSegments.map((item, index) => {
          accumulatedPath += `/${item}`;
          return (
            <BreadcrumbItem key={index} className="ml-0">
              <BreadcrumbLink href={accumulatedPath}>{item}</BreadcrumbLink>
              {index !== pathSegments.length - 1 && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
