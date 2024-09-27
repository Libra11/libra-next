/**
 * Author: Libra
 * Date: 2024-09-23 16:42:11
 * LastEditors: Libra
 * Description:
 */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

interface ListNode {
  val: number;
  next: ListNode | null;
}

const createLinkedList = (arr: number[]): ListNode | null => {
  if (arr.length === 0) return null;
  const head: ListNode = { val: arr[0], next: null };
  let current = head;
  for (let i = 1; i < arr.length; i++) {
    current.next = { val: arr[i], next: null };
    current = current.next;
  }
  return head;
};

const initialList1 = [2, 4, 6];
const initialList2 = [5, 6, 4];

export default function AddTwoNumbersDetailedAnimation() {
  const [list1, setList1] = useState<ListNode | null>(
    createLinkedList(initialList1)
  );
  const [list2, setList2] = useState<ListNode | null>(
    createLinkedList(initialList2)
  );
  const [head, setHead] = useState<ListNode | null>(null);
  const [cur, setCur] = useState<ListNode | null>(null);
  const [currentNode1, setCurrentNode1] = useState<ListNode | null>(null);
  const [currentNode2, setCurrentNode2] = useState<ListNode | null>(null);
  const [currentSum, setCurrentSum] = useState<number | null>(null);
  const [carry, setCarry] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [description, setDescription] = useState("");
  const [step, setStep] = useState(0);
  const [maxLength, setMaxLength] = useState(0);
  const [activeNode1, setActiveNode1] = useState<ListNode | null>(null);
  const [activeNode2, setActiveNode2] = useState<ListNode | null>(null);

  useEffect(() => {
    setMaxLength(Math.max(initialList1.length, initialList2.length) + 2);
  }, []);

  const addTwoNumbers = async () => {
    setIsAnimating(true);
    setStep(0);
    let l1 = list1;
    let l2 = list2;
    let dummyHead: ListNode = { val: 0, next: null };
    let carry = 0;
    let cur = dummyHead;

    setHead(dummyHead);
    setCur(cur);
    setDescription("Initialize dummy head node and cur pointer.");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStep((prev) => prev + 1);

    while (l1 || l2) {
      let sum = 0;
      setCurrentNode1(l1);
      setCurrentNode2(l2);

      if (l1) {
        setActiveNode1(l1);
        sum += l1.val;
        setDescription(`Add ${l1.val} to sum from List1`);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        l1 = l1.next;
      }

      if (l2) {
        setActiveNode2(l2);
        sum += l2.val;
        setDescription(`Add ${l2.val} to sum from List2`);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        l2 = l2.next;
      }

      sum += carry;
      setDescription(`Add carry ${carry} to sum, sum is now ${sum}`);
      await new Promise((resolve) => setTimeout(resolve, 3000));

      carry = Math.floor(sum / 10);
      setCarry(carry);
      setDescription(`New carry is ${carry}`);
      await new Promise((resolve) => setTimeout(resolve, 3000));

      cur.next = { val: sum % 10, next: null };
      setCurrentSum(sum % 10);
      setDescription(`Create new node, value is ${sum % 10}`);
      await new Promise((resolve) => setTimeout(resolve, 3000));

      cur = cur.next;
      setCur(cur);
      setDescription("Move cur pointer to next node.");
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setHead({ ...dummyHead });
      setStep((prev) => prev + 1);
      setActiveNode1(null);
      setActiveNode2(null);
    }

    if (carry > 0) {
      cur.next = { val: carry, next: null };
      setCurrentSum(carry);
      setDescription(
        `Final carry ${carry} is added as a new node at the end of the list.`
      );
      cur = cur.next;
      setCur(cur);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setHead({ ...dummyHead });
      setStep((prev) => prev + 1);
    }

    setCurrentNode1(null);
    setCurrentNode2(null);
    setCurrentSum(null);
    setCarry(0);
    setDescription("Addition is complete.");
    setIsAnimating(false);
  };

  const renderLinkedList = (
    head: ListNode | null,
    isHead: boolean = false,
    activeNode: ListNode | null = null
  ) => {
    const nodes: ListNode[] = [];
    let current = head;
    while (current) {
      nodes.push(current);
      current = current.next;
    }

    return (
      <div className="flex items-center space-x-4">
        {Array(maxLength)
          .fill(null)
          .map((_, index) => {
            const node = nodes[index];
            return (
              <div key={index} className="w-16">
                {node && (
                  <motion.div
                    className={`w-16 h-16 border-2 border-white rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg ${
                      isHead
                        ? node === cur
                          ? "bg-orange-500"
                          : "bg-green-500"
                        : node === activeNode
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                    initial={isHead ? { opacity: 0, scale: 0 } : false}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {node.val}
                  </motion.div>
                )}
              </div>
            );
          })}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      <motion.h1
        className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Add Two Numbers Detailed Animation
      </motion.h1>
      <div className="space-y-8 mb-8 w-full max-w-3xl">
        <div className="flex items-center justify-center">
          <motion.span
            className="font-bold text-xl mr-4 w-20 text-right"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            List 1:
          </motion.span>
          {renderLinkedList(list1, false, activeNode1)}
        </div>
        <div className="flex items-center justify-center">
          <motion.span
            className="font-bold text-xl mr-4 w-20 text-right"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            List 2:
          </motion.span>
          {renderLinkedList(list2, false, activeNode2)}
        </div>
        <div className="flex items-center justify-center mr-[160px]">
          <motion.span
            className="font-bold text-xl mr-4 w-20 text-right"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Head:
          </motion.span>
          {renderLinkedList(head, true)}
        </div>
        <AnimatePresence>
          {cur && (
            <motion.div
              className="flex items-center justify-center mr-[160px]"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                className="font-bold text-2xl mr-4 w-20 text-right"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              ></motion.span>
              <div className="flex items-center space-x-4">
                {Array(maxLength)
                  .fill(null)
                  .map((_, index) => {
                    let current = head;
                    for (let i = 0; i < index; i++) {
                      if (current) current = current.next;
                    }
                    return (
                      <div key={index} className="w-16 flex justify-center">
                        {current === cur && (
                          <div className="flex items-center flex-col justify-center space-x-2">
                            <ArrowUp
                              className="text-orange-500 font-bold"
                              size={32}
                            />
                            <span className="text-orange-500 font-bold">
                              Cur
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.div
        className="text-2xl font-bold mb-4"
        initial={false}
        animate={{ opacity: currentSum !== null ? 1 : 0 }}
      >
        Current Sum: <span className="text-green-500">{currentSum}</span>
      </motion.div>
      <motion.div
        className="text-xl mb-4"
        initial={false}
        animate={{ opacity: carry > 0 ? 1 : 0, scale: carry > 0 ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        Carry: <span className="text-red-500">{carry}</span>
      </motion.div>
      <motion.p
        className="text-xl mb-4 text-center max-w-3xl bg-yellow-100 p-6 rounded-lg shadow-md"
        initial={false}
        animate={{ opacity: description ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <div className="mb-4">Step: {step}</div>
      <Button
        onClick={addTwoNumbers}
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
