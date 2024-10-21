"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

const code = `Promise.resolve(console.log(0))
  .then(function F1() {
    console.log(1);
    Promise.resolve(console.log(5))
      .then(function F3() {
        console.log(3);
        return undefined;
      })
      .then(function F4() {
        console.log(4);
        return undefined;
      })
      .then(function F6() {
        console.log(6);
        return undefined;
      });
 
    return undefined;
  })
  .then(function F2() {
    console.log(2);
    return undefined;
  })
  .then(function F7() {
    console.log(7);
    return undefined;
  });`;

const steps = [
  {
    stack: [],
    microtask: ["F1"],
    log: "0",
    highlightLines: [1, 2],
    explanation: "执行 console.log(0)，将 F1 加入微任务队列",
  },
  {
    stack: ["F1"],
    microtask: [],
    log: "1",
    highlightLines: [3],
    explanation: "执行 F1，打印 1",
  },
  {
    stack: ["F1"],
    microtask: ["F3"],
    log: "5",
    highlightLines: [4, 5],
    explanation: "执行 console.log(5)，将 F3 加入微任务队列",
  },
  {
    stack: [],
    microtask: ["F3", "F2"],
    log: "",
    highlightLines: [18, 20],
    explanation: "F1 执行完毕，返回 undefined。将 F2 加入微任务队列",
  },
  {
    stack: ["F3"],
    microtask: ["F2"],
    log: "3",
    highlightLines: [6],
    explanation: "执行 F3，打印 3",
  },
  {
    stack: [],
    microtask: ["F2", "F4"],
    log: "",
    highlightLines: [7, 9],
    explanation: "F3 执行完毕，返回 undefined。将 F4 加入微任务队列",
  },
  {
    stack: ["F2"],
    microtask: ["F4"],
    log: "2",
    highlightLines: [21],
    explanation: "执行 F2，打印 2",
  },
  {
    stack: [],
    microtask: ["F4", "F7"],
    log: "",
    highlightLines: [22, 24],
    explanation: "F2 执行完毕，返回 undefined。将 F7 加入微任务队列",
  },
  {
    stack: ["F4"],
    microtask: ["F7"],
    log: "4",
    highlightLines: [10],
    explanation: "执行 F4，打印 4",
  },
  {
    stack: [],
    microtask: ["F7", "F6"],
    log: "",
    highlightLines: [11, 13],
    explanation: "F4 执行完毕，返回 undefined。将 F6 加入微任务队列",
  },
  {
    stack: ["F7"],
    microtask: ["F6"],
    log: "7",
    highlightLines: [25],
    explanation: "执行 F7，打印 7",
  },
  {
    stack: [],
    microtask: ["F6"],
    log: "",
    highlightLines: [26],
    explanation: "F7 执行完毕，返回 undefined",
  },
  {
    stack: ["F6"],
    microtask: [],
    log: "6",
    highlightLines: [14],
    explanation: "执行 F6，打印 6",
  },
  {
    stack: [],
    microtask: [],
    log: "",
    highlightLines: [15],
    explanation: "F6 执行完毕，返回 undefined。所有任务执行完毕",
  },
];

export default function Component() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleStart = () => {
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const currentState = steps[currentStep];

  return (
    <div className="flex items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-row gap-8 w-full max-w-7xl">
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-2">代码执行</h2>
          <SyntaxHighlighter
            language="javascript"
            style={tomorrow}
            wrapLines={true}
            showLineNumbers={true}
            lineProps={(lineNumber) => {
              const style = { display: "block" };
              if (currentState.highlightLines.includes(lineNumber)) {
                (style as React.CSSProperties).backgroundColor =
                  "rgba(255, 255, 0, 0.2)";
              }
              return { style };
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
        <div className="w-1/2">
          <h1 className="text-2xl font-bold mb-4">Promise 执行流程可视化</h1>
          <div className="flex flex-col gap-4">
            <div className="flex gap-8">
              <div className="w-1/2">
                <h2 className="text-xl font-semibold mb-2">调用栈</h2>
                <div className="bg-white border border-gray-300 p-2 h-64 w-full overflow-y-auto flex flex-col-reverse">
                  <AnimatePresence>
                    {currentState.stack.map((item, index) => (
                      <motion.div
                        key={`${item}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="bg-blue-200 p-2 mb-2 rounded w-full"
                      >
                        {item}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
              <div className="w-1/2">
                <h2 className="text-xl font-semibold mb-2">微任务队列</h2>
                <div className="bg-white border border-gray-300 p-2 h-64 w-full overflow-y-auto">
                  <AnimatePresence>
                    {currentState.microtask.map((item, index) => (
                      <motion.div
                        key={`${item}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5 }}
                        className="bg-green-200 p-2 mb-2 rounded w-full"
                      >
                        {item}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">控制台输出</h2>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-black text-white p-2 rounded"
              >
                {currentState.log || "\u00A0"}
              </motion.div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">说明</h2>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-yellow-100 p-4 rounded"
              >
                {currentState.explanation}
              </motion.div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p>
                步骤: {currentStep + 1} / {steps.length}
              </p>
              <div>
                {!isPlaying && currentStep === 0 && (
                  <button
                    onClick={handleStart}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    开始动画
                  </button>
                )}
                {(isPlaying || currentStep > 0) && (
                  <button
                    onClick={handleReset}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                  >
                    重置
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
