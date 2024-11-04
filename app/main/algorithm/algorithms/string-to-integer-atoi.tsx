/**
 * Author: Libra
 * Date: 2024-10-31 15:11:01
 * LastEditors: Libra
 * Description:
 */
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

// Add interface for Automaton class properties
interface AutomatonState {
  state: string;
  sign: number;
  result: number;
  INT_MAX: number;
  INT_MIN: number;
}

class Automaton implements AutomatonState {
  state: string;
  sign: number;
  result: number;
  INT_MAX: number;
  INT_MIN: number;

  constructor() {
    this.state = "start";
    this.sign = 1;
    this.result = 0;
    this.INT_MAX = Math.pow(2, 31) - 1;
    this.INT_MIN = -Math.pow(2, 31);
  }

  getCharType(char: string): string {
    if (char === " ") return "space";
    if (char === "+" || char === "-") return "sign";
    if (char >= "0" && char <= "9") return "digit";
    return "other";
  }

  transition(char: string): void {
    const charType = this.getCharType(char);
    switch (this.state) {
      case "start":
        if (charType === "space") {
          // Continue in start state
        } else if (charType === "sign") {
          this.sign = char === "-" ? -1 : 1;
          this.state = "signed";
        } else if (charType === "digit") {
          this.result = parseInt(char, 10);
          this.state = "in_number";
        } else {
          this.state = "end";
        }
        break;
      case "signed":
        if (charType === "digit") {
          this.result = parseInt(char, 10);
          this.state = "in_number";
        } else {
          this.state = "end";
        }
        break;
      case "in_number":
        if (charType === "digit") {
          const digit = parseInt(char, 10);
          if (
            this.result > Math.floor(this.INT_MAX / 10) ||
            (this.result === Math.floor(this.INT_MAX / 10) &&
              digit > this.INT_MAX % 10)
          ) {
            this.result = this.sign === 1 ? this.INT_MAX : this.INT_MIN;
            this.state = "end";
          } else {
            this.result = this.result * 10 + digit;
          }
        } else {
          this.state = "end";
        }
        break;
      case "end":
        // Do nothing in end state
        break;
    }
  }

  getResult(): number {
    return this.sign * this.result;
  }
}

export default function AtoiVisualizer() {
  const [input, setInput] = useState("   -42");
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [automaton, setAutomaton] = useState(new Automaton());
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [stepDescription, setStepDescription] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [previousState, setPreviousState] = useState("start");

  const resetAutomaton = () => {
    setCurrentIndex(-1);
    setAutomaton(new Automaton());
    setStepDescription("");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsPlaying(false);
  };

  const processNextChar = () => {
    if (currentIndex < input.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setPreviousState(automaton.state);
      const newAutomaton = new Automaton();
      for (let i = 0; i <= nextIndex; i++) {
        newAutomaton.transition(input[i]);
      }
      setAutomaton(newAutomaton);
      setStepDescription(getStepDescription(newAutomaton, input[nextIndex]));
    } else {
      setIsPlaying(false);
      setStepDescription("处理完成");
    }
  };

  const getStepDescription = (automaton: Automaton, char: string): string => {
    const charType = automaton.getCharType(char);
    switch (automaton.state) {
      case "start":
        if (charType === "space") return `跳过空格 '${char}'`;
        if (charType === "sign") return `检测到符号 '${char}'`;
        if (charType === "digit") return `检测到数字 '${char}'，开始构建数值`;
        return `检测到非法字符 '${char}'，停止处理`;
      case "signed":
        if (charType === "digit") return `检测到数字 '${char}'，开始构建数值`;
        return `检测到非法字符 '${char}'，停止处理`;
      case "in_number":
        if (charType === "digit") return `继续构建数值，添加数字 '${char}'`;
        return `检测到非数字字符 '${char}'，停止处理`;
      case "end":
        return "处理结束";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (isPlaying) {
      timeoutRef.current = setTimeout(processNextChar, animationSpeed);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPlaying, currentIndex, input, animationSpeed]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        字符串转整数 (atoi) 可视化演示(自动机)
      </h1>

      {/* 控制面板 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-[90%] mb-8">
        <div className="flex space-x-4 items-end">
          <div className="flex-grow">
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              输入字符串
            </label>
            <Input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                resetAutomaton();
              }}
              placeholder="输入一个字符串..."
              className="w-full px-4 py-2 text-lg border-2 border-indigo-300 dark:border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="w-48">
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              动画速度 (ms)
            </label>
            <Input
              type="number"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              min="100"
              max="2000"
              step="100"
              className="w-full px-4 py-2 text-lg border-2 border-indigo-300 dark:border-indigo-600 rounded-md"
            />
          </div>
          <Button
            onClick={resetAutomaton}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 h-[42px]"
          >
            重置
          </Button>
          <Button
            onClick={togglePlay}
            className={`px-6 h-[42px] ${
              isPlaying ? "bg-orange-500" : "bg-green-500"
            }`}
          >
            {isPlaying ? "暂停" : "自动播放"}
          </Button>
        </div>
      </div>

      {/* 主要内容区域 - 改为左右布局 */}
      <div className="flex gap-8 w-full max-w-[90%]">
        {/* 左侧状态转换表 */}
        <div className="w-[40%]">
          <Card className="border dark:border-gray-700 sticky top-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                状态转换表
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>当前状态</TableHead>
                      <TableHead>输入类型</TableHead>
                      <TableHead>转移到的下一个状态</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        currentState: "start",
                        inputType: "space",
                        nextState: "start",
                        action: "忽略空格",
                      },
                      {
                        currentState: "start",
                        inputType: "sign",
                        nextState: "signed",
                        action: "记录符号",
                      },
                      {
                        currentState: "start",
                        inputType: "digit",
                        nextState: "in_number",
                        action: "开始记录数字",
                      },
                      {
                        currentState: "start",
                        inputType: "other",
                        nextState: "end",
                        action: "结束解析",
                      },
                      {
                        currentState: "signed",
                        inputType: "digit",
                        nextState: "in_number",
                        action: "开始记录数字",
                      },
                      {
                        currentState: "signed",
                        inputType: "other",
                        nextState: "end",
                        action: "结束解析",
                      },
                      {
                        currentState: "in_number",
                        inputType: "digit",
                        nextState: "in_number",
                        action: "继续记录数字并检查溢出",
                      },
                      {
                        currentState: "in_number",
                        inputType: "other",
                        nextState: "end",
                        action: "结束解析",
                      },
                      {
                        currentState: "end",
                        inputType: "任意",
                        nextState: "end",
                        action: "保持结束状态，忽略后续字符",
                      },
                    ].map((row, index) => {
                      return (
                        <TableRow
                          key={index}
                          className={
                            automaton.state === row.nextState &&
                            row.currentState === previousState
                              ? "!bg-blue-900 text-white"
                              : ""
                          }
                        >
                          <TableCell>{row.currentState}</TableCell>
                          <TableCell>{row.inputType}</TableCell>
                          <TableCell>{row.nextState}</TableCell>
                          <TableCell>{row.action}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          {/* 进度条 */}
          <div className="mt-8 w-full">
            <Progress
              value={((currentIndex + 1) / input.length) * 100}
              className="h-2"
            />
            <div className="text-center mt-2 text-gray-600 dark:text-gray-300">
              步骤：{currentIndex + 1} / {input.length}
            </div>
          </div>
        </div>

        {/* 右侧动画和状态显示 */}
        <div className="flex-1 space-y-8">
          {/* 输入字符串可视化 */}
          <Card className="border dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                输入字符串
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center space-x-2 font-mono text-2xl">
                {input.split("").map((char, index) => (
                  <motion.span
                    key={index}
                    className={`w-12 h-12 flex items-center justify-center rounded-lg ${
                      index <= currentIndex
                        ? "bg-green-500 dark:bg-green-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                    initial={{ opacity: 0.3 }}
                    animate={{
                      opacity: index <= currentIndex ? 1 : 0.3,
                      scale: index === currentIndex ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {char === " " ? "␣" : char}
                  </motion.span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 自动机状态 */}
          <Card className="border dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                自动状态
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="grid grid-cols-3 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    状态
                  </div>
                  <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {automaton.state}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    符号
                  </div>
                  <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {automaton.sign}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    结果
                  </div>
                  <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {automaton.result}
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>

          {/* 步骤说明 */}
          <Card className="border dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                步骤说明
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div
                  key={stepDescription}
                  className="text-lg bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-gray-700 dark:text-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {stepDescription}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
