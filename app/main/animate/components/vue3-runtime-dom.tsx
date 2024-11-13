/**
 * Author: Libra
 * Date: 2024-11-13 14:46:11
 * LastEditors: Libra
 * Description:
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Box, Activity, ArrowRight } from "lucide-react";
import { MarkDownComponent } from "@/components/markdown";

interface Step {
  title: string;
  description: string;
  code: string;
  domOperations: {
    type: string;
    params: string[];
    result?: string;
    detail?: string;
  }[];
}

export default function Component() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: Step[] = [
    {
      title: "节点操作封装",
      description: "Vue3 将原生 DOM 操作封装成统一的 API，实现跨平台渲染的基础",
      code: `// runtime-dom/src/nodeOps.ts
export const nodeOps = {
  // 插入节点: 在参考节点(anchor)之前插入新节点(child)
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null)
  },
  // 移除节点: 从父节点中移除指定的子节点
  remove: child => {
    const parent = child.parentNode
    if (parent) {
      parent.removeChild(child)
    }
  },
  // 创建元素节点: 根据标签名创建新的 DOM 元素
  createElement: (tag) => document.createElement(tag),
  // 创建文本节点: 创建包含指定文本的文本节点
  createText: text => document.createTextNode(text),
  // 创建注释节点: 创建包含指定内容的注释节点
  createComment: text => document.createComment(text),
  // 设置文本节点的内容
  setText: (node, text) => {
    node.nodeValue = text
  },
  // 设置元素节点的文本内容
  setElementText: (el, text) => {
    el.textContent = text
  },
  // 获取父节点
  parentNode: node => node.parentNode,
  // 获取下一个兄弟节点
  nextSibling: node => node.nextSibling,
  // 查询选择器
  querySelector: selector => document.querySelector(selector)
}`,
      domOperations: [
        {
          type: "createElement",
          params: ["div"],
          result: "<div></div>",
        },
        {
          type: "createText",
          params: ["Hello Vue3"],
          result: "Hello Vue3",
        },
        {
          type: "insert",
          params: ["child", "parent", "null"],
        },
      ],
    },
    {
      title: "属性操作封装",
      description: "提供统一的属性处理接口，根据不同属性类型调用相应的处理函数",
      code: `// runtime-dom/src/patchProp.ts
export const patchProp = (
  el: Element,      // 目标 DOM 元素
  key: string,      // 属性名
  prevValue: any,   // 旧值
  nextValue: any    // 新值
) => {
  // 根据属性类型分发到不同的处理函数
  switch (key) {
    // class 的处理比较特殊，因为它是最常见的属性
    case 'class':
      patchClass(el, nextValue)
      break
    // style 需要处理对象形式的样式
    case 'style':
      patchStyle(el, prevValue, nextValue)
      break
    default:
      // 处理事件监听器，以 on 开头的属性
      if (isOn(key)) {
        patchEvent(el, key, prevValue, nextValue)
      } else {
        // 其他普通属性
        patchAttr(el, key, nextValue)
      }
  }
}`,
      domOperations: [
        {
          type: "patchClass",
          params: ["el", "active highlighted"],
        },
        {
          type: "patchStyle",
          params: ["el", "{ color: 'red' }"],
        },
        {
          type: "patchEvent",
          params: ["el", "onClick", "handler"],
        },
      ],
    },
    {
      title: "Class 处理",
      description: "处理元素的 class 属性",
      code: `// runtime-dom/src/modules/class.ts
export function patchClass(el: Element, value: string | null) {
  if (value == null) {
    el.removeAttribute('class')
  } else {
    el.className = value
  }
}`,
      domOperations: [
        {
          type: "className",
          params: ["active highlighted"],
          result: `<div class="active highlighted"></div>`,
        },
        {
          type: "removeAttribute",
          params: ["class"],
          result: "<div></div>",
        },
      ],
    },
    {
      title: "Style 处理",
      description: "处理元素的内联样式",
      code: `// runtime-dom/src/modules/style.ts
export function patchStyle(
  el: Element,
  prev: Object | null,
  next: Object | null
) {
  const style = (el as HTMLElement).style
  if (!next) {
    el.removeAttribute('style')
  } else if (isString(next)) {
    style.cssText = next
  } else {
    for (const key in next) {
      style[key] = next[key]
    }
    if (prev) {
      for (const key in prev) {
        if (next[key] == null) {
          style[key] = ''
        }
      }
    }
  }
}`,
      domOperations: [
        {
          type: "style",
          params: ["{ color: 'red', fontSize: '14px' }"],
          result: `<div style="color: red; font-size: 14px;"></div>`,
        },
      ],
    },
    {
      title: "事件处理",
      description: "处理元素的事件监听器，实现事件的动态绑定和更新",
      code: `// runtime-dom/src/modules/events.ts
function createInvoker(value) {
  const invoker = (e) => invoker.value(e);
  invoker.value = value; // 更改invoker中的value属性 可以修改对应的调用函数
  return invoker;
}
export function patchEvent(
  el: Element & { _vei?: Object },
  rawName: string,
  prevValue: any,
  nextValue: any
) {
  // 缓存事件处理器
  const invokers = el._vei || (el._vei = {})
  const existingInvoker = invokers[rawName]

  if (nextValue && existingInvoker) {
    // 更新事件处理器
    existingInvoker.value = nextValue
  } else {
    const name = rawName.slice(2).toLowerCase()
    if (nextValue) {
      // 添加事件监听器
      const invoker = (invokers[rawName] = createInvoker(nextValue))
      el.addEventListener(name, invoker)
    } else if (existingInvoker) {
      // 移除事件监听器
      el.removeEventListener(name, existingInvoker)
      invokers[rawName] = undefined
    }
  }
}`,
      domOperations: [
        {
          type: "创建事件缓存",
          params: ["el._vei = {}"],
          result: "初始化事件缓存对象",
          detail: "为元素创建事件缓存，用于存储和复用事件处理器",
        },
        {
          type: "事件处理器包装",
          params: ["onClick", "handler"],
          result: "invoker = (e) => handler(e)",
          detail: "将原始事件处理器包装成可缓存的形式，支持动态更新",
        },
        {
          type: "addEventListener",
          params: ["click", "invoker"],
          result: "绑定点击事件",
          detail: "使用包装后的处理器绑定事件，避免重复绑定",
        },
        {
          type: "更新事件处理器",
          params: ["existingInvoker.value = newHandler"],
          result: "更新事件处理函数",
          detail: "直接更新缓存的处理器，无需重新绑定事件",
        },
        {
          type: "removeEventListener",
          params: ["click", "invoker"],
          result: "移除点击事件",
          detail: "清理事件绑定并移除缓存",
        },
      ],
    },
    {
      title: "渲染器配置与创建",
      description: "将所有 DOM 操作和属性处理方法整合，创建平台特定的渲染器",
      code: `// runtime-dom/src/index.ts
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'
import { createRenderer } from '@vue/runtime-core'

// 整合所有 DOM 操作方法
const renderOptions = Object.assign({ patchProp }, nodeOps)
// renderOptions 最终形态：
{
  // 节点操作
  insert: (child, parent, anchor) => void
  remove: (child) => void
  createElement: (tag) => Element
  createText: (text) => Text
  createComment: (text) => Comment
  setText: (node, text) => void
  setElementText: (node, text) => void
  parentNode: (node) => ParentNode | null
  nextSibling: (node) => ChildNode | null
  querySelector: (selector) => Element | null

  // 属性操作
  patchProp: (
    el: Element,
    key: string,
    prevValue: any,
    nextValue: any
  ) => void
}

// 创建平台特定的渲染方法
export const render = (vnode, container) => {
  return createRenderer(renderOptions).render(vnode, container)
}

// 导出所有运行时核心功能
export * from '@vue/runtime-core'`,
      domOperations: [
        {
          type: "renderOptions 配置",
          params: ["nodeOps", "patchProp"],
          result: "完整的渲染器配置对象",
          detail: "整合所有 DOM 操作和属性处理方法，为渲染器提供完整的平台能力",
        },
        {
          type: "createRenderer",
          params: ["renderOptions"],
          result: "平台特定的渲染器实例",
          detail: "基于配置创建渲染器，支持该平台的所有渲染能力",
        },
        {
          type: "render 方法",
          params: ["vnode", "container"],
          result: "渲染虚拟节点到容器",
          detail: "提供统一的渲染入口，内部使用平台特定的渲染器完成实际渲染",
        },
        {
          type: "跨平台渲染示例",
          params: ["Web", "Weex", "Native"],
          result: "不同平台的渲染支持",
          detail:
            "通过提供不同的 renderOptions，可以支持在不同平台上渲染 Vue 组件",
        },
      ],
    },
    {
      title: "Runtime DOM 总结",
      description:
        "Vue3 的 runtime-dom 模块通过统一的接口实现了跨平台渲染的基础",
      code: `// runtime-dom 的核心功能总结

1. 节点操作 (nodeOps)
- 提供统一的 DOM 操作接口
- 封装原生 DOM API
- 支持基本的节点操作（增删改查）

2. 属性处理 (patchProp)
- class 处理：支持字符串、对象、数组等多种形式
- style 处理：支持对象形式的样式定义
- 事件处理：支持事件的动态绑定和更新
- 普通属性：统一的属性操作接口

3. 优化设计
- 事件监听器缓存机制
- 属性更新的差异化处理
- 高效的 DOM 操作抽象

4. 跨平台支持
- 通过统一接口支持不同平台
- 提供可扩展的架构设计
- 支持自定义渲染器`,
      domOperations: [
        {
          type: "架构设计",
          params: ["统一接口", "跨平台支持"],
          result: "可扩展的渲染器架构",
        },
        {
          type: "性能优化",
          params: ["事件缓存", "属性更新优化"],
          result: "高效的 DOM 操作",
        },
        {
          type: "使用场景",
          params: ["Web", "SSR", "WebGL", "Native"],
          result: "广泛的平台支持",
        },
      ],
    },
  ];

  const currentState = steps[currentStep];

  return (
    <div className="flex flex-col justify-center p-4 bg-background">
      <h1 className="text-3xl font-bold mb-8">Vue3 Runtime DOM 模块实现</h1>

      <div className="grid grid-cols-2 gap-8 w-full max-w-7xl">
        {/* 左侧代码区域 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold bg-background py-2 z-10">
            源码实现
          </h2>
          <MarkDownComponent
            text={`\`\`\`typescript\n${currentState.code}\n\`\`\``}
          />
        </div>

        {/* 右侧可视化区域 */}
        <div className="space-y-8">
          <motion.div
            className="bg-card p-4 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4 bg-card py-2 z-10">
              DOM 操作演示
            </h3>
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {currentState.domOperations.map((op, index) => (
                  <motion.div
                    key={`${op.type}-${index}`}
                    className="bg-muted p-4 rounded-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-primary" />
                      <span className="font-mono text-sm font-bold">
                        {op.type}
                      </span>
                    </div>
                    <div className="pl-6 space-y-2">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-semibold">参数:</span>{" "}
                        {op.params.join(", ")}
                      </div>
                      {op.result && (
                        <div className="text-sm font-mono bg-background p-2 rounded">
                          <span className="font-semibold">结果:</span>{" "}
                          {op.result}
                        </div>
                      )}
                      {op.detail && (
                        <div className="text-sm mt-2 text-muted-foreground bg-background/50 p-2 rounded">
                          <span className="font-semibold">说明:</span>{" "}
                          {op.detail}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 控制按钮和说明 */}
      <div className="mt-8 w-full max-w-7xl">
        <div className="flex justify-between items-center">
          <motion.div
            key={currentStep}
            className="max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold mb-2">{currentState.title}</h2>
            <p className="text-muted-foreground">{currentState.description}</p>
          </motion.div>
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
            >
              上一步
            </button>
            <button
              onClick={() =>
                setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
              }
              disabled={currentStep === steps.length - 1}
              className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
            >
              下一步
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
