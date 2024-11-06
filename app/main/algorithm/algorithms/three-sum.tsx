/**
 * Author: Libra
 * Date: 2024-11-06 15:49:37
 * LastEditors: Libra
 * Description: 三数之和算法动画演示
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
  type: "sort" | "fix" | "move" | "skip" | "found" | "complete";
  i: number;
  left?: number;
  right?: number;
  sum?: number;
  triplet?: number[];
  description: string;
  detailedSteps: string[];
};

export default function ThreeSumAnimation() {
  const [input, setInput] = useState("-1,0,1,2,-1,-4");
  const [nums, setNums] = useState<number[]>([-1, 0, 1, 2, -1, -4]);
  const [sortedNums, setSortedNums] = useState<number[]>([]);
  const [result, setResult] = useState<number[][]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1500);

  // 生成动画步骤
  const generateSteps = (numbers: number[]): Step[] => {
    const steps: Step[] = [];
    const sorted = [...numbers].sort((a, b) => a - b);
    const result: number[][] = [];

    // 添加排序步骤
    steps.push({
      type: "sort",
      i: -1,
      description: "首先对数组进行排序",
      detailedSteps: [
        "为了更容易找到三个数的和为0的组合，我们先对数组进行排序",
        `排序前: [${numbers.join(", ")}]`,
        `排序后: [${sorted.join(", ")}]`,
      ],
    });

    // 遍历数组查找三数之和
    for (let i = 0; i < sorted.length - 2; i++) {
      // 去重：如果当前数字与前一个数字相同，跳过
      if (i > 0 && sorted[i] === sorted[i - 1]) {
        steps.push({
          type: "skip",
          i,
          description: `跳过重复的数字 ${sorted[i]}`,
          detailedSteps: [
            `当前数字 ${sorted[i]} 与前一个数字相同`,
            "为避免重复结果，跳过这个数字",
          ],
        });
        continue;
      }

      steps.push({
        type: "fix",
        i,
        description: `固定第一个数字 ${sorted[i]}`,
        detailedSteps: [
          `选择 ${sorted[i]} 作为第一个数字`,
          "使用双指针法查找剩余两个数字",
          `目标和为 ${-sorted[i]}`,
        ],
      });

      let left = i + 1;
      let right = sorted.length - 1;

      while (left < right) {
        const sum = sorted[i] + sorted[left] + sorted[right];

        steps.push({
          type: "move",
          i,
          left,
          right,
          sum,
          description: `计算当前和: ${sorted[i]} + ${sorted[left]} + ${sorted[right]} = ${sum}`,
          detailedSteps: [
            `第一个数: ${sorted[i]}`,
            `左指针指向: ${sorted[left]}`,
            `右指针指向: ${sorted[right]}`,
            `三数之和: ${sum}`,
          ],
        });

        if (sum === 0) {
          result.push([sorted[i], sorted[left], sorted[right]]);
          steps.push({
            type: "found",
            i,
            left,
            right,
            triplet: [sorted[i], sorted[left], sorted[right]],
            description: "找到一组解",
            detailedSteps: [
              `找到符合条件的三元组: [${sorted[i]}, ${sorted[left]}, ${sorted[right]}]`,
              "记录这组解并继续查找",
            ],
          });

          // 跳过重复的数字
          while (left < right && sorted[left] === sorted[left + 1]) left++;
          while (left < right && sorted[right] === sorted[right - 1]) right--;
          left++;
          right--;
        } else if (sum < 0) {
          steps.push({
            type: "move",
            i,
            left,
            right,
            sum,
            description: `和小于0，左指针右移`,
            detailedSteps: [
              `当前和: ${sorted[i]} + ${sorted[left]} + ${sorted[right]} = ${sum} < 0`,
              `因为数组已排序，要想和变大，需要左指针右移`,
              `左指针从 ${sorted[left]} 移动到 ${sorted[left + 1]}`,
            ],
          });
          left++;
        } else {
          steps.push({
            type: "move",
            i,
            left,
            right,
            sum,
            description: `和大于0，右指针左移`,
            detailedSteps: [
              `当前和: ${sorted[i]} + ${sorted[left]} + ${sorted[right]} = ${sum} > 0`,
              `因为数组已排序，要想和变小，需要右指针左移`,
              `右指针从 ${sorted[right]} 移动到 ${sorted[right - 1]}`,
            ],
          });
          right--;
        }
      }
    }

    steps.push({
      type: "complete",
      i: -1,
      description: "搜索完成",
      detailedSteps: [
        "所有可能的组合都已经检查完毕",
        `共找到 ${result.length} 组解`,
        `最终结果: ${JSON.stringify(result)}`,
      ],
    });

    return steps;
  };

  // 处理输入变化
  const handleInputChange = (value: string) => {
    setInput(value);
    try {
      const newNums = value
        .split(",")
        .map((n) => parseInt(n.trim()))
        .filter((n) => !isNaN(n));
      setNums(newNums);
      resetAnimation();
    } catch (error) {
      console.error("Invalid input format");
    }
  };

  // 重置动画
  const resetAnimation = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setSortedNums([]);
    setResult([]);
  };

  // 开始动画
  const startAnimation = () => {
    const newSteps = generateSteps(nums);
    setSteps(newSteps);
    setSortedNums([...nums].sort((a, b) => a - b));
    setCurrentStep(0);
    setIsPlaying(true);
  };

  // 动画控制
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length) {
      timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, animationSpeed);
    } else if (currentStep >= steps.length) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length, animationSpeed]);

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        三数之和算法演示
      </h1>

      {/* 控制面板 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-4xl mb-8">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              输入数组（用逗号分隔）
            </label>
            <Input
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
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
            onClick={startAnimation}
            disabled={isPlaying}
            className="bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            重新开始
          </Button>
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={currentStep >= steps.length}
            className={`${isPlaying ? "bg-orange-500" : "bg-green-500"}`}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>
          <Button
            onClick={resetAnimation}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            <RotateCcw size={20} />
          </Button>
        </div>
      </div>

      {/* 主要动画区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-4xl space-y-8">
        {/* 数组可视化 */}
        <div className="border dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
            数组状态
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {(currentStep > 0 ? sortedNums : nums).map((num, index) => (
              <motion.div
                key={index}
                className={`w-12 h-12 flex items-center justify-center rounded-lg text-white font-bold text-lg
                  ${
                    currentStep > 0 &&
                    steps[currentStep - 1].type !== "sort" &&
                    (index === steps[currentStep - 1].i ||
                      index === steps[currentStep - 1].left ||
                      index === steps[currentStep - 1].right)
                      ? "bg-green-500 dark:bg-green-600"
                      : "bg-blue-500 dark:bg-blue-600"
                  }`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y:
                    currentStep > 0 &&
                    steps[currentStep - 1].type !== "sort" &&
                    (index === steps[currentStep - 1].i ||
                      index === steps[currentStep - 1].left ||
                      index === steps[currentStep - 1].right)
                      ? -10
                      : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                {num}
              </motion.div>
            ))}
          </div>
        </div>

        {/* 当前步骤说明 */}
        <div className="border dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
            步骤说明
          </h2>
          {currentStep > 0 && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <p className="text-lg font-medium text-blue-800 dark:text-blue-200">
                  {steps[currentStep - 1].description}
                </p>
              </div>
              <div className="space-y-2">
                {steps[currentStep - 1].detailedSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-blue-500 dark:text-blue-400 mt-1">
                      •
                    </span>
                    <p className="text-gray-600 dark:text-gray-300">{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 找到的结果 */}
        <div className="border dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
            已找到的组合
          </h2>
          <div className="flex flex-wrap gap-4">
            <AnimatePresence>
              {steps
                .slice(0, currentStep)
                .filter((step) => step.type === "found")
                .map((step, index) => (
                  <motion.div
                    key={index}
                    className="bg-green-100 dark:bg-green-900 p-3 rounded-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <span className="text-green-800 dark:text-green-200 font-mono">
                      [{step.triplet?.join(", ")}]
                    </span>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>
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
