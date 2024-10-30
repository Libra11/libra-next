/**
 * Author: Libra
 * Date: 2024-10-28 10:26:22
 * LastEditors: Libra
 * Description:
 */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TwoSumAnimation() {
  const [inputNumbers, setInputNumbers] = useState("3,9,1,7,4");
  const [inputTarget, setInputTarget] = useState("5");
  const [nums, setNums] = useState<number[]>([3, 9, 1, 7, 4]);
  const [target, setTarget] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [description, setDescription] = useState("");
  const [map, setMap] = useState<Map<number, number>>(new Map());
  // 添加一个新的状态来追踪已经移动到 Map 的具体索引
  const [mappedIndices, setMappedIndices] = useState<Set<number>>(new Set());

  // 添加重置状态的函数
  const resetState = () => {
    setCurrentStep(0);
    setMap(new Map());
    setCurrentIndex(null);
    setTargetIndex(null);
    setDescription("");
    setIsAnimating(false);
    setIsPaused(false);
    setMappedIndices(new Set());
  };

  const handleNumbersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputNumbers(e.target.value);
    try {
      const newNums = e.target.value
        .split(",")
        .map((num) => parseInt(num.trim()))
        .filter((num) => !isNaN(num));
      setNums(newNums);
    } catch (error) {
      // 如果解析失败，保持原来的nums不变
      console.log("Invalid input format");
    }
    // 重置状态
    resetState();
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputTarget(e.target.value);
    try {
      const newTarget = parseInt(e.target.value.trim());
      if (!isNaN(newTarget)) {
        setTarget(newTarget);
      }
    } catch (error) {
      console.log("Invalid target input");
    }
    // 重置状态
    resetState();
  };

  const handleStart = () => {
    try {
      const newNums = inputNumbers
        .split(",")
        .map((num) => parseInt(num.trim()));
      const newTarget = parseInt(inputTarget);

      if (newNums.some(isNaN) || isNaN(newTarget)) {
        throw new Error("请输入有效的数字");
      }

      // 完全重置状态后再设置新的数组和目标值
      resetState();
      setNums(newNums);
      setTarget(newTarget);

      // 使用 setTimeout 确保状态更新完成后再开始动画
      setTimeout(() => {
        twoSum();
      }, 0);
    } catch (error) {
      alert("请输入有效的数字，数组应该是用逗号分隔的数字");
    }
  };

  const twoSum = async () => {
    setIsAnimating(true);
    setIsPaused(false);
    const newMap = new Map<number, number>();
    // 重置已映射索引集合
    setMappedIndices(new Set());

    // 等待函数，支持暂停功能
    const wait = async (ms: number) => {
      return new Promise<void>((resolve) => {
        let startTime = Date.now();
        let elapsed = 0;

        const checkPause = () => {
          if (isPaused) {
            startTime = Date.now() - elapsed;
            requestAnimationFrame(checkPause);
          } else {
            elapsed = Date.now() - startTime;
            if (elapsed >= ms) {
              resolve();
            } else {
              requestAnimationFrame(checkPause);
            }
          }
        };

        requestAnimationFrame(checkPause);
      });
    };

    try {
      for (let i = 0; i < nums.length; i++) {
        setCurrentIndex(i);
        setCurrentStep(i);
        setDescription(
          `正在检查索引 ${i} 处的数字 ${nums[i]}。我们在寻找和为 ${target} 的另一个数。`
        );

        await wait(2000);

        const complement = target - nums[i];
        if (newMap.has(complement)) {
          const complementIndex = newMap.get(complement)!;
          setTargetIndex(complementIndex);
          setDescription(
            `找到解决方案！索引 ${i} 处的数字 ${nums[i]} 和索引 ${complementIndex} 处的数字 ${complement} 的和等于 ${target}。`
          );
          await wait(2000);
          break;
        }

        newMap.set(nums[i], i);
        setMap(new Map(newMap));
        // 更新已映射索引集合
        setMappedIndices((prev) => new Set([...prev, i]));
        setDescription(
          `在哈希表中未找到 ${complement}。将 ${nums[i]} 添加到哈希表中，索引为 ${i}。`
        );
        await wait(2000);
      }
    } finally {
      setCurrentIndex(null);
      setTargetIndex(null);
      setIsAnimating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      <h1 className="text-3xl font-bold mb-8">两数之和动画演示</h1>

      {/* 添加输入控件 */}
      <div className="flex gap-4 mb-4">
        <div className="flex flex-col">
          <label className="mb-2">输入数组（用逗号分隔）:</label>
          <Input
            value={inputNumbers}
            onChange={handleNumbersChange}
            disabled={isAnimating}
            className="w-64"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2">目标和:</label>
          <Input
            value={inputTarget}
            onChange={handleTargetChange}
            disabled={isAnimating}
            className="w-32"
          />
        </div>
      </div>

      {/* 修改动画展示部分的容器宽度 */}
      <div
        className="relative h-40"
        style={{
          width: `${Math.max(520, nums.length * 100 + 20)}px`,
        }}
      >
        {/* 移除 mode="wait" */}
        <AnimatePresence>
          {nums.map((num, index) => (
            <motion.div
              key={`num-${index}`} // 修改 key 以确保唯一性
              className={`absolute w-20 h-32 rounded-lg flex items-center justify-center text-white text-2xl font-bold shadow-lg border-2 border-white dark:border-gray-700`}
              style={{
                left: index * 100,
                background: `linear-gradient(135deg, ${
                  isAnimating && index > (currentIndex ?? -1)
                    ? "rgba(59, 130, 246, 0.5)"
                    : "#3b82f6"
                } 0%, ${
                  isAnimating && index > (currentIndex ?? -1)
                    ? "rgba(59, 130, 246, 0.5)"
                    : "#3b82f6"
                } 50%, ${
                  isAnimating && index > (currentIndex ?? -1)
                    ? "rgba(255, 255, 255, 0.5)"
                    : "#ffffff"
                } 100%)`,
                boxShadow:
                  "0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isAnimating && index > (currentIndex ?? -1) ? 0.5 : 1,
                y:
                  mappedIndices.has(index) && !isAnimating
                    ? 0
                    : mappedIndices.has(index)
                    ? 246
                    : 0,
                scale:
                  index === currentIndex || index === targetIndex ? 1.1 : 1,
                zIndex:
                  index === currentIndex || index === targetIndex ? 10 : 1,
                rotate:
                  index === currentIndex || index === targetIndex ? 10 : 0,
                x:
                  mappedIndices.has(index) && !isAnimating
                    ? 0
                    : mappedIndices.has(index)
                    ? index * 10 + 10
                    : 0,
              }}
              exit={{ opacity: 0, scale: 0.5 }}
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

      {/* 修改 Map 显示部分的容器宽度 */}
      <div
        className="relative h-40 mb-8"
        style={{
          width: `${Math.max(520, nums.length * 100 + 20)}px`,
        }}
      >
        <h2 className="text-2xl font-bold mb-4 dark:bg-green-900 bg-green-100 p-2 rounded-lg inline-block">
          Map
        </h2>
        <div className="absolute top-0 left-0 w-full h-56 dark:bg-green-900/20 bg-green-50 rounded-lg border-2 dark:border-green-800 border-green-200">
          <div className="p-4 flex flex-wrap gap-4">
            {Array.from(map).map(([key, value], index) => (
              <div
                key={index}
                className="flex items-center dark:bg-gray-800 bg-white rounded-lg p-2 shadow-sm"
              >
                <span className="font-bold dark:text-blue-400 text-blue-600">
                  {key}
                </span>
                <span className="mx-2">→</span>
                <span className="font-bold dark:text-green-400 text-green-600">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 修改描述文本部分 */}
      <motion.p
        className="text-xl mb-4 h-16 text-center max-w-2xl mt-16"
        initial={false}
        animate={{ opacity: description ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {description.split(" ").map((word, index) => (
          <span
            key={index}
            className={
              word.match(/\d+/)
                ? "font-bold dark:text-blue-400 text-blue-600"
                : ""
            }
          >
            {word}{" "}
          </span>
        ))}
      </motion.p>

      {/* 控制按钮组 */}
      <div className="flex gap-4">
        <Button
          onClick={handleStart}
          variant="default"
          size="lg"
          disabled={isAnimating}
        >
          开始动画
        </Button>
      </div>
    </div>
  );
}
