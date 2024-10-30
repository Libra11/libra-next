/**
 * Author: Libra
 * Date: 2024-10-30 09:42:36
 * LastEditors: Libra
 * Description:
 */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const convert = (s: string, numRows: number) => {
  if (numRows === 1) return s;
  const rows = new Array(numRows).fill("");
  let currentRow = 0;
  let goingDown = true;

  for (const char of s) {
    rows[currentRow] += char;
    if (currentRow === 0) {
      goingDown = true;
    } else if (currentRow === numRows - 1) {
      goingDown = false;
    }
    currentRow += goingDown ? 1 : -1;
  }

  return rows.join("");
};

// 修改 Step 类型，添加更详细的描述
type Step = {
  char: string;
  row: number;
  col: number;
  description: string;
  detailedSteps: string[]; // 添加详细步骤说明
  currentRows: string[]; // 添加每一步的行状态
};

export default function ZigZagConversion() {
  const [input, setInput] = useState("PAYPALISHIRING");
  const [numRows, setNumRows] = useState(3);
  const [animationSteps, setAnimationSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1500); // 动画速度控制

  // 添加输入验证函数
  const validateAndUpdateInput = (value: string) => {
    setInput(value || ""); // 如果为空则设置为空字符串
    setCurrentStep(0);
    setIsAnimating(false);
  };

  const validateAndUpdateNumRows = (value: string) => {
    const num = parseInt(value);
    // 确保行数至少为1，且不超过输入字符串长度
    if (!isNaN(num) && num >= 1) {
      setNumRows(num);
    } else {
      setNumRows(1); // 默认值
    }
    setCurrentStep(0);
    setIsAnimating(false);
  };

  const validateAndUpdateSpeed = (value: string) => {
    const speed = parseInt(value);
    if (!isNaN(speed) && speed >= 100 && speed <= 3000) {
      setAnimationSpeed(speed);
    } else {
      setAnimationSpeed(1500); // 默认值
    }
  };

  useEffect(() => {
    // 添加输入验证
    if (!input || numRows < 1) {
      setAnimationSteps([]);
      setResult("");
      return;
    }

    // 确保numRows不超过输入字符串长度
    const effectiveNumRows = Math.min(numRows, input.length);

    const steps: Step[] = [];
    const rows = new Array(effectiveNumRows).fill("").map(() => "");
    let currentRow = 0;
    let goingDown = true;
    let col = 0;

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      const detailedSteps = [
        `第 ${i + 1} 步：处理字符 '${char}'`,
        `当前在第 ${currentRow + 1} 行`,
        goingDown ? "向下移动" : "向上(对角线)移动",
      ];

      if (currentRow === 0) {
        detailedSteps.push("到达顶部，开始向下移动");
      } else if (currentRow === effectiveNumRows - 1) {
        detailedSteps.push("到达底部，开始向上移动");
      }

      // 复制当前行状态
      const currentRows = [...rows];
      currentRows[currentRow] += char;

      steps.push({
        char,
        row: currentRow,
        col,
        description: `添加字符 '${char}' 到第 ${currentRow + 1} 行`,
        detailedSteps,
        currentRows,
      });

      rows[currentRow] += char;

      if (currentRow === 0) {
        goingDown = true;
      } else if (currentRow === effectiveNumRows - 1) {
        goingDown = false;
      }

      if (goingDown) {
        currentRow++;
      } else {
        currentRow--;
        col++;
      }
    }

    setAnimationSteps(steps);
    setResult(convert(input, effectiveNumRows));
  }, [input, numRows]);

  useEffect(() => {
    if (isAnimating && currentStep < animationSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, animationSpeed); // Slowed down to 1.5 seconds per step
      return () => clearTimeout(timer);
    } else if (currentStep >= animationSteps.length) {
      setIsAnimating(false);
    }
  }, [currentStep, animationSteps.length, isAnimating, animationSpeed]);

  const handleStart = () => {
    setCurrentStep(0);
    setIsAnimating(true);
  };

  const handlePause = () => {
    setIsAnimating(false);
  };

  const handleResume = () => {
    setIsAnimating(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        Z字形变换可视化演示
      </h1>

      {/* 控制面板 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-4xl mb-8">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <Label
              htmlFor="input"
              className="text-lg font-medium text-gray-700 dark:text-gray-200"
            >
              输入字符串
            </Label>
            <Input
              id="input"
              type="text"
              value={input}
              onChange={(e) => validateAndUpdateInput(e.target.value)}
              className="w-full px-4 py-2 text-lg border-2 border-indigo-300 dark:border-indigo-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <Label
              htmlFor="numRows"
              className="text-lg font-medium text-gray-700 dark:text-gray-200"
            >
              行数
            </Label>
            <Input
              id="numRows"
              type="number"
              value={numRows}
              onChange={(e) => validateAndUpdateNumRows(e.target.value)}
              min="1"
              className="w-full px-4 py-2 text-lg border-2 border-indigo-300 dark:border-indigo-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <Label
              htmlFor="speed"
              className="text-lg font-medium text-gray-700 dark:text-gray-200"
            >
              动画速度 (ms)
            </Label>
            <Input
              id="speed"
              type="number"
              value={animationSpeed}
              onChange={(e) => validateAndUpdateSpeed(e.target.value)}
              min="100"
              max="3000"
              step="100"
              className="w-full px-4 py-2 text-lg border-2 border-indigo-300 dark:border-indigo-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={handleStart}
            disabled={isAnimating}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6"
          >
            重新开始
          </Button>
          {isAnimating ? (
            <Button
              onClick={handlePause}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6"
            >
              暂停
            </Button>
          ) : (
            <Button
              onClick={handleResume}
              disabled={
                currentStep === 0 || currentStep >= animationSteps.length
              }
              className="bg-green-500 hover:bg-green-600 text-white px-6"
            >
              继续
            </Button>
          )}
        </div>
      </div>

      {/* 主要动画区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-4xl space-y-8">
        {/* Z字形变换网格 */}
        <div className="border dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
            Z字形变换过程
          </h2>
          <div
            className="relative border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-[4.8px]"
            style={{ height: `${numRows * 50}px` }}
          >
            {/* 网格线 */}
            {Array.from({ length: numRows }).map((_, index) => (
              <div
                key={`grid-${index}`}
                className="absolute w-full h-[1px] bg-gray-100 dark:bg-gray-700"
                style={{ top: `${index * 50}px` }}
              />
            ))}

            {/* 字符动画 */}
            <AnimatePresence>
              {animationSteps.slice(0, currentStep).map((step, index) => (
                <motion.div
                  key={index}
                  className="absolute w-10 h-10 flex items-center justify-center bg-indigo-500 text-white rounded-full shadow-lg font-bold"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: step.col * 44,
                    y: step.row * 50,
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                >
                  {step.char}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* 当前行状态 */}
        <div className="border dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
            当前各行状态
          </h2>
          <div className="space-y-2">
            {currentStep > 0 &&
              animationSteps[currentStep - 1].currentRows.map((row, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-900 p-2 rounded"
                >
                  <span className="font-semibold text-gray-600 dark:text-gray-300">
                    第 {index + 1} 行:
                  </span>
                  <span className="font-mono bg-indigo-100 dark:bg-indigo-900 px-2 py-1 rounded dark:text-gray-200">
                    {row || "空"}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* 步骤说明 */}
        <div className="border dark:border-gray-700 rounded-lg p-6 shadow-sm bg-gray-50 dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
            步骤说明
          </h2>
          <div className="space-y-2">
            {currentStep > 0 &&
              animationSteps[currentStep - 1].detailedSteps.map(
                (step, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-gray-600 dark:text-gray-300"
                  >
                    • {step}
                  </motion.p>
                )
              )}
          </div>
        </div>

        {/* 最终结果 */}
        <div className="border dark:border-gray-700 rounded-lg p-6 shadow-sm text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
            转换结果
          </h2>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-mono bg-gray-50 dark:bg-gray-900 p-4 rounded">
            {result}
          </div>
        </div>
      </div>

      {/* 进度条 */}
      <div className="mt-8 w-full max-w-4xl">
        <Progress
          value={
            animationSteps.length > 0
              ? (currentStep / animationSteps.length) * 100
              : 0
          }
          className="h-2"
        />
        <div className="text-center mt-2 text-gray-600 dark:text-gray-300">
          步骤：{currentStep} / {animationSteps.length}
        </div>
      </div>
    </div>
  );
}
