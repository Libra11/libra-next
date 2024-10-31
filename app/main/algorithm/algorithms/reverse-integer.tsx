/**
 * Author: Libra
 * Date: 2024-10-31 09:58:41
 * LastEditors: Libra
 * Description:
 */
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// 定义每一步的类型
type Step = {
  x: number;
  digit: number;
  result: number;
  newX: number;
  newResult: number;
  overflow: boolean;
  explanation: {
    extract: string;
    calculate: string;
    result: string;
  };
  visualSteps: {
    current: number;
    digit: number;
    operation: string;
    result: number;
    history: string[];
  };
};

export default function Component() {
  const [input, setInput] = useState("-321");
  const [speed, setSpeed] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const reverse = (x: number) => {
    let result = 0;
    const steps: Step[] = [];
    const history: string[] = [];

    while (x !== 0) {
      const digit = x % 10;
      const newX = Math.trunc(x / 10);
      const newResult = result * 10 + digit;

      history.push(`${result} × 10 + ${digit} = ${newResult}`);

      steps.push({
        x,
        digit,
        result,
        newX,
        newResult,
        overflow: false,
        explanation: {
          extract: `获取最后一位数字: ${x} % 10 = ${digit}`,
          calculate: `构建反转后的数字: ${result} × 10 + ${digit} = ${newResult}`,
          result: `更新原始数字，去掉最后一位: ${x} ÷ 10 = ${newX}`,
        },
        visualSteps: {
          current: x,
          digit: digit,
          operation: `${result} × 10 + ${digit}`,
          result: newResult,
          history: [...history],
        },
      });

      if (newResult > 214748364 || newResult < -214748364) {
        steps.push({
          x: newX,
          digit,
          result: newResult,
          newX,
          newResult: 0,
          overflow: true,
          explanation: {
            extract: "检测到数字溢出",
            calculate: "结果超出了32位整数的范围",
            result: "根据题目要求，返回0",
          },
          visualSteps: {
            current: newX,
            digit: 0,
            operation: "溢出",
            result: 0,
            history: [],
          },
        });
        return steps;
      }

      x = newX;
      result = newResult;
    }

    return steps;
  };

  const handleStart = () => {
    const num = parseInt(input);
    if (isNaN(num)) return;

    const reversalSteps = reverse(num);
    setSteps(reversalSteps);
    setCurrentStep(0);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(0);
  };

  useEffect(() => {
    if (isRunning && currentStep < steps.length) {
      animationRef.current = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, speed);
    } else if (currentStep >= steps.length) {
      setIsRunning(false);
    }

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, [isRunning, currentStep, steps, speed]);

  return (
    <div className="flex flex-col items-center justify-center  bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        整数反转算法（数学取模）可视化
      </h1>

      {/* 控制面板 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-4xl mb-8">
        <div className="flex items-end gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              输入整数
            </label>
            <Input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-4 py-2 text-lg border-2 border-indigo-300 dark:border-indigo-600 rounded-md"
            />
          </div>
          <div className="w-48">
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              动画速度 (ms)
            </label>
            <Input
              type="number"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              min="500"
              max="3000"
              step="100"
              className="w-full px-4 py-2 text-lg border-2 border-indigo-300 dark:border-indigo-600 rounded-md"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleStart}
              disabled={isRunning}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 h-[42px]"
            >
              重新开始
            </Button>
            <Button
              onClick={isRunning ? handlePause : () => setIsRunning(true)}
              disabled={currentStep >= steps.length}
              className={`px-6 h-[42px] ${
                isRunning ? "bg-orange-500" : "bg-green-500"
              }`}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
            </Button>
            <Button
              onClick={handleReset}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 h-[42px]"
            >
              <RotateCcw size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* 主要动画区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-4xl space-y-8">
        {/* 可视化过程 */}
        <div className="border dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
            反转过程
          </h2>
          {currentStep > 0 && (
            <div className="flex flex-col items-center space-y-8">
              {/* 当前数字和提取数字的可视化 */}
              <div className="w-full">
                <div className="flex items-center justify-center space-x-8 mb-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center space-y-2"
                  >
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      当前数字
                    </span>
                    <div className="bg-blue-100 dark:bg-blue-900 px-6 py-3 rounded-lg text-2xl font-mono">
                      {steps[currentStep - 1].visualSteps.current}
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-2xl text-gray-400"
                  >
                    →
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center space-y-2"
                  >
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      提取最后一位
                    </span>
                    <div className="bg-green-100 dark:bg-green-900 px-6 py-3 rounded-lg text-2xl font-mono">
                      {steps[currentStep - 1].visualSteps.digit}
                    </div>
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-gray-600 dark:text-gray-300 mt-2 bg-gray-50 dark:bg-gray-900/50 p-2 rounded"
                  dangerouslySetInnerHTML={{
                    __html: steps[currentStep - 1].explanation.extract.replace(
                      /([×÷=%]|\d+)/g,
                      '<span class="text-indigo-600 dark:text-indigo-400 font-semibold">$1</span>'
                    ),
                  }}
                />
              </div>

              {/* 计算过程可视化 */}
              <div className="w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center space-y-2 w-full"
                >
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    计算过程
                  </span>
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg w-full max-w-lg">
                    <div className="space-y-2">
                      {steps[currentStep - 1].visualSteps.history.map(
                        (step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`font-mono ${
                              index ===
                              steps[currentStep - 1].visualSteps.history
                                .length -
                                1
                                ? "text-xl text-indigo-600 dark:text-indigo-400 font-bold"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {index ===
                            steps[currentStep - 1].visualSteps.history.length -
                              1
                              ? "→ "
                              : ""}
                            {step}
                          </motion.div>
                        )
                      )}
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-gray-600 dark:text-gray-300 mt-2 bg-gray-50 dark:bg-gray-900/50 p-2 rounded"
                    dangerouslySetInnerHTML={{
                      __html: steps[
                        currentStep - 1
                      ].explanation.calculate.replace(
                        /([×÷=%]|\d+)/g,
                        '<span class="text-indigo-600 dark:text-indigo-400 font-semibold">$1</span>'
                      ),
                    }}
                  />
                </motion.div>
              </div>

              {/* 当前结果可视化 */}
              <div className="w-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center space-y-2"
                >
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    当前结果
                  </span>
                  <div className="bg-purple-100 dark:bg-purple-900 px-6 py-3 rounded-lg text-2xl font-mono">
                    {steps[currentStep - 1].overflow
                      ? "溢出"
                      : steps[currentStep - 1].visualSteps.result}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-gray-600 dark:text-gray-300 mt-2 bg-gray-50 dark:bg-gray-900/50 p-2 rounded"
                    dangerouslySetInnerHTML={{
                      __html: steps[currentStep - 1].explanation.result.replace(
                        /([×÷=%]|\d+)/g,
                        '<span class="text-indigo-600 dark:text-indigo-400 font-semibold">$1</span>'
                      ),
                    }}
                  />
                </motion.div>
              </div>
            </div>
          )}
        </div>

        {/* 最终结果 */}
        {steps.length > 0 && currentStep === steps.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border dark:border-gray-700 rounded-lg p-6 shadow-sm text-center"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
              最终结果
            </h2>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {steps[steps.length - 1].overflow
                ? "0 (溢出)"
                : steps[steps.length - 1].newResult}
            </div>
          </motion.div>
        )}
      </div>

      {/* 进度条 */}
      <div className="mt-8 w-full max-w-4xl">
        <Progress
          value={steps.length > 0 ? (currentStep / steps.length) * 100 : 0}
          className="h-2"
        />
        <div className="text-center mt-2 text-gray-600 dark:text-gray-300">
          步骤：{currentStep} / {steps.length}
        </div>
      </div>
    </div>
  );
}
