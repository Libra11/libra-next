/**
 * Author: Libra
 * Date: 2024-11-04 10:53:16
 * LastEditors: Libra
 * Description:
 */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

// 初始高度数组
const initialHeights = [1, 8, 6, 2, 5, 4, 8, 3, 7];

export default function ContainerWithMostWater() {
  const [heights, setHeights] = useState(initialHeights);
  const [step, setStep] = useState(0);
  const [maxArea, setMaxArea] = useState(0);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(initialHeights.length - 1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [detailedSteps, setDetailedSteps] = useState<string[]>([]);
  const [inputHeights, setInputHeights] = useState(initialHeights.join(","));
  const [animationSpeed, setAnimationSpeed] = useState(1500);
  const [totalSteps, setTotalSteps] = useState(0);

  const containerWidth = 800;
  const containerHeight = 400;
  const barWidth = (containerWidth / heights.length) * 0.8;
  const barSpacing =
    (containerWidth - barWidth * heights.length) / (heights.length + 1);

  const maxHeight = Math.max(...heights);
  const heightScale = (containerHeight * 0.85) / maxHeight;

  const handleNextStep = () => {
    if (step < totalSteps && left < right) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // 重置函数
  const resetAnimation = () => {
    setStep(0);
    setMaxArea(0);
    setLeft(0);
    setRight(heights.length - 1);
    setIsPlaying(false);
    setExplanation("");
    setDetailedSteps([]);
    const stepsNeeded = calculateTotalSteps();
    setTotalSteps(stepsNeeded);
  };

  // 验证和更新输入
  const handleHeightsChange = (value: string) => {
    setInputHeights(value);
    try {
      const newHeights = value.split(",").map((num) => parseInt(num.trim()));
      if (newHeights.some(isNaN)) throw new Error();
      setHeights(newHeights);
      resetAnimation();
    } catch (error) {
      // 保持原来的高度值不变
      console.log("Invalid input format");
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && left < right) {
      timer = setTimeout(() => {
        if (step < totalSteps) {
          setStep((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, animationSpeed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step, left, right, totalSteps, animationSpeed]);

  useEffect(() => {
    const stepsNeeded = calculateTotalSteps();
    setTotalSteps(stepsNeeded);
  }, [heights]);

  useEffect(() => {
    const currentArea =
      (right - left) * Math.min(heights[left], heights[right]);

    // 如果左右指针相遇或交叉，结束算法
    if (left >= right) {
      setIsPlaying(false);
      setExplanation("算法完成！找到的最大容器面积为: " + maxArea);
      setDetailedSteps((prev) => [
        ...prev,
        "算法执行完毕，最终最大面积为: " + maxArea,
      ]);
      return;
    }

    // 更新最大面积
    if (currentArea > maxArea) {
      setMaxArea(currentArea);
      setDetailedSteps((prev) => [...prev, `找到新的最大面积: ${currentArea}`]);
    }

    // 根据步骤执行相应操作
    if (step % 2 === 0) {
      // 计算当前面积的步骤
      setExplanation(`计算当前容器面积`);
      setDetailedSteps((prev) => [
        ...prev,
        `计算位置 ${left} 和 ${right} 之间的容器面积:`,
        `宽度 = ${right - left}`,
        `高度 = Math.min(${heights[left]}, ${heights[right]}) = ${Math.min(
          heights[left],
          heights[right]
        )}`,
        `面积 = ${currentArea}`,
      ]);
    } else {
      // 移动指针的步骤
      if (heights[left] < heights[right]) {
        setLeft((prev) => prev + 1);
        setExplanation("左指针向右移动");
        setDetailedSteps((prev) => [
          ...prev,
          `由于 height[${left}] < height[${right}]，左指针向右移动到 ${
            left + 1
          }`,
        ]);
      } else {
        setRight((prev) => prev - 1);
        setExplanation("右指针向左移动");
        setDetailedSteps((prev) => [
          ...prev,
          `由于 height[${left}] >= height[${right}]，右指针向左移动到 ${
            right - 1
          }`,
        ]);
      }
    }
  }, [step]); // 只依赖 step

  // 添加计算总步数的函数
  const calculateTotalSteps = () => {
    let l = 0;
    let r = heights.length - 1;
    let steps = 0;
    while (l < r) {
      steps += 2; // 每次迭代需要两步：计算面积和移动指针
      if (heights[l] < heights[r]) {
        l++;
      } else {
        r--;
      }
    }
    return steps;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        盛最多水的容器 - 双指针法动画演示
      </h1>

      {/* 控制面板 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-4xl mb-8">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              输入高度数组（用逗号分隔）
            </label>
            <Input
              value={inputHeights}
              onChange={(e) => handleHeightsChange(e.target.value)}
              className="w-full px-4 py-2 text-lg border-2 border-indigo-300 dark:border-indigo-600 rounded-md"
              disabled={isPlaying}
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
            onClick={handlePrevStep}
            disabled={step === 0 || isPlaying}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> 上一步
          </Button>
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`${
              isPlaying ? "bg-orange-500" : "bg-green-500"
            } text-white`}
          >
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-4 w-4" /> 暂停
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" /> 播放
              </>
            )}
          </Button>
          <Button
            onClick={handleNextStep}
            disabled={step === totalSteps || isPlaying}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            下一步 <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <Button onClick={resetAnimation} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" /> 重置
          </Button>
        </div>
      </div>

      {/* 主要动画区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-4xl">
        {/* 容器可视化 */}
        <div className="relative w-[800px] h-[400px] bg-gray-100 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-md mb-8 mx-auto overflow-hidden">
          <AnimatePresence>
            {heights.map((height, index) => (
              <motion.div
                key={index}
                className={`absolute bottom-0 rounded-sm ${
                  index === left || index === right
                    ? "bg-indigo-600 dark:bg-indigo-500 shadow-lg"
                    : "bg-purple-400 dark:bg-purple-600"
                }`}
                style={{
                  width: barWidth,
                  left: barSpacing + index * (barWidth + barSpacing),
                }}
                initial={{ height: 0 }}
                animate={{
                  height: height * heightScale,
                  scale: index === left || index === right ? 1.05 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
              >
                <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-base font-bold text-gray-700 dark:text-gray-300">
                  {height}
                </div>
              </motion.div>
            ))}

            <motion.div
              className="absolute bottom-0 bg-blue-400/20 dark:bg-blue-500/20"
              style={{
                width: (right - left) * (barWidth + barSpacing),
                left: barSpacing + left * (barWidth + barSpacing),
              }}
              animate={{
                width: (right - left) * (barWidth + barSpacing),
                height: Math.min(heights[left], heights[right]) * heightScale,
                left: barSpacing + left * (barWidth + barSpacing),
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
            >
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                            bg-blue-600 dark:bg-blue-500 text-white px-3 py-1.5 rounded-full text-base font-bold"
              >
                面积: {(right - left) * Math.min(heights[left], heights[right])}
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-5 flex flex-col items-center"
              animate={{
                left:
                  barSpacing + left * (barWidth + barSpacing) + barWidth / 2,
              }}
            >
              <div className="bg-red-500 dark:bg-red-400 text-white px-2 py-1 rounded-md font-bold text-lg">
                L
              </div>
              <div className="h-6 w-0.5 bg-red-500 dark:bg-red-400 mt-1"></div>
            </motion.div>
            <motion.div
              className="absolute -bottom-5 flex flex-col items-center"
              animate={{
                left:
                  barSpacing + right * (barWidth + barSpacing) + barWidth / 2,
              }}
            >
              <div className="bg-red-500 dark:bg-red-400 text-white px-2 py-1 rounded-md font-bold text-lg">
                R
              </div>
              <div className="h-6 w-0.5 bg-red-500 dark:bg-red-400 mt-1"></div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 当前状态和解释 */}
        <div className="space-y-4">
          <div className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
            当前最大面积: {maxArea}
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">
              当前步骤
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{explanation}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">
              详细说明
            </h3>
            <div className="space-y-2">
              {detailedSteps.slice(-4).map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-gray-600 dark:text-gray-300"
                >
                  • {step}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 进度条 */}
      <div className="mt-8 w-full max-w-4xl">
        <Progress value={(step / totalSteps) * 100} className="h-2" />
        <div className="text-center mt-2 text-gray-600 dark:text-gray-300">
          步骤：{step} / {totalSteps}
        </div>
      </div>
    </div>
  );
}
