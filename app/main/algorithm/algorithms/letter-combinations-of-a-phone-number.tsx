/**
 * Author: Libra
 * Date: 2024-11-07 10:23:15
 * LastEditors: Libra
 * Description: 电话号码的字母组合算法动画演示
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
  type: "start" | "backtrack" | "add" | "complete";
  combination: string;
  nextDigits: string;
  currentDigit?: string;
  currentLetter?: string;
  result: string[];
  description: string;
  detailedSteps: string[];
};

// 数字到字母的映射
const phoneMap: { [key: string]: string } = {
  "2": "abc",
  "3": "def",
  "4": "ghi",
  "5": "jkl",
  "6": "mno",
  "7": "pqrs",
  "8": "tuv",
  "9": "wxyz",
};

export default function LetterCombinationsAnimation() {
  const [input, setInput] = useState("23");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1500);

  // 生成动画步骤
  const generateSteps = (digits: string): Step[] => {
    const steps: Step[] = [];
    const result: string[] = [];

    // 添加初始步骤
    steps.push({
      type: "start",
      combination: "",
      nextDigits: digits,
      result: [],
      description: "开始生成字母组合",
      detailedSteps: [
        "初始化空组合",
        `待处理的数字: ${digits}`,
        "准备开始回溯过程",
      ],
    });

    const backtrack = (combination: string, nextDigits: string) => {
      if (nextDigits.length === 0) {
        result.push(combination);
        steps.push({
          type: "add",
          combination,
          nextDigits: "",
          result: [...result],
          description: `找到一个有效组合: ${combination}`,
          detailedSteps: [
            `当前组合: ${combination}`,
            "没有更多数字需要处理",
            `将组合 ${combination} 添加到结果集中`,
            `当前结果集: [${result.join(", ")}]`,
          ],
        });
        return;
      }

      const digit = nextDigits[0];
      const letters = phoneMap[digit];

      steps.push({
        type: "backtrack",
        combination,
        nextDigits,
        currentDigit: digit,
        result: [...result],
        description: `处理数字 ${digit} 对应的字母 ${letters}`,
        detailedSteps: [
          `当前组合: ${combination}`,
          `当前处理的数字: ${digit}`,
          `对应的字母: ${letters}`,
          "开始遍历每个字母",
        ],
      });

      for (const letter of letters) {
        steps.push({
          type: "backtrack",
          combination,
          nextDigits,
          currentDigit: digit,
          currentLetter: letter,
          result: [...result],
          description: `将字母 ${letter} 添加到组合 ${combination} 中`,
          detailedSteps: [
            `当前组合: ${combination}`,
            `选择字母: ${letter}`,
            `新组合将为: ${combination + letter}`,
            `继续处理剩余数字: ${nextDigits.slice(1)}`,
          ],
        });
        backtrack(combination + letter, nextDigits.slice(1));
      }
    };

    backtrack("", digits);

    steps.push({
      type: "complete",
      combination: "",
      nextDigits: "",
      result: result,
      description: "所有组合生成完成",
      detailedSteps: [
        `共生成 ${result.length} 个组合`,
        `最终结果: [${result.join(", ")}]`,
      ],
    });

    return steps;
  };

  // 处理输入变化
  const handleInputChange = (value: string) => {
    // 只允许输入2-9的数字
    const filteredValue = value.replace(/[^2-9]/g, "");
    setInput(filteredValue);
    resetAnimation();
  };

  // 重置动画
  const resetAnimation = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // 开始动画
  const startAnimation = () => {
    const newSteps = generateSteps(input);
    setSteps(newSteps);
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
        电话号码的字母组合算法演示
      </h1>

      {/* 控制面板 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-4xl mb-8">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              输入数字（2-9）
            </label>
            <Input
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full px-4 py-2 text-lg border-2 border-indigo-300 dark:border-indigo-600 rounded-md"
              maxLength={4}
              disabled={isPlaying}
            />
          </div>
          <div className="flex-1">
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
          <Button
            onClick={startAnimation}
            disabled={isPlaying}
            className="bg-indigo-500 hover:bg-indigo-600 text-white h-[42px]"
          >
            重新开始
          </Button>
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={currentStep >= steps.length}
            className={`${
              isPlaying ? "bg-orange-500" : "bg-green-500"
            } h-[42px]`}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>
          <Button
            onClick={resetAnimation}
            className="bg-gray-500 hover:bg-gray-600 text-white h-[42px]"
          >
            <RotateCcw size={20} />
          </Button>
        </div>
      </div>

      {/* 主要动画区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-4xl space-y-8">
        {/* 电话键盘和步骤说明并排 */}
        <div className="grid grid-cols-2 gap-8">
          {/* 电话键盘可视化 */}
          <div className="border dark:border-gray-700 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
              电话键盘
            </h2>
            <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
              {Object.entries(phoneMap).map(([digit, letters]) => (
                <motion.div
                  key={digit}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center border-2 
                    ${
                      currentStep > 0 &&
                      steps[currentStep - 1].currentDigit === digit
                        ? "border-green-500 bg-green-50 dark:bg-green-900/30"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                    {digit}
                  </span>
                  <div className="flex gap-1 mt-1">
                    {letters.split("").map((letter) => (
                      <span
                        key={letter}
                        className={`text-sm px-1 rounded ${
                          currentStep > 0 &&
                          steps[currentStep - 1].currentDigit === digit &&
                          steps[currentStep - 1].currentLetter === letter
                            ? "bg-green-500 text-white dark:bg-green-600"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {letter}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 步骤说明 */}
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
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
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
        </div>

        {/* 当前状态和结果集并排 */}
        <div className="grid grid-cols-2 gap-8">
          {/* 当前组合状态 */}
          <div className="border dark:border-gray-700 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
              当前状态
            </h2>
            {currentStep > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600 dark:text-gray-300 w-24">
                    当前组合:
                  </span>
                  <motion.div
                    className="bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-lg font-mono text-lg flex-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {steps[currentStep - 1].combination || "(空)"}
                  </motion.div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600 dark:text-gray-300 w-24">
                    待处理数字:
                  </span>
                  <motion.div
                    className="bg-purple-100 dark:bg-purple-900 px-4 py-2 rounded-lg font-mono text-lg flex-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {steps[currentStep - 1].nextDigits || "(无)"}
                  </motion.div>
                </div>
              </div>
            )}
          </div>

          {/* 结果集 */}
          <div className="border dark:border-gray-700 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
              当前结果集
            </h2>
            <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto">
              <AnimatePresence>
                {currentStep > 0 &&
                  steps[currentStep - 1].result.map((combination, index) => (
                    <motion.div
                      key={combination}
                      className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded-lg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <span className="text-green-800 dark:text-green-200 font-mono">
                        {combination}
                      </span>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
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
