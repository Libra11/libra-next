/**
 * Author: Libra
 * Date: 2024-10-29 16:36:10
 * LastEditors: Libra
 * Description:
 */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Pause, Play, RotateCcw } from "lucide-react";

const findMedianSortedArrays = (nums1: number[], nums2: number[]) => {
  const merged = [];
  let i = 0,
    j = 0;

  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] <= nums2[j]) {
      merged.push(nums1[i]);
      i++;
    } else {
      merged.push(nums2[j]);
      j++;
    }
  }

  while (i < nums1.length) {
    merged.push(nums1[i]);
    i++;
  }
  while (j < nums2.length) {
    merged.push(nums2[j]);
    j++;
  }

  const len = merged.length;
  if (len % 2 === 0) {
    return (merged[len / 2 - 1] + merged[len / 2]) / 2;
  } else {
    return merged[Math.floor(len / 2)];
  }
};

export default function DetailedMedianSortedArrays() {
  // 修改状态定义
  const [nums1, setNums1] = useState([1, 3, 5]);
  const [nums2, setNums2] = useState([2, 4, 6, 8]);
  const [merged, setMerged] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [median, setMedian] = useState<number | null>(null);
  const [explanation, setExplanation] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [input1, setInput1] = useState("1,3,5");
  const [input2, setInput2] = useState("2,4,6,8");

  const totalSteps = nums1.length + nums2.length + 1;

  // 添加重置函数
  const resetAnimation = () => {
    setMerged([]);
    setStep(0);
    setI(0);
    setJ(0);
    setMedian(null);
    setExplanation("");
    setIsPlaying(true);
  };

  // 添加数组更新处理函数
  const handleArrayUpdate = () => {
    const parseArray = (input: string) => {
      return input
        .split(",")
        .map((num) => Number(num.trim()))
        .filter((num) => !isNaN(num))
        .sort((a, b) => a - b);
    };

    setNums1(parseArray(input1));
    setNums2(parseArray(input2));
    resetAnimation();
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isPlaying) {
      timer = setTimeout(() => {
        if (i < nums1.length && j < nums2.length) {
          if (nums1[i] <= nums2[j]) {
            setMerged((prev) => [...prev, nums1[i]]);
            setI((prev) => prev + 1);
            setExplanation(
              `比较 <code>nums1[${i}] (${nums1[i]})</code> 和 <code>nums2[${j}] (${nums2[j]})</code>. 选择较小的 <code>${nums1[i]}</code> 并添加到合并数组中。指针 <code>i</code> 向右移动。`
            );
          } else {
            setMerged((prev) => [...prev, nums2[j]]);
            setJ((prev) => prev + 1);
            setExplanation(
              `比较 <code>nums1[${i}] (${nums1[i]})</code> 和 <code>nums2[${j}] (${nums2[j]})</code>. 选择较小的 <code>${nums2[j]}</code> 并添加到合并数组中。指针 <code>j</code> 向右移动。`
            );
          }
        } else if (i < nums1.length) {
          setMerged((prev) => [...prev, nums1[i]]);
          setI((prev) => prev + 1);
          setExplanation(
            `<code>nums2</code> 已经遍历完毕，直接将 <code>nums1[${i}] (${nums1[i]})</code> 添加到合并数组中。指针 <code>i</code> 向右移动。`
          );
        } else if (j < nums2.length) {
          setMerged((prev) => [...prev, nums2[j]]);
          setJ((prev) => prev + 1);
          setExplanation(
            `<code>nums1</code> 已经遍历完毕，直接将 <code>nums2[${j}] (${nums2[j]})</code> 添加到合并数组中。指针 <code>j</code> 向右移动。`
          );
        } else if (median === null) {
          const result = findMedianSortedArrays(nums1, nums2);
          setMedian(result);
          setExplanation(
            `合并完成。计算中位数：${
              merged.length % 2 === 0
                ? `<code>(${merged[merged.length / 2 - 1]} + ${
                    merged[merged.length / 2]
                  }) / 2 = ${result}</code>`
                : `选择中间的数 <code>${result}</code>`
            }`
          );
        }
        setStep((prev) => prev + 1);
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [i, j, nums1, nums2, median, merged, isPlaying]);

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        寻找两个有序数组的中位数
      </h1>

      {/* 添加数组输入和控制按钮部分 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-4xl mb-8">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              数组 1 (用逗号分隔)
            </label>
            <input
              type="text"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
              className="w-full px-4 py-2 text-lg border-2 border-indigo-300 dark:border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              数组 2 (用逗号分隔)
            </label>
            <input
              type="text"
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
              className="w-full px-4 py-2 text-lg border-2 border-indigo-300 dark:border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleArrayUpdate}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 flex items-center gap-2"
          >
            更新数组
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-3 rounded-lg ${
              isPlaying ? "bg-orange-500" : "bg-green-500"
            } text-white hover:bg-opacity-90`}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button
            onClick={resetAnimation}
            className="p-3 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </div>

      {/* 原有的可视化部分 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-4xl space-y-8">
        {/* 输入数组部分 */}
        <div className="grid grid-cols-2 gap-8">
          <div className="border dark:border-gray-700 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
              数组 1
            </h2>
            <div className="flex relative pt-12">
              {nums1.map((num, index) => (
                <motion.div
                  key={`nums1-${index}`}
                  className={`w-12 h-12 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-md m-1 ${
                    index < i
                      ? "bg-green-200 dark:bg-green-900"
                      : "bg-white dark:bg-gray-700"
                  } dark:text-white`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {num}
                </motion.div>
              ))}
              <motion.div
                className="absolute -top-2 left-0 flex flex-col items-center"
                initial={{ x: 0 }}
                animate={{ x: i * 54 + 18 }} // 52 = 48 (w-12) + 4 (m-1 * 2)
                transition={{ duration: 0.5 }}
              >
                <span className="text-blue-500 dark:text-blue-400 font-bold mb-1">
                  i
                </span>
                <ArrowDown
                  className="text-blue-500 dark:text-blue-400"
                  size={24}
                />
              </motion.div>
            </div>
          </div>
          <div className="border dark:border-gray-700 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
              数组 2
            </h2>
            <div className="flex relative pt-12">
              {nums2.map((num, index) => (
                <motion.div
                  key={`nums2-${index}`}
                  className={`w-12 h-12 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-md m-1 ${
                    index < j
                      ? "bg-green-200 dark:bg-green-900"
                      : "bg-white dark:bg-gray-700"
                  } dark:text-white`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {num}
                </motion.div>
              ))}
              <motion.div
                className="absolute -top-2 left-0 flex flex-col items-center"
                initial={{ x: 0 }}
                animate={{ x: j * 54 + 18 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-red-500 dark:text-red-400 font-bold mb-1">
                  j
                </span>
                <ArrowDown
                  className="text-red-500 dark:text-red-400"
                  size={24}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* 合并数组部分 */}
        <div className="border dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
            合并后的数组
          </h2>
          <div className="flex flex-wrap">
            <AnimatePresence>
              {merged.map((num, index) => (
                <motion.div
                  key={`merged-${index}`}
                  className="w-12 h-12 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-md m-1 bg-blue-200 dark:bg-blue-900 dark:text-white"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {num}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* 中位数部分 */}
        <div className="border dark:border-gray-700 rounded-lg p-6 shadow-sm text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
            中位数
          </h2>
          <motion.div
            className="text-3xl font-bold text-blue-600 dark:text-blue-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: median !== null ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {median !== null ? median : "-"}
          </motion.div>
        </div>

        {/* 步骤说明部分 */}
        <div className="border dark:border-gray-700 rounded-lg p-6 shadow-sm bg-gray-50 dark:bg-gray-900">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
            步骤说明
          </h3>
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-gray-600 dark:text-gray-300"
            dangerouslySetInnerHTML={{
              __html: explanation.replace(
                /<code>(.*?)<\/code>/g,
                '<span class="bg-yellow-200 dark:bg-yellow-900 text-gray-800 dark:text-gray-200 px-1 rounded">$1</span>'
              ),
            }}
          />
        </div>
      </div>

      {/* 步骤进度 */}
      <div className="mt-8 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-600 dark:text-gray-300">
        步骤: {step} / {totalSteps}
      </div>
    </div>
  );
}
