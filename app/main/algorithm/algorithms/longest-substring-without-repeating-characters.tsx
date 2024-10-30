/**
 * Author: Libra
 * Date: 2024-10-29 16:10:07
 * LastEditors: Libra
 * Description:
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const findLongestSubstring = async () => {
    setIsAnimating(true);
    setStep(0);
    let maxLen = 0;
    let left = 0;
    let map = new Map();

    for (let right = 0; right < input.length; right++) {
      setRight(right);
      setDescription(
        `正在处理字符: <span class="text-blue-500 font-bold">${input[right]}</span> 位置: ${right}`
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStep((prev) => prev + 1);

      if (map.has(input[right])) {
        left = Math.max(map.get(input[right]) + 1, left);
        setLeft(left);
        setDescription(
          `字符 <span class="text-red-500 font-bold">${input[right]}</span> 已存在于映射中。左指针移动到位置 ${left}`
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setStep((prev) => prev + 1);
      }

      maxLen = Math.max(maxLen, right - left + 1);
      setMaxLength(maxLen);
      setCurrentSubstring(input.slice(left, right + 1));
      setDescription(
        `当前子串: <span class="text-green-500 font-bold">${input.slice(
          left,
          right + 1
        )}</span>, 最大长度: <span class="text-green-500 font-bold">${maxLen}</span>`
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStep((prev) => prev + 1);

      map.set(input[right], right);
      setCharMap(new Map(map));
    }

    setDescription("动画演示完成");
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
        无重复字符的最长子串
      </motion.h1>

      <div className="mb-8 w-full max-w-md">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="请输入字符串"
          className="w-full p-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg 
            focus:border-blue-500 focus:outline-none 
            bg-white dark:bg-gray-800 
            text-gray-900 dark:text-gray-100"
          disabled={isAnimating}
        />
      </div>

      <div className="space-y-8 mb-8">
        <div className="flex items-center">
          <motion.span
            className="mr-4 font-bold w-20 text-end text-2xl dark:text-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            输入:
          </motion.span>
          <div className="flex">
            {input.split("").map((char, index) => (
              <motion.div
                key={index}
                className={`w-16 h-16 rounded-lg bg-blue-500 dark:bg-blue-600 
                  flex items-center justify-center text-white text-2xl font-bold 
                  shadow-lg border-2 border-white dark:border-gray-700 mx-1`}
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
            className="mr-4 font-bold w-20 text-end text-2xl dark:text-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            当前:
          </motion.span>
          <div className="flex overflow-hidden">
            {currentSubstring.split("").map((char, index) => (
              <motion.div
                key={index}
                className={`w-16 h-16 rounded-lg bg-green-500 dark:bg-green-600 
                  flex items-center justify-center text-white text-2xl font-bold 
                  shadow-lg border-2 border-white dark:border-gray-700 mx-1`}
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
            className="mr-4 font-bold w-20 text-end text-2xl dark:text-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            最大:
          </motion.span>
          <motion.div
            className="text-2xl font-bold text-green-500 dark:text-green-400"
            initial={false}
            animate={{ opacity: maxLength ? 1 : 0 }}
          >
            {maxLength}
          </motion.div>
        </div>
      </div>

      <motion.p
        className="text-xl mb-4 text-center max-w-3xl 
          bg-yellow-100 dark:bg-yellow-900 
          text-gray-800 dark:text-gray-100 
          p-6 rounded-lg shadow-md"
        initial={false}
        animate={{ opacity: description ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <div className="mb-4 dark:text-gray-100">步骤: {step}</div>
      <Button
        onClick={findLongestSubstring}
        variant="default"
        size="lg"
        disabled={isAnimating}
        className="px-4 py-2 text-white rounded transition-colors duration-300
          disabled:bg-gray-400 dark:disabled:bg-gray-600"
      >
        {isAnimating ? "动画演示中..." : "开始演示"}
      </Button>
    </div>
  );
}
