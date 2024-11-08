/**
 * Author: Libra
 * Date: 2024-11-08 10:41:26
 * LastEditors: Libra
 * Description: 删除链表倒数第N个节点的动画演示
 */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw } from "lucide-react";

interface ListNode {
  val: number;
  next: ListNode | null;
}

// 定义每一步的类型
type StepType = "init" | "move" | "remove" | "complete";

interface Step {
  type: StepType;
  fastIndex: number;
  slowIndex: number;
  removeIndex?: number;
  description: string;
  detailedSteps: string[];
}

const createLinkedList = (arr: number[]): ListNode | null => {
  if (arr.length === 0) return null;
  const dummy: ListNode = { val: 0, next: null };
  let current: ListNode = dummy;
  for (const num of arr) {
    const newNode: ListNode = { val: num, next: null };
    current.next = newNode;
    current = newNode;
  }
  return dummy.next;
};

export default function RemoveNthFromEndAnimation() {
  const [input, setInput] = useState("1,2,3,4,5");
  const [nInput, setNInput] = useState("2");
  const [list, setList] = useState<ListNode | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1500);
  const [nodeCount, setNodeCount] = useState(0);

  // 生成动画步骤
  const generateSteps = (head: ListNode | null, n: number): Step[] => {
    const steps: Step[] = [];
    if (!head) return steps;

    const dummy: ListNode = { val: 0, next: head };
    let fast = dummy;
    let slow = dummy;
    let count = 0;

    // 初始化步骤
    steps.push({
      type: "init",
      fastIndex: -1,
      slowIndex: -1,
      description: "初始化快慢指针",
      detailedSteps: [
        "创建虚拟头节点(dummy)，用于处理边界情况",
        "快指针(fast)和慢指针(slow)都指向虚拟头节点",
        `准备移动快指针 ${n} 步`,
      ],
    });

    // 快指针先走n步 - 修改这部分，每次移动都记录中间状态
    for (let i = 0; i < n; i++) {
      fast = fast.next!;
      // 记录每一步的移动
      steps.push({
        type: "move",
        fastIndex: i,
        slowIndex: -1,
        description: `快指针前进第 ${i + 1} 步`,
        detailedSteps: [
          `快指针移动到位置 ${i + 1}`,
          `还需要移动 ${n - (i + 1)} 步`,
          "慢指针保持在起始位置",
        ],
      });
    }

    // 快慢指针一起走 - 修改这部分，确保记录每一步的移动
    let slowIndex = -1;
    while (fast.next !== null) {
      fast = fast.next;
      slow = slow.next!;
      slowIndex++;
      count++;
      steps.push({
        type: "move",
        fastIndex: n + count - 1, // 修正 fastIndex 的计算
        slowIndex,
        description: "快慢指针同时移动",
        detailedSteps: [
          "快指针还未到达链表末尾",
          "快慢指针同时向前移动一步",
          `快指针位于位置 ${n + count}`,
          `慢指针位于位置 ${slowIndex + 1}`,
        ],
      });
    }

    // 删除节点
    steps.push({
      type: "remove",
      fastIndex: n + count - 1, // 修正 fastIndex 的计算
      slowIndex: slowIndex,
      removeIndex: slowIndex + 1,
      description: "删除目标节点",
      detailedSteps: [
        "快指针到达链表末尾",
        `慢指针的下一个节点就是要删除的节点`,
        "更新慢指针的next指针，跳过要删除的节点",
        `完成删除倒数第 ${n} 个节点`,
      ],
    });

    // 完成
    steps.push({
      type: "complete",
      fastIndex: n + count - 1, // 修正 fastIndex 的计算
      slowIndex: slowIndex,
      description: "操作完成",
      detailedSteps: ["删除操作完成", "返回新的链表头节点"],
    });

    return steps;
  };

  // 修改初始化 useEffect
  useEffect(() => {
    const nums = input.split(",").filter((n) => n.trim());
    setNodeCount(nums.length);
    const newList = createLinkedList(nums.map((n) => parseInt(n.trim())));
    setList(newList);

    // 在初始化时就生成步骤
    const n = parseInt(nInput);
    if (!isNaN(n) && n >= 1 && n <= nums.length) {
      const initialSteps = generateSteps(newList, n);
      setSteps(initialSteps);
    }
  }, []); // 只在组件挂载时执行一次

  // 修改 handleInputChange 函数
  const handleInputChange = (value: string) => {
    setInput(value);
    try {
      const nums = value.split(",").filter((n) => n.trim());
      const parsedNums = nums.map((n) => parseInt(n.trim()));
      if (parsedNums.some(isNaN)) throw new Error("Invalid number");

      setNodeCount(nums.length);
      const newList = createLinkedList(parsedNums);
      setList(newList);

      // 在输入改变时重新生成步骤
      const n = parseInt(nInput);
      if (!isNaN(n) && n >= 1 && n <= nums.length) {
        const newSteps = generateSteps(newList, n);
        setSteps(newSteps);
      }
      resetAnimation();
    } catch (error) {
      console.error("Invalid input format");
    }
  };

  // 修改 handleNChange 函数
  const handleNChange = (value: string) => {
    setNInput(value);
    const n = parseInt(value);
    if (!isNaN(n) && n >= 1 && n <= nodeCount) {
      const newSteps = generateSteps(list, n);
      setSteps(newSteps);
    }
    resetAnimation();
  };

  // 重置动画
  const resetAnimation = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // 修改开始动画函数
  const startAnimation = () => {
    if (nodeCount === 0) {
      alert("请先输入链表数据");
      return;
    }

    const n = parseInt(nInput);
    if (isNaN(n) || n < 1 || n > nodeCount) {
      alert(`请输入1到${nodeCount}之间的数字`);
      return;
    }

    const newSteps = generateSteps(list, n);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
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

  // 添加手动控制函数
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleNextStep = () => {
    if (steps.length > 0 && currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // 修改动画部分的条件判断，添加类型检查
  const getRemoveIndex = (step: Step, steps: Step[]): number | undefined => {
    if (step.type === "complete" && steps.length >= 2) {
      return steps[steps.length - 2].removeIndex;
    }
    return step.removeIndex;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        删除链表倒数第N个节点演示
      </h1>

      {/* 控制面板 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-4xl mb-8">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              链表（逗号分隔）
            </label>
            <Input
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full px-4 py-2 text-lg border-2 border-indigo-300 dark:border-indigo-600 rounded-md"
              disabled={isPlaying}
            />
          </div>
          <div className="w-18">
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              倒数第N个
            </label>
            <Input
              value={nInput}
              onChange={(e) => handleNChange(e.target.value)}
              className="w-full px-4 py-2 text-lg border-2 border-indigo-300 dark:border-indigo-600 rounded-md"
              type="number"
              min="1"
              max={nodeCount}
              disabled={isPlaying}
            />
          </div>
          <div className="w-18">
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
            重新始
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
          <div className="flex gap-2">
            <Button
              onClick={handlePrevStep}
              disabled={currentStep === 0 || isPlaying}
              className="bg-gray-500 hover:bg-gray-600 text-white h-[42px]"
            >
              上一步
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={
                steps.length === 0 || currentStep >= steps.length || isPlaying
              }
              className="bg-gray-500 hover:bg-gray-600 text-white h-[42px]"
            >
              下一步
            </Button>
          </div>
        </div>
      </div>

      {/* 主要动画区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-4xl space-y-8">
        {/* 链表可视化 */}
        <div className="border dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
            链表可视化
          </h2>
          <div className="flex items-center justify-center space-x-4 mb-4">
            {/* 虚拟头节点 */}
            <motion.div
              className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              dummy
              {/* dummy节点的指针指示器 */}
              <div className="absolute -top-8 left-0 right-0 flex justify-center space-x-1">
                {(currentStep === 0 ||
                  (currentStep > 0 &&
                    steps[currentStep - 1].fastIndex === -1)) && (
                  <motion.div
                    className="text-sm px-2 py-1 rounded bg-green-500 text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    fast
                  </motion.div>
                )}
                {(currentStep === 0 ||
                  (currentStep > 0 &&
                    steps[currentStep - 1].slowIndex === -1)) && (
                  <motion.div
                    className="text-sm px-2 py-1 rounded bg-orange-500 text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    slow
                  </motion.div>
                )}
              </div>
            </motion.div>
            <motion.div
              className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            {/* 实际节点 */}
            {input.split(",").map((val, index) => (
              <React.Fragment key={index}>
                <motion.div
                  className={`relative w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity:
                      currentStep > 0 &&
                      steps[currentStep - 1] &&
                      (() => {
                        const step = steps[currentStep - 1];
                        const removeIdx = getRemoveIndex(step, steps);
                        return (
                          (step.type === "remove" && removeIdx === index) ||
                          (step.type === "complete" && removeIdx === index)
                        );
                      })()
                        ? 0
                        : 1,
                    scale: 1,
                    x:
                      currentStep > 0 && steps[currentStep - 1]
                        ? (() => {
                            const step = steps[currentStep - 1];
                            const removeIdx = getRemoveIndex(step, steps);
                            if (
                              (step.type === "remove" ||
                                step.type === "complete") &&
                              (removeIdx === index ||
                                (step.type === "complete" &&
                                  steps[steps.length - 2]?.removeIndex ===
                                    index))
                            ) {
                              return 20;
                            }
                            if (
                              (step.type === "remove" ||
                                step.type === "complete") &&
                              index > (removeIdx ?? -1)
                            ) {
                              return -120;
                            }
                            return 0;
                          })()
                        : 0,
                    y:
                      currentStep > 0 &&
                      ((steps[currentStep - 1].type === "remove" &&
                        steps[currentStep - 1].removeIndex === index) ||
                        (steps[currentStep - 1].type === "complete" &&
                          steps[steps.length - 2].removeIndex === index))
                        ? -120
                        : 0,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                    delay:
                      currentStep > 0 &&
                      (steps[currentStep - 1].type === "remove" ||
                        steps[currentStep - 1].type === "complete") &&
                      index >
                        (steps[currentStep - 1].type === "complete"
                          ? steps[steps.length - 2]?.removeIndex ?? -1
                          : steps[currentStep - 1].removeIndex ?? -1)
                        ? 0.3
                        : 0,
                  }}
                  style={{
                    backgroundColor:
                      currentStep > 0 &&
                      ((steps[currentStep - 1].type === "remove" &&
                        steps[currentStep - 1].removeIndex === index) ||
                        (steps[currentStep - 1].type === "complete" &&
                          steps[steps.length - 2].removeIndex === index))
                        ? "#EF4444"
                        : "#3B82F6",
                  }}
                >
                  {val}
                  {/* 快慢指针指示器 */}
                  <div className="absolute -top-8 left-0 right-0 flex justify-center space-x-1">
                    {/* fast 指针 */}
                    <motion.div
                      className="text-sm px-2 py-1 rounded bg-green-500 text-white"
                      initial={false}
                      animate={{
                        opacity:
                          currentStep > 0 &&
                          steps[currentStep - 1].fastIndex === index
                            ? 1
                            : 0,
                        y: 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      fast
                    </motion.div>
                    {/* slow 指针 */}
                    <motion.div
                      className="text-sm px-2 py-1 rounded bg-orange-500 text-white"
                      initial={false}
                      animate={{
                        opacity:
                          currentStep > 0 &&
                          steps[currentStep - 1].slowIndex === index
                            ? 1
                            : 0,
                        y: 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      slow
                    </motion.div>
                  </div>
                </motion.div>
                {/* 连接线 */}
                {index < input.split(",").length - 1 && (
                  <motion.div
                    className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity:
                        currentStep > 0 && steps[currentStep - 1]
                          ? (() => {
                              const step = steps[currentStep - 1];
                              const removeIdx = getRemoveIndex(step, steps);
                              return (step.type === "remove" ||
                                step.type === "complete") &&
                                (index === removeIdx ||
                                  index === (removeIdx ?? 0) - 1)
                                ? 1
                                : 1;
                            })()
                          : 1,
                      x:
                        currentStep > 0 && steps[currentStep - 1]
                          ? (() => {
                              const step = steps[currentStep - 1];
                              const removeIdx = getRemoveIndex(step, steps);
                              return (step.type === "remove" ||
                                step.type === "complete") &&
                                index >= (removeIdx ?? 0)
                                ? -120
                                : 0;
                            })()
                          : 0,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                      delay: 0.3,
                    }}
                  />
                )}
              </React.Fragment>
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
