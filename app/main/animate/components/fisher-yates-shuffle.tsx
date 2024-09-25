/**
 * Author: Libra
 * Date: 2024-09-23 13:44:37
 * LastEditors: Libra
 * Description:
 */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const initialCards = [
  { id: 1, color: "bg-red-500", number: 7 },
  { id: 2, color: "bg-blue-500", number: 2 },
  { id: 3, color: "bg-green-500", number: 9 },
  { id: 4, color: "bg-yellow-500", number: 5 },
  { id: 5, color: "bg-purple-500", number: 3 },
];

export default function Component() {
  const [deck, setDeck] = useState(initialCards);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [swapIndex, setSwapIndex] = useState<number | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [description, setDescription] = useState("");

  const shuffle = async () => {
    setIsShuffling(true);
    const newDeck = [...deck];

    for (let i = newDeck.length - 1; i > 0; i--) {
      setCurrentIndex(i);
      setDescription(`Current Index: ${i}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const j = Math.floor(Math.random() * (i + 1));
      setSwapIndex(j);
      setDescription(`Swap index ${i} with random index ${j}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // 交换元素
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
      setDeck([...newDeck]);

      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSwapIndex(null);
    }

    setCurrentIndex(null);
    setDescription("Shuffle completed!");
    setIsShuffling(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-fullp-4">
      <h1 className="text-3xl font-bold mb-8">
        Fisher-Yates Shuffle Animation
      </h1>
      <div className="relative w-[520px] h-40 mb-8">
        <AnimatePresence>
          {deck.map((card, index) => (
            <motion.div
              key={card.id}
              className={`absolute w-20 h-32 rounded-lg ${card.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg border-2 border-white`}
              style={{
                background: `linear-gradient(135deg, ${card.color} 0%, ${card.color} 50%, #ffffff 100%)`,
                boxShadow:
                  "0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)",
                transition: "transform 0.3s ease-in-out",
              }}
              initial={false}
              animate={{
                x: index * 100,
                scale: index === currentIndex || index === swapIndex ? 1.1 : 1,
                opacity: isShuffling && index > (currentIndex ?? -1) ? 0.5 : 1,
                zIndex: index === currentIndex || index === swapIndex ? 10 : 1,
                rotate: index === currentIndex || index === swapIndex ? 10 : 0,
              }}
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 120,
                damping: 20,
              }}
              whileHover={{ scale: 1.2, rotate: 5 }}
            >
              {card.number}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <motion.p
        className="text-xl mb-4 h-8 text-center"
        initial={false}
        animate={{ opacity: description ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {description.split(" ").map((word, index) => (
          <span
            key={index}
            className={word.match(/\d+/) ? "font-bold text-blue-600" : ""}
          >
            {word}{" "}
          </span>
        ))}
      </motion.p>
      <Button
        onClick={shuffle}
        variant="default"
        size="lg"
        disabled={isShuffling}
        className="px-4 py-2 text-white rounded  transition-colors duration-300"
      >
        {isShuffling ? "Shuffling..." : "Start Shuffling"}
      </Button>
    </div>
  );
}
