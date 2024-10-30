/**
 * Author: Libra
 * Date: 2024-10-01
 * LastEditors: Libra
 * Description: Median of Two Sorted Arrays Animation
 */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const initialArray1 = [1, 2, 3];
const initialArray2 = [6, 8, 9];

export default function MedianOfTwoSortedArraysAnimation() {
  const [array1, setArray1] = useState(initialArray1);
  const [array2, setArray2] = useState(initialArray2);
  const [sortedArray, setSortedArray] = useState<number[]>([]);
  const [median, setMedian] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [description, setDescription] = useState("");
  const [step, setStep] = useState(0);
  const [p1, setP1] = useState(0);
  const [p2, setP2] = useState(0);

  const findMedianSortedArrays = async () => {
    setIsAnimating(true);
    setStep(0);
    setDescription("Start finding the median of two sorted arrays.");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStep((prev) => prev + 1);

    let p1 = 0,
      p2 = 0;
    let sortedArr: number[] = [];
    const len = array1.length + array2.length;

    while (true) {
      if (array1.length === 0) {
        sortedArr = array2;
        break;
      }
      if (array2.length === 0) {
        sortedArr = array1;
        break;
      }
      if (array1[p1] < array2[p2]) {
        sortedArr.push(array1[p1]);
        setDescription(`Add ${array1[p1]} from Array 1 to the sorted array.`);
        setP1(p1);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setStep((prev) => prev + 1);
        p1 < array1.length - 1 ? p1++ : sortedArr.push(...array2.slice(p2));
      } else {
        sortedArr.push(array2[p2]);
        setDescription(`Add ${array2[p2]} from Array 2 to the sorted array.`);
        setP2(p2);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setStep((prev) => prev + 1);
        p2 < array2.length - 1 ? p2++ : sortedArr.push(...array1.slice(p1));
      }
      if (sortedArr.length === len) break;
    }

    setSortedArray(sortedArr);
    setDescription(`Merge and sort the array: [${sortedArr.join(", ")}]`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStep((prev) => prev + 1);

    const mid = Math.floor(sortedArr.length / 2);
    let medianValue;
    if (sortedArr.length % 2 === 0) {
      medianValue = (sortedArr[mid - 1] + sortedArr[mid]) / 2;
      setDescription(
        `The array length is even, the median is: (${sortedArr[mid - 1]} + ${
          sortedArr[mid]
        }) / 2 = ${medianValue}`
      );
    } else {
      medianValue = sortedArr[mid];
      setDescription(`The array length is odd, the median is: ${medianValue}`);
    }
    setMedian(medianValue);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStep((prev) => prev + 1);

    setDescription("Find completed.");
    setIsAnimating(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      <motion.h1
        className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 dark:from-purple-300 dark:via-pink-400 dark:to-red-400"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Median of Two Sorted Arrays Animation
      </motion.h1>
      <div className="space-y-8 mb-8">
        <div className="flex items-center">
          <motion.span
            className="mr-4 font-bold w-20 text-end text-2xl dark:text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Array 1:
          </motion.span>
          <div className="flex">
            {array1.map((num, index) => (
              <motion.div
                key={index}
                className="w-16 h-16 rounded-lg bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-2 border-white dark:border-gray-700 mx-1"
                initial={false}
                animate={{
                  scale: index === p1 ? 1.1 : 1,
                  opacity: isAnimating && index < p1 ? 0.5 : 1,
                  zIndex: index === p1 ? 10 : 1,
                  rotate: index === p1 ? 10 : 0,
                }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 120,
                  damping: 20,
                }}
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                {num}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <motion.span
            className="mr-4 font-bold w-20 text-end text-2xl dark:text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Array 2:
          </motion.span>
          <div className="flex">
            {array2.map((num, index) => (
              <motion.div
                key={index}
                className="w-16 h-16 rounded-lg bg-green-500 dark:bg-green-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-2 border-white dark:border-gray-700 mx-1"
                initial={false}
                animate={{
                  scale: index === p2 ? 1.1 : 1,
                  opacity: isAnimating && index < p2 ? 0.5 : 1,
                  zIndex: index === p2 ? 10 : 1,
                  rotate: index === p2 ? 10 : 0,
                }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 120,
                  damping: 20,
                }}
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                {num}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <motion.span
            className="mr-4 font-bold w-20 text-end text-2xl dark:text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Sorted:
          </motion.span>
          <div className="flex">
            {sortedArray.map((num, index) => (
              <motion.div
                key={index}
                className="w-16 h-16 rounded-lg bg-yellow-500 dark:bg-yellow-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-2 border-white dark:border-gray-700 mx-1"
                initial={false}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 120,
                  damping: 20,
                }}
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                {num}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <motion.span
            className="mr-4 font-bold w-20 text-end text-2xl dark:text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Median:
          </motion.span>
          <motion.div
            className="text-2xl font-bold text-red-500 dark:text-red-400"
            initial={false}
            animate={{ opacity: median !== null ? 1 : 0 }}
          >
            {median}
          </motion.div>
        </div>
      </div>
      <motion.p
        className="text-xl mb-4 text-center max-w-3xl bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100 p-6 rounded-lg shadow-md"
        initial={false}
        animate={{ opacity: description ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <div className="mb-4 dark:text-white">Step: {step}</div>
      <Button
        onClick={findMedianSortedArrays}
        variant="default"
        size="lg"
        disabled={isAnimating}
        className="px-4 py-2 text-white rounded transition-colors duration-300"
      >
        {isAnimating ? "Animating..." : "Start Animation"}
      </Button>
    </div>
  );
}
