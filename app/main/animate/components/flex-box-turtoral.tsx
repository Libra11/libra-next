/**
 * Author: Libra
 * Date: 2024-10-12 10:35:53
 * LastEditors: Libra
 * Description:
 */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CSSProperties } from "react";

type FlexProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

type FlexItemProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
  className?: string;
};

type PropertyButtonProps<T extends string | undefined> = {
  value: T;
  currentValue: T;
  onClick: (value: T) => void;
};

const FlexItem = ({ children, style }: FlexItemProps) => (
  <motion.div
    className="w-16 h-16 rounded-md flex items-center justify-center text-white font-bold text-sm"
    style={{
      backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
      ...style,
    }}
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
  >
    {children}
  </motion.div>
);

const FlexContainer = ({ children, style }: FlexProps) => (
  <motion.div
    className="border-2 border-primary rounded-lg p-4 mb-4 bg-secondary"
    style={{
      display: "flex",
      minHeight: "200px",
      ...style,
    }}
    layout
    transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
  >
    {children}
  </motion.div>
);

const Button = ({
  children,
  onClick,
  isActive,
  className = "",
}: ButtonProps) => (
  <button
    className={`px-4 py-2 rounded-md transition-all duration-300 ${
      isActive
        ? "bg-primary text-primary-foreground"
        : "bg-secondary text-secondary-foreground hover:bg-primary/20"
    } ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const PropertyButton = <T extends string | undefined>({
  value,
  currentValue,
  onClick,
}: PropertyButtonProps<T>) => (
  <Button
    onClick={() => onClick(value)}
    isActive={currentValue === value}
    className="mr-2 mb-2 text-sm"
  >
    {value}
  </Button>
);

export default function ImprovedFlexboxTutorial() {
  const [step, setStep] = useState(0);
  const [flexDirection, setFlexDirection] =
    useState<NonNullable<CSSProperties["flexDirection"]>>("row");
  const [justifyContent, setJustifyContent] =
    useState<NonNullable<CSSProperties["justifyContent"]>>("flex-start");
  const [alignItems, setAlignItems] =
    useState<NonNullable<CSSProperties["alignItems"]>>("stretch");
  const [flexWrap, setFlexWrap] =
    useState<NonNullable<CSSProperties["flexWrap"]>>("nowrap");
  const [alignContent, setAlignContent] =
    useState<NonNullable<CSSProperties["alignContent"]>>("stretch");

  const steps = [
    {
      title: "1. Flex 容器基础",
      description:
        "Flex容器是Flexbox布局的基础。它可以让你轻松地控制子元素的布局。",
      content: (
        <FlexContainer>
          <FlexItem>1</FlexItem>
          <FlexItem>2</FlexItem>
          <FlexItem>3</FlexItem>
        </FlexContainer>
      ),
    },
    {
      title: "2. flex-direction",
      description: "flex-direction定义了主轴的方向，决定了Flex项目的排列方向。",
      content: (
        <>
          <div className="mb-4 flex flex-wrap">
            {(["row", "column", "row-reverse", "column-reverse"] as const).map(
              (direction) => (
                <PropertyButton<NonNullable<CSSProperties["flexDirection"]>>
                  key={direction}
                  value={direction}
                  currentValue={flexDirection}
                  onClick={setFlexDirection}
                />
              )
            )}
          </div>
          <FlexContainer style={{ flexDirection }}>
            <FlexItem>1</FlexItem>
            <FlexItem>2</FlexItem>
            <FlexItem>3</FlexItem>
          </FlexContainer>
        </>
      ),
    },
    {
      title: "3. justify-content",
      description: "justify-content定义了Flex项目在主轴上的对齐方式。",
      content: (
        <>
          <div className="mb-4 flex flex-wrap">
            {(
              [
                "flex-start",
                "flex-end",
                "center",
                "space-between",
                "space-around",
                "space-evenly",
              ] as const
            ).map((justify) => (
              <PropertyButton<NonNullable<CSSProperties["justifyContent"]>>
                key={justify}
                value={justify}
                currentValue={justifyContent}
                onClick={setJustifyContent}
              />
            ))}
          </div>
          <FlexContainer style={{ justifyContent }}>
            <FlexItem>1</FlexItem>
            <FlexItem>2</FlexItem>
            <FlexItem>3</FlexItem>
          </FlexContainer>
        </>
      ),
    },
    {
      title: "4. align-items",
      description: "align-items定义了Flex项目在交叉轴上的对齐方式。",
      content: (
        <>
          <div className="mb-4 flex flex-wrap">
            {(
              [
                "flex-start",
                "flex-end",
                "center",
                "stretch",
                "baseline",
              ] as const
            ).map((align) => (
              <PropertyButton<NonNullable<CSSProperties["alignItems"]>>
                key={align}
                value={align}
                currentValue={alignItems}
                onClick={setAlignItems}
              />
            ))}
          </div>
          <FlexContainer style={{ alignItems, height: "300px" }}>
            <FlexItem>1</FlexItem>
            <FlexItem
              style={{ height: alignItems === "stretch" ? "auto" : "50px" }}
            >
              2
            </FlexItem>
            <FlexItem style={{ fontSize: "24px" }}>3</FlexItem>
          </FlexContainer>
        </>
      ),
    },
    {
      title: "5. flex-wrap",
      description: "flex-wrap定义了Flex项目是否应该换行。",
      content: (
        <>
          <div className="mb-4 flex flex-wrap">
            {(["nowrap", "wrap", "wrap-reverse"] as const).map((wrap) => (
              <PropertyButton<NonNullable<CSSProperties["flexWrap"]>>
                key={wrap}
                value={wrap}
                currentValue={flexWrap}
                onClick={setFlexWrap}
              />
            ))}
          </div>
          <FlexContainer style={{ flexWrap, width: "200px" }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <FlexItem key={num} style={{ margin: "2px" }}>
                {num}
              </FlexItem>
            ))}
          </FlexContainer>
        </>
      ),
    },
    {
      title: "6. align-content",
      description: "align-content定义了多行Flex项目在交叉轴上的对齐方式。",
      content: (
        <>
          <div className="mb-4 flex flex-wrap">
            {(
              [
                "flex-start",
                "flex-end",
                "center",
                "space-between",
                "space-around",
                "stretch",
              ] as const
            ).map((align) => (
              <PropertyButton<NonNullable<CSSProperties["alignContent"]>>
                key={align}
                value={align}
                currentValue={alignContent}
                onClick={setAlignContent}
              />
            ))}
          </div>
          <FlexContainer
            style={{
              flexWrap: "wrap",
              alignContent,
              height: "300px",
              width: "200px",
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <FlexItem key={num} style={{ margin: "2px" }}>
                {num}
              </FlexItem>
            ))}
          </FlexContainer>
        </>
      ),
    },
    {
      title: "7. flex-grow",
      description: "flex-grow定义了Flex项目的增长系数。",
      content: (
        <FlexContainer>
          <FlexItem style={{ flexGrow: 1 }}>
            1<br />
            (flex-grow: 1)
          </FlexItem>
          <FlexItem style={{ flexGrow: 2 }}>
            2<br />
            (flex-grow: 2)
          </FlexItem>
          <FlexItem style={{ flexGrow: 1 }}>
            3<br />
            (flex-grow: 1)
          </FlexItem>
        </FlexContainer>
      ),
    },
    {
      title: "8. flex-shrink",
      description: "flex-shrink定义了Flex项目的收缩系数。",
      content: (
        <FlexContainer style={{ width: "300px" }}>
          <FlexItem style={{ flexShrink: 1, width: "100px" }}>
            1<br />
            (flex-shrink: 1)
          </FlexItem>
          <FlexItem style={{ flexShrink: 2, width: "100px" }}>
            2<br />
            (flex-shrink: 2)
          </FlexItem>
          <FlexItem style={{ flexShrink: 3, width: "100px" }}>
            3<br />
            (flex-shrink: 3)
          </FlexItem>
        </FlexContainer>
      ),
    },
    {
      title: "9. flex-basis",
      description: "flex-basis定义了Flex项目在主轴方向上的初始大小。",
      content: (
        <FlexContainer>
          <FlexItem style={{ flexBasis: "100px" }}>
            1<br />
            (flex-basis: 100px)
          </FlexItem>
          <FlexItem style={{ flexBasis: "200px" }}>
            2<br />
            (flex-basis: 200px)
          </FlexItem>
          <FlexItem style={{ flexBasis: "auto" }}>
            3<br />
            (flex-basis: auto)
          </FlexItem>
        </FlexContainer>
      ),
    },
    {
      title: "10. align-self",
      description: "align-self允许单个Flex项目有与其他项目不一样的对齐方式。",
      content: (
        <FlexContainer style={{ height: "200px", alignItems: "flex-start" }}>
          <FlexItem>1</FlexItem>
          <FlexItem style={{ alignSelf: "center" }}>
            2<br />
            (align-self: center)
          </FlexItem>
          <FlexItem style={{ alignSelf: "flex-end" }}>
            3<br />
            (align-self: flex-end)
          </FlexItem>
        </FlexContainer>
      ),
    },
    {
      title: "11. order",
      description: "order属性定义了Flex项目的排列顺序。",
      content: (
        <FlexContainer>
          <FlexItem style={{ order: 3 }}>
            1<br />
            (order: 3)
          </FlexItem>
          <FlexItem style={{ order: 1 }}>
            2<br />
            (order: 1)
          </FlexItem>
          <FlexItem style={{ order: 2 }}>
            3<br />
            (order: 2)
          </FlexItem>
        </FlexContainer>
      ),
    },
  ];

  const nextStep = () => setStep((s) => Math.min(steps.length - 1, s + 1));
  const prevStep = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="p-4 max-w-3xl mx-auto bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-4">Flexbox 教程</h1>
      <div className="mb-4 flex justify-between">
        <Button
          onClick={prevStep}
          isActive={false}
          className="flex items-center"
        >
          <ChevronLeft className="mr-2" /> 上一步
        </Button>
        <Button
          onClick={nextStep}
          isActive={false}
          className="flex items-center"
        >
          下一步 <ChevronRight className="ml-2" />
        </Button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          <h2 className="text-2xl font-bold mb-2">{steps[step].title}</h2>
          <p className="mb-4">{steps[step].description}</p>
          {steps[step].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
