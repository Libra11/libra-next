/**
 * Author: Libra
 * Date: 2024-11-08 13:46:44
 * LastEditors: Libra
 * Description: 有效括号匹配算法动画演示
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
  type: "push" | "pop" | "complete" | "invalid";
  char?: string;
  stack: string[];
  matchingPair?: { left: string; right: string };
  description: string;
  detailedSteps: string[];
};

export default function ValidParenthesesAnimation() {
  const [input, setInput] = useState("([{}])");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1500);

  // 生成动画步骤
  const generateSteps = (s: string): Step[] => {
    const steps: Step[] = [];
    const stack: string[] = [];
    const map: { [key: string]: string } = {
      "(": ")",
      "[": "]",
      "{": "}",
    };

    for (let i = 0; i < s.length; i++) {
      const char = s[i];

      if (map[char]) {
        // 左括号，入栈
        stack.push(char);
        steps.push({
          type: "push",
          char,
          stack: [...stack],
          description: `将左括号 '${char}' 压入栈中`,
          detailedSteps: [
            `当前处理字符: '${char}'`,
            `这是一个左括号，需要入栈`,
            `栈的当前状态: ${stack.join(", ")}`,
          ],
        });
      } else {
        // 右括号，需要检查匹配
        if (stack.length === 0) {
          steps.push({
            type: "invalid",
            char,
            stack: [],
            description: `发现右括号 '${char}' 但栈为空，无效的括号序列`,
            detailedSteps: [
              `当前处理字符: '${char}'`,
              `这是一个右括号，但栈为空`,
              `没有左括号可以匹配，因此序列无效`,
            ],
          });
          return steps;
        }

        const lastChar = stack[stack.length - 1];
        if (map[lastChar] === char) {
          // 匹配成功，先记录匹配对���然后出栈
          steps.push({
            type: "pop",
            char,
            stack: [...stack],
            matchingPair: { left: lastChar, right: char },
            description: `右括号 '${char}' 与栈顶的左括号 '${lastChar}' 匹配，出栈`,
            detailedSteps: [
              `当前处理字符: '${char}'`,
              `栈顶的左括号是 '${lastChar}'`,
              `它们是匹配的括号对，即将移除`,
              `栈的当前状态: [${stack.join(", ")}]`,
            ],
          });
          stack.pop();
        } else {
          // 不匹配
          steps.push({
            type: "invalid",
            char,
            stack: [...stack],
            description: `右括号 '${char}' 与栈顶的左括号 '${lastChar}' 不匹配`,
            detailedSteps: [
              `当前处理字符: '${char}'`,
              `栈顶的左括号是 '${lastChar}'`,
              `它们不是匹配的括号对，序列无效`,
            ],
          });
          return steps;
        }
      }
    }

    // 检查最终栈是否为空
    steps.push({
      type: "complete",
      stack: [...stack],
      description:
        stack.length === 0 ? "所有括号都匹配成功" : "存在未匹配的左括号",
      detailedSteps:
        stack.length === 0
          ? ["所有括号都正确匹配", "栈为空，序列有效"]
          : [
              "还有左括号未被匹配",
              `剩余的左括号: [${stack.join(", ")}]`,
              "序列无效",
            ],
    });

    return steps;
  };

  // 处理输入变化
  const handleInputChange = (value: string) => {
    setInput(value);
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

  // 手动控制函数
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        有效括号匹配动画演示
      </h1>

      {/* 控制面板 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-4xl mb-8">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              输入括号序列
            </label>
            <Input
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full px-4 py-2 text-lg border-2 border-indigo-300 dark:border-indigo-600 rounded-md"
              placeholder="例如: ()[]{})"
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
            disabled={currentStep === 0 || isPlaying}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            上一步
          </Button>
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
          <Button
            onClick={handleNextStep}
            disabled={currentStep >= steps.length || isPlaying}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            下一步
          </Button>
        </div>
      </div>

      {/* 主要动画区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-6xl">
        <div className="grid grid-cols-2 gap-8">
          {/* 左侧列:输入序列和栈状态 */}
          <div className="space-y-8">
            {/* 输入序列可视化 */}
            <div className="border dark:border-gray-700 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
                输入序列
              </h2>
              <div className="flex justify-center space-x-2">
                {input.split("").map((char, index) => (
                  <motion.div
                    key={index}
                    className={`w-12 h-12 flex items-center justify-center rounded-lg text-white font-bold text-xl
                      ${
                        index < currentStep
                          ? "bg-green-500 dark:bg-green-600"
                          : index === currentStep && currentStep < steps.length
                          ? "bg-blue-500 dark:bg-blue-600"
                          : "bg-gray-400 dark:bg-gray-600"
                      }`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: 1,
                      scale:
                        index === currentStep && currentStep < steps.length
                          ? 1.1
                          : 1,
                      y:
                        index === currentStep && currentStep < steps.length
                          ? -10
                          : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {char}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 栈可视化 */}
            <div className="border dark:border-gray-700 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
                栈状态
              </h2>
              <div className="flex flex-col-reverse items-center space-y-reverse space-y-2">
                <AnimatePresence mode="popLayout">
                  {currentStep > 0 && (
                    <>
                      {/* 显示栈中的元素 */}
                      {steps[currentStep - 1].stack.map((char, index) => (
                        <motion.div
                          key={`stack-${index}`}
                          className={`w-12 h-12 flex items-center justify-center 
                            ${
                              steps[currentStep - 1].matchingPair?.left ===
                                char &&
                              index === steps[currentStep - 1].stack.length - 1
                                ? "bg-yellow-500 dark:bg-yellow-600" // 高亮匹配的左括号
                                : "bg-indigo-500 dark:bg-indigo-600"
                            } 
                            text-white rounded-lg font-bold text-xl`}
                          initial={{ opacity: 0, scale: 0.5, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            scale: 0.5,
                            y:
                              steps[currentStep - 1].matchingPair?.left === char
                                ? -50
                                : -20,
                            transition: { duration: 0.5 },
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {char}
                        </motion.div>
                      ))}

                      {/* 显示当前处理的右括号(如果存在匹配) */}
                      {steps[currentStep - 1].matchingPair && (
                        <motion.div
                          key="matching-right"
                          className="w-12 h-12 flex items-center justify-center bg-yellow-500 dark:bg-yellow-600 text-white rounded-lg font-bold text-xl"
                          initial={{ opacity: 0, scale: 0.5, x: 50 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{
                            opacity: 0,
                            scale: 0.5,
                            y: -50,
                            transition: { duration: 0.5 },
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {steps[currentStep - 1].matchingPair?.right}
                        </motion.div>
                      )}
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* 右侧列:步骤说明和最终结果 */}
          <div className="space-y-8">
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
                        <p className="text-gray-600 dark:text-gray-300">
                          {step}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 最终结果 */}
            {steps.length > 0 && currentStep === steps.length && (
              <motion.div
                className="border dark:border-gray-700 rounded-lg p-6 shadow-sm text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
                  最终结果
                </h2>
                <div
                  className={`text-2xl font-bold ${
                    steps[steps.length - 1].type === "complete" &&
                    steps[steps.length - 1].stack.length === 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {steps[steps.length - 1].type === "complete" &&
                  steps[steps.length - 1].stack.length === 0
                    ? "有效的括号序列"
                    : "无效的括号序列"}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* 进度条 */}
      <div className="mt-8 w-full max-w-6xl">
        <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        <div className="text-center mt-2 text-gray-600 dark:text-gray-300">
          步骤：{currentStep} / {steps.length}
        </div>
      </div>
    </div>
  );
}
