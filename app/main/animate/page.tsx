/**
 * Author: Libra
 * Date: 2024-09-23 13:43:50
 * LastEditors: Libra
 * Description: 算法动画展示页面，适配移动端
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import FisherYatesShuffle from "./components/fisher-yates-shuffle";
import CallStackMicrotask from "./components/call-stack-microtask";
import FlexBoxTutorial from "./components/flex-box-turtoral";
import Vue3Reactive from "./components/vue3-reactive";
type Animation = {
  title: string;
  component: React.ComponentType;
};

const animations: Animation[] = [
  { title: "Fisher-Yates Shuffle", component: FisherYatesShuffle },
  { title: "Call Stack and Microtask Queue", component: CallStackMicrotask },
  { title: "Flex Box Tutorial", component: FlexBoxTutorial },
  { title: "Vue3 Reactive", component: Vue3Reactive },
];

const AnimationCard = ({ title, component: Component }: Animation) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          className=" p-4 sm:p-6 rounded-xl shadow-lg cursor-pointer overflow-hidden relative group bg-[hsl(var(--background-main))]"
          whileHover={{ scale: 1.03, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 dark:from-blue-600 dark:to-purple-700"></div>
          <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            Click to view detailed animation
          </p>
          <Button
            className="w-full sm:w-auto  font-semibold py-2 px-4 rounded-full transition-colors duration-300 text-sm sm:text-base"
            variant="default"
          >
            View Animation
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <Component />
      </DialogContent>
    </Dialog>
  );
};

const AnimatePage = () => {
  return (
    <div className="p-4 sm:p-8 rounded-lg h-full bg-[hsl(var(--background-nav))]  overflow-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-12 text-center max-sm:hidden">
        Algorithm Animation
      </h1>
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-12 text-center sm:hidden">
        Algorithm
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {animations.map((animation, index) => (
          <AnimationCard key={index} {...animation} />
        ))}
      </div>
    </div>
  );
};

export default AnimatePage;
