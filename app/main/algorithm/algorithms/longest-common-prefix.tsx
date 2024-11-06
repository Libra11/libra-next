/**
 * Author: Libra
 * Date: 2024-11-06 15:14:06
 * LastEditors: Libra
 * Description: 最长公共前缀动画演示
 */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw } from "lucide-react";

// 定义每一步的类型
type Step = {
  type: "divide" | "merge" | "compare";
  start: number;
  end: number;
  mid?: number;
  leftPrefix?: string;
  rightPrefix?: string;
  result?: string;
  description: string;
  detailedSteps: string[];
  level: number;
  comparisonDetails?: string[];
  commonPrefixProcess?: string[];
};

export default function LongestCommonPrefixAnimation() {
  const [input, setInput] = useState("flower,flow,flight");
  const [strs, setStrs] = useState<string[]>(["flower", "flow", "flight"]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1500);

  // 生成动画步骤
  const generateSteps = (
    strs: string[],
    start: number,
    end: number,
    level: number = 0
  ): Step[] => {
    const steps: Step[] = [];

    if (start === end) {
      steps.push({
        type: "divide",
        start,
        end,
        description: `处理单个字符串: "${strs[start]}"`,
        detailedSteps: [
          `当前处理的字符串: "${strs[start]}"`,
          `因为只有一个字符串，所以直接返回该字符串作为公共前缀`,
        ],
        level,
      });
      return steps;
    }

    const mid = Math.floor((start + end) / 2);

    // 添加分治步骤
    steps.push({
      type: "divide",
      start,
      end,
      mid,
      description: `将区间 [${start}, ${end}] 分为两部分`,
      detailedSteps: [
        `当前处理的字符串范围: [${strs.slice(start, end + 1).join(", ")}]`,
        `计算中间位置: Math.floor((${start} + ${end}) / 2) = ${mid}`,
        `左半部分 [${start}, ${mid}]: [${strs
          .slice(start, mid + 1)
          .join(", ")}]`,
        `右半部分 [${mid + 1}, ${end}]: [${strs
          .slice(mid + 1, end + 1)
          .join(", ")}]`,
        `分治算法将问题分解为两个子问题：`,
        `1. 计算左半部分 ${
          strs.slice(start, mid + 1).length
        } 个字符串的最长公共前缀`,
        `2. 计算右半部分 ${
          strs.slice(mid + 1, end + 1).length
        } 个字符串的最长公共前缀`,
      ],
      level,
    });

    // 递归处理左半部分
    steps.push(...generateSteps(strs, start, mid, level + 1));
    const leftPrefix = divideAndConquer(strs, start, mid);

    // 递归处理右半部分
    steps.push(...generateSteps(strs, mid + 1, end, level + 1));
    const rightPrefix = divideAndConquer(strs, mid + 1, end);

    // 添加合并步骤，包含详细的比较过程
    const result = commonPrefix(leftPrefix, rightPrefix);
    const comparisonDetails = generateComparisonDetails(
      leftPrefix,
      rightPrefix
    );

    steps.push({
      type: "merge",
      start,
      end,
      leftPrefix,
      rightPrefix,
      result,
      description: `合并左右两部分的结果`,
      detailedSteps: [
        `左半部分的公共前缀: "${leftPrefix}"`,
        `右半部分的公共前缀: "${rightPrefix}"`,
        `开始比较两个前缀以找出公共部分...`,
        ...comparisonDetails,
        `最终得到的公共前缀: "${result}"`,
      ],
      level,
      comparisonDetails,
      commonPrefixProcess: [
        `比较长度: min(${leftPrefix.length}, ${
          rightPrefix.length
        }) = ${Math.min(leftPrefix.length, rightPrefix.length)}`,
        ...generateCommonPrefixProcess(leftPrefix, rightPrefix),
      ],
    });

    return steps;
  };

  // 分治法实现
  const divideAndConquer = (
    strs: string[],
    start: number,
    end: number
  ): string => {
    if (start === end) {
      return strs[start];
    }

    const mid = Math.floor((start + end) / 2);
    const leftPrefix = divideAndConquer(strs, start, mid);
    const rightPrefix = divideAndConquer(strs, mid + 1, end);
    return commonPrefix(leftPrefix, rightPrefix);
  };

  // 计算两个字符串的公共前缀
  const commonPrefix = (str1: string, str2: string): string => {
    const minLength = Math.min(str1.length, str2.length);
    for (let i = 0; i < minLength; i++) {
      if (str1[i] !== str2[i]) {
        return str1.substring(0, i);
      }
    }
    return str1.substring(0, minLength);
  };

  // 处理输入变化
  const handleInputChange = (value: string) => {
    setInput(value);
    try {
      const newStrs = value.split(",").filter((s) => s.trim());
      setStrs(newStrs);
      setCurrentStep(0);
      setIsAnimating(false);
    } catch (error) {
      console.error("Invalid input format");
    }
  };

  // 开始动画
  const handleStart = () => {
    if (strs.length === 0) return;
    const newSteps = generateSteps(strs, 0, strs.length - 1);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsAnimating(true);
  };

  // 动画控制
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAnimating && currentStep < steps.length) {
      timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, animationSpeed);
    } else if (currentStep >= steps.length) {
      setIsAnimating(false);
    }
    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, steps.length, animationSpeed]);

  // 添加生成比较详情的辅助函数
  const generateComparisonDetails = (str1: string, str2: string): string[] => {
    const details: string[] = [];
    const minLength = Math.min(str1.length, str2.length);

    for (let i = 0; i < minLength; i++) {
      if (str1[i] === str2[i]) {
        details.push(`位置 ${i}: "${str1[i]}" = "${str2[i]}" (匹配)`);
      } else {
        details.push(
          `位置 ${i}: "${str1[i]}" ≠ "${str2[i]}" (不匹配，停止比较)`
        );
        break;
      }
    }

    if (details.length === minLength) {
      details.push(`已达到较短字符串的长度，截取前 ${minLength} 个字符`);
    }

    return details;
  };

  // 添加生成公共前缀计算过程的辅助函数
  const generateCommonPrefixProcess = (
    str1: string,
    str2: string
  ): string[] => {
    const process: string[] = [];
    const minLength = Math.min(str1.length, str2.length);
    let commonPrefix = "";

    for (let i = 0; i < minLength; i++) {
      if (str1[i] === str2[i]) {
        commonPrefix += str1[i];
        process.push(`添加字符 "${str1[i]}"，当前公共前缀: "${commonPrefix}"`);
      } else {
        process.push(`发现不匹配字符，停止添加`);
        break;
      }
    }

    return process;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        最长公共前缀（分治法）动画演示
      </h1>

      {/* 控制面板 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-4xl mb-8">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              输入字符串数组（用逗号分隔）
            </label>
            <Input
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full px-4 py-2 text-lg border-2 border-indigo-300 dark:border-indigo-600 rounded-md"
              disabled={isAnimating}
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              动画速度 (ms)
            </label>
            <Input
              type="number"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              min="500"
              max="3000"
              step="100"
              className="w-full px-4 py-2 text-lg border-2 border-indigo-300 dark:border-indigo-600 rounded-md"
            />
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={handleStart}
            disabled={isAnimating}
            className="bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            重新开始
          </Button>
          <Button
            onClick={() => setIsAnimating(!isAnimating)}
            disabled={currentStep >= steps.length}
            className={`${isAnimating ? "bg-orange-500" : "bg-green-500"}`}
          >
            {isAnimating ? <Pause size={20} /> : <Play size={20} />}
          </Button>
          <Button
            onClick={() => {
              setCurrentStep(0);
              setIsAnimating(false);
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            <RotateCcw size={20} />
          </Button>
        </div>
      </div>

      {/* 主要动画区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-4xl space-y-8">
        {/* 字符串数组可视化 */}
        <div className="border dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
            输入数组
          </h2>
          <div className="flex flex-wrap gap-4">
            {strs.map((str, index) => (
              <motion.div
                key={index}
                className={`px-4 py-2 rounded-lg font-mono text-lg ${
                  currentStep > 0 &&
                  steps[currentStep - 1].start <= index &&
                  index <= steps[currentStep - 1].end
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {str}
              </motion.div>
            ))}
          </div>
        </div>

        {/* 递归树可视化 */}
        <div className="border dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
            递归过程详解
          </h2>
          <div className="flex flex-col items-center space-y-4">
            {currentStep > 0 && (
              <motion.div
                className="w-full bg-blue-100 dark:bg-blue-900 p-4 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* 递归层级指示器 */}
                <div className="mb-2 flex items-center">
                  <div className="text-sm text-blue-600 dark:text-blue-300">
                    递归深度: {steps[currentStep - 1].level}
                  </div>
                  <div className="ml-2 flex">
                    {Array(steps[currentStep - 1].level)
                      .fill(0)
                      .map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-4 h-4 mx-1 bg-blue-500 dark:bg-blue-400 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        />
                      ))}
                  </div>
                </div>

                {/* 当前步骤描述 */}
                <div className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
                  {steps[currentStep - 1].description}
                </div>

                {/* 详细步骤说明 */}
                <div className="space-y-2">
                  {steps[currentStep - 1].detailedSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-2 text-blue-600 dark:text-blue-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="font-bold">•</span>
                      <span>{step}</span>
                    </motion.div>
                  ))}
                </div>

                {/* 字符比较详情 */}
                {steps[currentStep - 1].comparisonDetails && (
                  <div className="mt-4 bg-blue-200 dark:bg-blue-800 p-3 rounded-lg">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      字符比较过程:
                    </h3>
                    <div className="space-y-1">
                      {steps[currentStep - 1].comparisonDetails?.map(
                        (detail, index) => (
                          <motion.div
                            key={index}
                            className="text-blue-700 dark:text-blue-300"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {detail}
                          </motion.div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* 公共前缀计算过程 */}
                {steps[currentStep - 1].commonPrefixProcess && (
                  <div className="mt-4 bg-blue-200 dark:bg-blue-800 p-3 rounded-lg">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      公共前缀计算过程:
                    </h3>
                    <div className="space-y-1">
                      {steps[currentStep - 1].commonPrefixProcess?.map(
                        (process, index) => (
                          <motion.div
                            key={index}
                            className="text-blue-700 dark:text-blue-300"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {process}
                          </motion.div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* 当前步骤结果 */}
        {currentStep > 0 && steps[currentStep - 1].type === "merge" && (
          <div className="border dark:border-gray-700 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
              合并结果
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="text-sm text-purple-600 dark:text-purple-300">
                  左半部分
                </div>
                <div className="text-lg font-mono font-bold text-purple-800 dark:text-purple-200">
                  {steps[currentStep - 1].leftPrefix}
                </div>
              </motion.div>
              <motion.div
                className="bg-green-100 dark:bg-green-900 p-4 rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-sm text-green-600 dark:text-green-300">
                  右半部分
                </div>
                <div className="text-lg font-mono font-bold text-green-800 dark:text-green-200">
                  {steps[currentStep - 1].rightPrefix}
                </div>
              </motion.div>
              <motion.div
                className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-sm text-indigo-600 dark:text-indigo-300">
                  合并结果
                </div>
                <div className="text-lg font-mono font-bold text-indigo-800 dark:text-indigo-200">
                  {steps[currentStep - 1].result}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* 进度条 */}
      <div className="mt-8 w-full max-w-4xl">
        <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        <div className="text-center mt-2 text-gray-600 dark:text-gray-300">
          步骤：{currentStep} / {steps.length}
        </div>
      </div>
    </div>
  );
}
