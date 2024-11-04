/**
 * Author: Libra
 * Date: 2024-11-01 15:41:40
 * LastEditors: Libra
 * Description:
 */
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";

type DPState = {
  dp: boolean[][];
  i: number;
  j: number;
  explanation: string;
  detailedExplanation: string[];
  matchType: "init" | "char" | "dot" | "star" | "nomatch";
  prevState?: boolean;
};

const isMatch = (s: string, p: string): DPState[] => {
  const m = s.length;
  const n = p.length;
  const dp: boolean[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(false)
  );
  const states: DPState[] = [];

  dp[0][0] = true;
  states.push({
    dp: JSON.parse(JSON.stringify(dp)),
    i: 0,
    j: 0,
    explanation: "空字符串匹配空模式",
    detailedExplanation: [
      "当字符串和模式都为空时，它们是匹配的",
      "dp[0][0] = true 表示空字符串匹配空模式",
    ],
    matchType: "init",
  });

  for (let j = 2; j <= n; j++) {
    if (p[j - 1] === "*") {
      dp[0][j] = dp[0][j - 2];
      states.push({
        dp: JSON.parse(JSON.stringify(dp)),
        i: 0,
        j,
        explanation: `处理模式中的 ${p[j - 2]}* 组合`,
        detailedExplanation: [
          `当前处理模式中的 ${p[j - 2]}* 组合`,
          `* 可以匹配零个前面的字符，所以检查忽略这两个字符后的状态`,
          `dp[0][${j}] = dp[0][${j - 2}] = ${dp[0][j - 2]}`,
        ],
        matchType: "star",
        prevState: dp[0][j - 2],
      });
    }
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const currentChar = s[i - 1];
      const patternChar = p[j - 1];

      if (patternChar === "." || patternChar === currentChar) {
        dp[i][j] = dp[i - 1][j - 1];
        states.push({
          dp: JSON.parse(JSON.stringify(dp)),
          i,
          j,
          explanation:
            patternChar === "."
              ? `通配符 . 匹配任意字符 '${currentChar}'`
              : `字符 '${currentChar}' 直接匹配`,
          detailedExplanation: [
            `当前比较：字符串位置 ${i} 的 '${currentChar}' 与模式位置 ${j} 的 '${patternChar}'`,
            patternChar === "."
              ? `通配符 . 可以匹配任意单个字符`
              : `字符相同，可以直接匹配`,
            `检查前一个状态：dp[${i - 1}][${j - 1}] = ${dp[i - 1][j - 1]}`,
            `更新当前状态：dp[${i}][${j}] = ${dp[i][j]}`,
          ],
          matchType: patternChar === "." ? "dot" : "char",
          prevState: dp[i - 1][j - 1],
        });
      } else if (patternChar === "*") {
        dp[i][j] = dp[i][j - 2];
        const initialState = dp[i][j];

        states.push({
          dp: JSON.parse(JSON.stringify(dp)),
          i,
          j,
          explanation: `处理 * 的零次匹配情况`,
          detailedExplanation: [
            `当前处理：模式位置 ${j} 的 * 与前一个字符 '${p[j - 2]}'`,
            `首先尝试零次匹配（完全忽略 ${p[j - 2]}*）`,
            `检查前一个状态：dp[${i}][${j - 2}] = ${dp[i][j - 2]}`,
            `更新当前状态：dp[${i}][${j}] = ${dp[i][j]}`,
          ],
          matchType: "star",
          prevState: dp[i][j - 2],
        });

        if (p[j - 2] === "." || p[j - 2] === currentChar) {
          dp[i][j] = dp[i][j] || dp[i - 1][j];
          if (dp[i][j] !== initialState) {
            states.push({
              dp: JSON.parse(JSON.stringify(dp)),
              i,
              j,
              explanation: `${p[j - 2]}* 匹配一个或多个字符`,
              detailedExplanation: [
                `${
                  p[j - 2] === "." ? "通配符" : `字符 '${p[j - 2]}'`
                } 可以匹配当前字符 '${currentChar}'`,
                `检查是否可以继续匹配更多字符`,
                `检查前一个状态：dp[${i - 1}][${j}] = ${dp[i - 1][j]}`,
                `更新当前状态：dp[${i}][${j}] = ${dp[i][j]}`,
              ],
              matchType: "star",
              prevState: dp[i - 1][j],
            });
          }
        }
      } else {
        states.push({
          dp: JSON.parse(JSON.stringify(dp)),
          i,
          j,
          explanation: `字符 '${currentChar}' 与 '${patternChar}' 不匹配`,
          detailedExplanation: [
            `当前比较：字符串位置 ${i} 的 '${currentChar}' 与模式位置 ${j} 的 '${patternChar}'`,
            `字符不同，无法匹配`,
            `更新当前状态：dp[${i}][${j}] = false`,
          ],
          matchType: "nomatch",
          prevState: false,
        });
      }
    }
  }

  return states;
};

export default function RegexMatchingAnimation() {
  const [s, setS] = useState("aa");
  const [p, setP] = useState("a*");
  const [speed, setSpeed] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [states, setStates] = useState<DPState[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setStates(isMatch(s, p));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [s, p]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < states.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, 1000 / speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, states.length]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (currentStep < states.length - 1) setCurrentStep(currentStep + 1);
  };

  const handleStepBackward = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        正则表达式匹配动画演示
      </h1>

      {/* 控制面板 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-4xl mb-8">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              字符串 (s)
            </label>
            <Input
              value={s}
              onChange={(e) => setS(e.target.value)}
              placeholder="Enter string"
              className="w-full px-4 py-2 text-lg border-2 border-indigo-300 dark:border-indigo-600 rounded-md"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              模式 (p)
            </label>
            <Input
              value={p}
              onChange={(e) => setP(e.target.value)}
              placeholder="Enter pattern"
              className="w-full px-4 py-2 text-lg border-2 border-indigo-300 dark:border-indigo-600 rounded-md"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              动画速度 (ms)
            </label>
            <Input
              type="number"
              value={1000 / speed}
              onChange={(e) => setSpeed(1000 / Number(e.target.value))}
              min="200"
              max="2000"
              step="100"
              className="w-full px-4 py-2 text-lg border-2 border-indigo-300 dark:border-indigo-600 rounded-md"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            onClick={handleStepBackward}
            disabled={currentStep === 0}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            上一步
          </Button>
          <Button
            onClick={handlePlayPause}
            className={`${
              isPlaying ? "bg-orange-500" : "bg-green-500"
            } text-white`}
          >
            {isPlaying ? "暂停" : "播放"}
          </Button>
          <Button
            onClick={handleStepForward}
            disabled={currentStep === states.length - 1}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            下一步
          </Button>
          <Button
            onClick={handleReset}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            重置
          </Button>
        </div>
      </div>

      {states.length > 0 && (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 当前状态显示 */}
          <motion.div
            className="mb-6 grid grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* 左侧：当前输入状态 */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-200">
                输入状态
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    字符串:
                  </span>
                  <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-blue-700 dark:text-blue-300">
                    &quot;{s}&quot;
                  </code>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    模式:
                  </span>
                  <code className="bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded text-purple-700 dark:text-purple-300">
                    &quot;{p}&quot;
                  </code>
                </div>
              </div>
            </div>

            {/* 右侧：当前处理位置 */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-200">
                当前位置
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    字符串位置 (i):
                  </span>
                  <code className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded text-green-700 dark:text-green-300">
                    {states[currentStep].i}
                  </code>
                  {states[currentStep].i > 0 && (
                    <span className="text-gray-500 dark:text-gray-400">
                      (当前字符: {s[states[currentStep].i - 1]})
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    模式位置 (j):
                  </span>
                  <code className="bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded text-orange-700 dark:text-orange-300">
                    {states[currentStep].j}
                  </code>
                  {states[currentStep].j > 0 && (
                    <span className="text-gray-500 dark:text-gray-400">
                      (当前字符: {p[states[currentStep].j - 1]})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* DP 表格 */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-800"></th>
                  <th className="border border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                    ε
                  </th>
                  {p.split("").map((char, index) => (
                    <th
                      key={index}
                      className={`border border-gray-300 dark:border-gray-600 p-2 text-gray-700 dark:text-gray-200 ${
                        index + 1 === states[currentStep].j
                          ? "bg-blue-200 dark:bg-blue-800"
                          : "bg-gray-50 dark:bg-gray-800"
                      }`}
                    >
                      {char}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="border border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                    ε
                  </th>
                  {states[currentStep]?.dp[0]?.map((cell, j) => (
                    <td
                      key={j}
                      className={`border border-gray-300 dark:border-gray-600 p-2 text-center ${
                        0 === states[currentStep].i &&
                        j === states[currentStep].j
                          ? "bg-yellow-200 dark:bg-yellow-800 text-gray-800 dark:text-gray-200"
                          : cell
                          ? "bg-green-200 dark:bg-green-800 text-gray-800 dark:text-gray-200"
                          : "bg-red-200 dark:bg-red-900 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {cell ? "T" : "F"}
                    </td>
                  ))}
                </tr>
                {s.split("").map((char, i) => (
                  <tr key={i}>
                    <th
                      className={`border border-gray-300 dark:border-gray-600 p-2 text-gray-700 dark:text-gray-200 ${
                        i + 1 === states[currentStep].i
                          ? "bg-blue-200 dark:bg-blue-800"
                          : "bg-gray-50 dark:bg-gray-800"
                      }`}
                    >
                      {char}
                    </th>
                    {states[currentStep]?.dp[i + 1]?.map((cell, j) => (
                      <td
                        key={j}
                        className={`border border-gray-300 dark:border-gray-600 p-2 text-center ${
                          i + 1 === states[currentStep].i &&
                          j === states[currentStep].j
                            ? "bg-yellow-200 dark:bg-yellow-800 text-gray-800 dark:text-gray-200"
                            : cell
                            ? "bg-green-200 dark:bg-green-800 text-gray-800 dark:text-gray-200"
                            : "bg-red-200 dark:bg-red-900 text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {cell ? "T" : "F"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 详细解释部分 */}
          <motion.div
            className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
              步骤说明 ({currentStep + 1} / {states.length})
            </h3>
            <div className="space-y-4">
              {/* 主要说明 */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="text-lg font-medium text-blue-800 dark:text-blue-200">
                  {states[currentStep].explanation}
                </p>
              </div>

              {/* 详细步骤说明 */}
              <div className="space-y-2">
                {states[currentStep].detailedExplanation.map(
                  (detail, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <span className="text-blue-500 dark:text-blue-400 mt-1">
                        •
                      </span>
                      <p
                        className="text-gray-600 dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: detail }}
                      />
                    </motion.div>
                  )
                )}
              </div>

              {/* 算法说明 */}
              {states[currentStep].matchType === "star" && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg space-y-2">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    * 的处理逻辑：
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    •{" "}
                    <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">
                      *
                    </code>{" "}
                    可以匹配
                    <span className="font-semibold">零个</span>前面的元素：
                    <br />
                    &nbsp;&nbsp;→ 直接跳过前面的字符和*，即{" "}
                    <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">
                      dp[i][j] = dp[i][j-2]
                    </code>
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    •{" "}
                    <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">
                      *
                    </code>{" "}
                    可以匹配
                    <span className="font-semibold">一个或多个</span>
                    前面的元素：
                    <br />
                    &nbsp;&nbsp;→
                    当前字符需要与*前面的字符匹配，并检查之前的状态：
                    <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">
                      dp[i][j] = dp[i-1][j]
                    </code>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
