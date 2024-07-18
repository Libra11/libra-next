/**
 * Author: Libra
 * Date: 2024-07-10 09:47:25
 * LastEditors: Libra
 * Description:
 */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MarkDownComponent } from "@/components/markdown";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { Content } from "@google/generative-ai";
import { GeminiIcon } from "@/components/icon/geminiIcon";

interface ChatHistoryProps {
  history: Content[];
  userImage: string | undefined;
}

export function ChatHistory({ history, userImage }: ChatHistoryProps) {
  useEffect(() => {
    const chatContainer = document.querySelector(".chat");
    if (chatContainer) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [history]);

  return (
    <div className="chat flex-1 w-full h-0 overflow-auto p-4">
      {history.map((item, index) => (
        <div
          className={`flex items-start ${
            item.role === "user" ? "justify-start" : "justify-end"
          }`}
          key={index}
        >
          {item.role === "user" ? (
            <Avatar className=" mr-2 w-12 h-12 mt-6">
              <AvatarImage src={userImage || undefined} />
              <AvatarFallback className="bg-[hsl(var(--background-main))] text-xl">
                L
              </AvatarFallback>
            </Avatar>
          ) : null}

          <div
            key={index}
            className={`${
              item.role === "user"
                ? "bg-[hsl(var(--secondary))]"
                : "bg-[hsl(var(--primary))] text-white"
            } rounded-xl p-4 my-2 max-w-full flex-1`}
          >
            <span className=" font-bold">
              {item.role === "user" ? "Me" : "Gemini"}
            </span>
            {item.parts.map((part, i) => (
              <div key={i}>
                <MarkDownComponent text={part.text} />
              </div>
            ))}
          </div>

          {item.role === "model" ? (
            <div className="w-12 h-12 ml-2 mt-6 rounded-full bg-[hsl(var(--primary))] text-white flex justify-center items-center">
              <GeminiIcon width={24} height={24} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
