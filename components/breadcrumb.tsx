/**
 * Author: Libra
 * Date: 2024-06-17 11:14:11
 * LastEditors: Libra
 * Description:
 */
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export function BreadcrumbComponent() {
  let pathName = usePathname();
  pathName = pathName.slice(1);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem key="home">
          <BreadcrumbLink href="/">home</BreadcrumbLink>
          <BreadcrumbSeparator />
        </BreadcrumbItem>
        {pathName.split("/").map((item, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbLink href={`/${item}`}>{item}</BreadcrumbLink>
            {index !== pathName.split("/").length - 1 && (
              <BreadcrumbSeparator />
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
