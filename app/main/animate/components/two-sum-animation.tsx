/**
 * Author: Libra
 * Date: 2024-09-23 15:51:09
 * LastEditors: Libra
 * Description:
 */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const initialNumbers = [3, 9, 1, 7, 4];
const target = 5;

export default function TwoSumAnimation() {
  const [nums, setNums] = useState(initialNumbers);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [description, setDescription] = useState("");
  const [map, setMap] = useState<Map<number, number>>(new Map());

  const twoSum = async () => {
    setIsAnimating(true);
    const newMap = new Map<number, number>();

    for (let i = 0; i < nums.length; i++) {
      setCurrentIndex(i);
      setDescription(
        `Examining the number ${nums[i]} at index ${i}. We're looking for a complement that adds up to ${target}.`
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const complement = target - nums[i];
      if (newMap.has(complement)) {
        setTargetIndex(newMap.get(complement)!);
        setDescription(
          `Found a solution! The number ${
            nums[i]
          } at index ${i} and ${complement} at index ${newMap.get(
            complement
          )} add up to ${target}.`
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));
        break;
      }

      newMap.set(nums[i], i);
      setMap(new Map(newMap));
      setDescription(
        `The complement ${complement} wasn't found in the map. Adding ${nums[i]} to the map with index ${i}.`
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    setCurrentIndex(null);
    setIsAnimating(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      <h1 className="text-3xl font-bold mb-8">Two Sum Animation</h1>
      <div className="relative w-[520px] h-40">
        <AnimatePresence>
          {nums.map((num, index) => (
            <motion.div
              key={`num-${index}`}
              className={`absolute w-20 h-32 rounded-lg bg-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-2 border-white`}
              style={{
                left: index * 100,
                background: `linear-gradient(135deg, #3b82f6 0%, #3b82f6 50%, #ffffff 100%)`,
                boxShadow:
                  "0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)",
              }}
              initial={false}
              animate={{
                scale:
                  index === currentIndex || index === targetIndex ? 1.1 : 1,
                opacity: isAnimating && index > (currentIndex ?? -1) ? 0.5 : 1,
                zIndex:
                  index === currentIndex || index === targetIndex ? 10 : 1,
                rotate:
                  index === currentIndex || index === targetIndex ? 10 : 0,
                x: map.has(num) ? map.get(num)! * 10 + 10 : 0,
                y: map.has(num) ? 246 : 0,
              }}
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 120,
                damping: 20,
              }}
              whileHover={{ scale: 1.2, rotate: 5 }}
            >
              {num}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="relative w-[520px] h-40 mb-8">
        <h2 className="text-2xl font-bold mb-4 bg-green-100 p-2 rounded-lg inline-block">
          Map
        </h2>
        <div className="absolute top-20 left-0 w-full h-36 bg-green-50 rounded-lg border-2 border-green-200"></div>
      </div>
      <motion.p
        className="text-xl mb-4 h-16 text-center max-w-2xl mt-16"
        initial={false}
        animate={{ opacity: description ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {description.split(" ").map((word, index) => (
          <span
            key={index}
            className={word.match(/\d+/) ? "font-bold text-blue-600" : ""}
          >
            {word}{" "}
          </span>
        ))}
      </motion.p>
      <Button
        onClick={twoSum}
        variant="default"
        size="lg"
        disabled={isAnimating}
        className="px-4 py-2 text-white rounded transition-colors duration-300"
      >
        {isAnimating ? "Animating..." : "Start Animation"}
      </Button>
    </div>
  );
}
