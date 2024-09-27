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
import { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock } from "react-icons/fi"; // 导入时钟图标

export function BreadcrumbComponent() {
  let pathName = usePathname();
  pathName = pathName.slice(1);
  const collapse = useContext(collapseContext);

  // Split the path and accumulate it step by step
  const pathSegments = pathName.split("/");
  let accumulatedPath = "";

  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date()); // 初始化时间
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimeUnit = (unit: number) => unit.toString().padStart(2, "0");

  const animationVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div
      className={`w-full bg-[hsl(var(--background-nav))] rounded-lg transition-all flex justify-between items-center ${
        collapse ? "max-h-0 overflow-hidden" : "px-4 py-2 mb-2 max-sm:hidden"
      }`}
    >
      <Breadcrumb>
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
      {currentTime && (
        <div className="flex items-center space-x-2 text-muted-foreground font-bold">
          <FiClock className="w-5 h-5" /> {/* 添加时钟图标 */}
          {[
            formatTimeUnit(currentTime.getHours()),
            formatTimeUnit(currentTime.getMinutes()),
            formatTimeUnit(currentTime.getSeconds()),
          ].flatMap((time, index) => [
            <div
              key={`time-${index}`}
              className="relative w-6 h-6 overflow-hidden"
            >
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={time}
                  className="absolute inset-0 flex items-center justify-center"
                  variants={animationVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {time}
                </motion.span>
              </AnimatePresence>
            </div>,
            index < 2 && <span key={`separator-${index}`}>:</span>,
          ])}
        </div>
      )}
    </div>
  );
}
