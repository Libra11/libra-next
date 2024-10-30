/**
 * Author: Libra
 * Date: 2024-10-29 18:15:23
 * LastEditors: Libra
 * Description:
 */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function EnhancedLongestPalindromeSubstring() {
  const [input, setInput] = useState("babad");
  const [step, setStep] = useState(0);
  const [center, setCenter] = useState(-1);
  const [left, setLeft] = useState(-1);
  const [right, setRight] = useState(-1);
  const [currentPalindrome, setCurrentPalindrome] = useState("");
  const [longestPalindromeFound, setLongestPalindromeFound] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed] = useState(1000); // 动画速度(毫秒)
  const [expandSteps, setExpandSteps] = useState<string[]>([]);

  useEffect(() => {
    if (!isPlaying) return;

    const totalSteps = input.length * 2;

    const timer = setTimeout(() => {
      if (step < totalSteps) {
        const i = Math.floor(step / 2);
        const isOdd = step % 2 === 0;

        setCenter(i);
        setLeft(i);
        setRight(isOdd ? i : i + 1);

        let currentLeft = isOdd ? i : i;
        let currentRight = isOdd ? i : i + 1;
        const steps: string[] = [];

        // 记录扩展过程中的每一步
        steps.push(`开始检查${isOdd ? "奇数" : "偶数"}长度回文串：`);
        steps.push(
          `中心位置：${
            isOdd
              ? `字符 "${input[i]}"`
              : `字符 "${input[i]}" 和 "${input[i + 1]}" 之间`
          }`
        );

        const expandPalindrome = () => {
          if (
            currentLeft >= 0 &&
            currentRight < input.length &&
            input[currentLeft] === input[currentRight]
          ) {
            const newPalindrome = input.substring(
              currentLeft,
              currentRight + 1
            );
            setCurrentPalindrome(newPalindrome);
            steps.push(`扩展到：${newPalindrome}`);

            if (newPalindrome.length > longestPalindromeFound.length) {
              setLongestPalindromeFound(newPalindrome);
              steps.push(`✨ 找到新的最长回文串：${newPalindrome}`);
            }

            setLeft(currentLeft);
            setRight(currentRight);
            currentLeft--;
            currentRight++;
            setTimeout(expandPalindrome, speed / 3);
          } else {
            steps.push("无法继续扩展，检查下一个中心位置");
            setExpandSteps(steps);
            setStep(step + 1);
          }
        };

        expandPalindrome();
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [step, input, longestPalindromeFound, isPlaying, speed]);

  const resetAnimation = () => {
    setStep(0);
    setCenter(-1);
    setLeft(-1);
    setRight(-1);
    setCurrentPalindrome("");
    setLongestPalindromeFound("");
    setExpandSteps([]);
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col items-center justify-center  bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 p-8">
      <h1 className="text-4xl font-bold mb-8 text-indigo-800 dark:text-indigo-200">
        最长回文子串（中心扩散法）动画演示
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-4xl">
        {/* 控制面板 */}
        <div className="mb-6 flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              测试字符串：
            </label>
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                resetAnimation();
              }}
              className="w-full px-4 py-2 text-lg border-2 border-indigo-300 dark:border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-3 rounded-lg ${
                isPlaying ? "bg-orange-500" : "bg-green-500"
              } text-white`}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={resetAnimation}
              className="p-3 rounded-lg bg-gray-500 text-white"
            >
              <RotateCcw size={24} />
            </button>
          </div>
        </div>

        {/* 字符串可视化 */}
        <div className="mb-8 relative">
          <div className="flex justify-center items-center space-x-4 mb-4">
            {input.split("").map((char, index) => (
              <motion.div
                key={index}
                className={`w-14 h-14 flex items-center justify-center text-xl font-semibold border-2 rounded-lg border-gray-300 dark:border-gray-600
                  ${
                    index === center
                      ? "bg-yellow-100 dark:bg-yellow-900 border-yellow-400 dark:border-yellow-600"
                      : ""
                  }
                  ${
                    index >= left && index <= right
                      ? "bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600"
                      : ""
                  }
                  dark:text-white
                  transition-all duration-300`}
                animate={{
                  scale: index >= left && index <= right ? 1.1 : 1,
                }}
              >
                {char}
              </motion.div>
            ))}
          </div>

          {/* 指针标识 */}
          <div className="flex justify-center gap-4 mt-2">
            {center !== -1 && (
              <>
                <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded-md text-sm">
                  中心位置
                </span>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-md text-sm">
                  当前回文范围
                </span>
              </>
            )}
          </div>
        </div>

        {/* 结果展示 */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-blue-800 dark:text-blue-200">
              当前回文串
            </h2>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-300 bg-white dark:bg-gray-700 p-3 rounded-md min-h-[3rem] flex items-center justify-center">
              {currentPalindrome || "-"}
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-green-800 dark:text-green-200">
              最长回文子串
            </h2>
            <div className="text-2xl font-bold text-green-600 dark:text-green-300 bg-white dark:bg-gray-700 p-3 rounded-md min-h-[3rem] flex items-center justify-center">
              {longestPalindromeFound || "-"}
            </div>
          </div>
        </div>

        {/* 算法步骤说明 */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 p-6 rounded-xl">
          <h3 className="text-2xl font-semibold mb-4 text-indigo-800 dark:text-indigo-200">
            执行步骤
          </h3>
          <div className="space-y-2">
            {expandSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-2 rounded ${
                  step.includes("✨")
                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                }`}
              >
                {step}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 进度条 */}
      <div className="mt-8 flex items-center gap-4">
        <div className="text-indigo-600 dark:text-indigo-300 font-semibold">
          进度：{step} / {input.length * 2}
        </div>
        <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 dark:bg-indigo-400 transition-all duration-300"
            style={{ width: `${(step / (input.length * 2)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
