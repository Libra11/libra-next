/**
 * Author: Libra
 * Date: 2024-10-30 15:28:37
 * LastEditors: Libra
 * Description:
 */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Code,
  Map,
  Database,
  Box,
  Activity,
  ArrowRight,
} from "lucide-react";
import { MarkDownComponent } from "@/components/markdown";

export default function Component() {
  const [step, setStep] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [dataStructure, setDataStructure] = useState({
    target: { name: "Libra", age: 20 },
    effect: null as any,
    depsMap: null as any,
    deps: null as any,
  });

  const steps = [
    {
      title: "创建响应式对象",
      description: '使用 Proxy 包装原始对象 { name: "Libra", age: 20 }',
      code: `const obj = reactive({
  name: "Libra",
  age: 20
})`,
    },
    {
      title: "创建 Effect",
      description: "创建副作用函数并设置为激活状态",
      code: `effect(() => {
  console.log("获取：", obj.name)
})`,
    },
    {
      title: "访问属性触发 getter",
      description: "访问 obj.name 触发 getter，开始依赖收集",
      code: `function get(target, key, receiver) {
  const res = Reflect.get(target, key, receiver)
  track(target, key)
  return res
}`,
    },
    {
      title: "依赖收集 - WeakMap",
      description: "在 targetMap (WeakMap) 中创建 depsMap",
      code: `let depsMap = targetMap.get(target)
if (!depsMap) {
  targetMap.set(target, (depsMap = new Map()))
}`,
    },
    {
      title: "依赖收集 - Map",
      description: "在 depsMap (Map) 中创建 dep 集合",
      code: `let dep = depsMap.get(key)
if (!dep) {
  depsMap.set(key, (dep = new Set()))
}`,
    },
    {
      title: "依赖收集 - Set",
      description: "将当前 effect 添加到 dep 集合中",
      code: `if (!dep.has(activeEffect)) {
  dep.add(activeEffect)
}`,
    },
    {
      title: "修改属性值",
      description: '设置 obj.name = "Libra2"，触发 setter',
      code: `obj.name = "Libra2"`,
    },
    {
      title: "派发更新 - 查找依赖",
      description: "从 targetMap 中找到相关的依赖集合",
      code: `const depsMap = targetMap.get(target)
if (!depsMap) return
let deps = []
deps.push(depsMap.get(key))`,
    },
    {
      title: "派发更新 - 执行效果",
      description: "遍历依赖集合执行所有相关的 effect",
      code: `deps.forEach((dep) => {
  dep.forEach((effect) => {
    effect()
  })
})`,
    },
  ];

  const resetAnimation = () => {
    setStep(0);
    setDataStructure({
      target: { name: "Libra", age: 20 },
      effect: null,
      depsMap: null,
      deps: null,
    });
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      updateDataStructure(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
      updateDataStructure(step - 1);
    }
  };

  const updateDataStructure = (currentStep: number) => {
    const newData = { ...dataStructure };

    if (currentStep >= 1) {
      newData.effect = {
        id: 0,
        _isEffect: true,
        raw: 'console.log("获取：", obj.name)',
      };
    }

    if (currentStep >= 4) {
      newData.depsMap = {
        name: { type: "Map", entries: [] },
      };
    }

    if (currentStep >= 5) {
      newData.deps = {
        type: "Set",
        values: ["effect0"],
      };
    }

    if (currentStep >= 7) {
      newData.target.name = "Libra2";
    }

    setDataStructure(newData);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-8 dark:text-white">
        Vue 3 响应式系统工作原理
      </h1>

      <div className="w-full grid grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              当前执行代码
            </h2>
            <MarkDownComponent
              text={`\`\`\`javascript\n${steps[step].code}\n\`\`\``}
            />
          </div>
          <div className="mt-4 h-[400px] overflow-auto">
            <h2 className="text-xl font-bold mb-4 dark:text-white">完整代码</h2>
            <MarkDownComponent
              text={`\`\`\`javascript
// 完整实现代码
function reactive(target) {
  return new Proxy(target, {
    get: createGetter(),
    set: createSetter(),
  });
}

function createGetter() {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);
    track(target, key);
    return res;
  };
}

function createSetter() {
  return function set(target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver);
    trigger(target, key);
    return res;
  };
}

function effect(fn) {
  const effect = createReactiveEffect(fn, options);
  effect();
  return effect;
}

let uid = 0;
let activeEffect;

function createReactiveEffect(fn, options) {
  const effect = function reactiveEffect() {
    activeEffect = effect;
    return fn();
  };
  effect.id = uid++;
  effect._isEffect = true;
  effect.raw = fn;
  effect.options = options;
  return effect;
}

let targetMap = new WeakMap();

function track(target, key) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) targetMap.set(target, (depsMap = new Map()));
  let dep = depsMap.get(key);
  if (!dep) depsMap.set(key, (dep = new Set()));
  if (!dep.has(activeEffect)) dep.add(activeEffect);
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  let deps = [];
  deps.push(depsMap.get(key));
  deps.forEach((dep) => {
    dep.forEach((effect) => {
      effect();
    });
  });
}

// test
const obj = reactive({
  name: "Libra",
  age: 20,
});

effect(() => {
  console.log("获取：", obj.name);
});

obj.name = "Libra2";
\`\`\``}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex justify-between gap-4 mb-8">
            <motion.div
              className="flex-1 bg-blue-100 dark:bg-blue-900 rounded-lg p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Box className="w-4 h-4 dark:text-blue-300" />
                <span className="font-mono text-sm dark:text-blue-300">
                  原始对象 (target)
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded p-2 text-sm font-mono dark:text-gray-300">
                <pre className="text-xs shadow-none">
                  {JSON.stringify(dataStructure.target, null, 2)}
                </pre>
              </div>
            </motion.div>

            <AnimatePresence>
              {step >= 1 && (
                <motion.div
                  className="flex-1 bg-green-100 dark:bg-green-900 rounded-lg p-4"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 dark:text-green-300" />
                    <span className="font-mono text-sm dark:text-green-300">
                      Effect
                    </span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded p-2 text-sm font-mono dark:text-gray-300">
                    {dataStructure.effect && (
                      <pre className="text-xs shadow-none">
                        {JSON.stringify(dataStructure.effect, null, 2)}
                      </pre>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <AnimatePresence>
              {step >= 3 && (
                <motion.div
                  className="bg-purple-100 dark:bg-purple-900 rounded-lg p-4"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 dark:text-purple-300" />
                    <span className="font-mono text-sm dark:text-purple-300">
                      WeakMap
                    </span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded p-2 text-sm dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      <span className="font-mono">target → depsMap</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {step >= 4 && (
                <motion.div
                  className="bg-yellow-100 dark:bg-yellow-900 rounded-lg p-4"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Map className="w-4 h-4 dark:text-yellow-300" />
                    <span className="font-mono text-sm dark:text-yellow-300">
                      Map
                    </span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded p-2 text-sm dark:text-gray-300">
                    {dataStructure.depsMap && (
                      <pre className="text-xs shadow-none">
                        {JSON.stringify(dataStructure.depsMap, null, 2)}
                      </pre>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {step >= 5 && (
                <motion.div
                  className="bg-red-100 dark:bg-red-900 rounded-lg p-4"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 dark:text-red-300" />
                    <span className="font-mono text-sm dark:text-red-300">
                      Set
                    </span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded p-2 text-sm font-mono dark:text-gray-300">
                    {dataStructure.deps && (
                      <pre className="text-xs shadow-none">
                        {JSON.stringify(dataStructure.deps, null, 2)}
                      </pre>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium dark:text-white">
                  {steps[step].title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {steps[step].description}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prevStep}
                  disabled={step === 0}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-full disabled:opacity-50"
                >
                  上一步
                </button>
                <button
                  onClick={nextStep}
                  disabled={step === steps.length - 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50 dark:bg-blue-600"
                >
                  下一步
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={resetAnimation}
          className="px-6 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-full hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
        >
          重新播放
        </button>
      </div>
    </div>
  );
}
