/**
 * Author: Libra
 * Date: 2024-09-23 16:42:11
 * LastEditors: Libra
 * Description: Longest Substring Without Repeating Characters Animation
 */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function LongestSubstringWithoutRepeatingAnimation() {
  const [input, setInput] = useState("abcabcbb");
  const [currentSubstring, setCurrentSubstring] = useState("");
  const [maxLength, setMaxLength] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [description, setDescription] = useState("");
  const [step, setStep] = useState(0);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [charMap, setCharMap] = useState(new Map());

  const findLongestSubstring = async () => {
    setIsAnimating(true);
    setStep(0);
    let maxLen = 0;
    let left = 0;
    let map = new Map();

    for (let right = 0; right < input.length; right++) {
      setRight(right);
      setDescription(
        `Processing character: <span class="text-blue-500 font-bold">${input[right]}</span> at index ${right}`
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStep((prev) => prev + 1);

      if (map.has(input[right])) {
        left = Math.max(map.get(input[right]) + 1, left);
        setLeft(left);
        setDescription(
          `Character <span class="text-red-500 font-bold">${input[right]}</span> is already in the map. Moving left pointer to index ${left}`
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setStep((prev) => prev + 1);
      }

      maxLen = Math.max(maxLen, right - left + 1);
      setMaxLength(maxLen);
      setCurrentSubstring(input.slice(left, right + 1));
      setDescription(
        `Current substring: <span class="text-green-500 font-bold">${input.slice(
          left,
          right + 1
        )}</span>, Max length: <span class="text-green-500 font-bold">${maxLen}</span>`
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStep((prev) => prev + 1);

      map.set(input[right], right);
      setCharMap(new Map(map));
    }

    setDescription("Animation complete.");
    setIsAnimating(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      <motion.h1
        className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Longest Substring Without Repeating Characters
      </motion.h1>
      <div className="space-y-8 mb-8">
        <div className="flex items-center">
          <motion.span
            className="mr-4 font-bold w-20 text-end text-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Input:
          </motion.span>
          <div className="flex">
            {input.split("").map((char, index) => (
              <motion.div
                key={index}
                className={`w-16 h-16 rounded-lg bg-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-2 border-white mx-1`}
                initial={false}
                animate={{
                  scale: index === right || index === left ? 1.1 : 1,
                  opacity: isAnimating && index > right ? 0.5 : 1,
                  zIndex: index === right || index === left ? 10 : 1,
                  rotate: index === right || index === left ? 10 : 0,
                }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 120,
                  damping: 20,
                }}
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                {char}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <motion.span
            className="mr-4 font-bold w-20 text-end text-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Cur:
          </motion.span>
          <div className="flex overflow-hidden">
            {currentSubstring.split("").map((char, index) => (
              <motion.div
                key={index}
                className={`w-16 h-16 rounded-lg bg-green-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-2 border-white mx-1`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 120,
                  damping: 20,
                }}
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                {char}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <motion.span
            className="mr-4 font-bold w-20 text-end text-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Max:
          </motion.span>
          <motion.div
            className="text-2xl font-bold text-green-500"
            initial={false}
            animate={{ opacity: maxLength ? 1 : 0 }}
          >
            {maxLength}
          </motion.div>
        </div>
      </div>
      <motion.p
        className="text-xl mb-4 text-center max-w-3xl bg-yellow-100 p-6 rounded-lg shadow-md"
        initial={false}
        animate={{ opacity: description ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <div className="mb-4">Step: {step}</div>
      <Button
        onClick={findLongestSubstring}
        variant="default"
        size="lg"
        disabled={isAnimating}
        className="px-4 py-2 text-white rounded transition-colors duration: 300"
      >
        {isAnimating ? "Animating..." : "Start Animation"}
      </Button>
    </div>
  );
}
