/**
 * Author: Libra
 * Date: 2024-07-10 09:47:25
 * LastEditors: Libra
 * Description:
 */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MarkDownComponent } from "@/components/markdown";
import { useEffect, useState } from "react";
import { Content } from "@google/generative-ai";
import GeminiIcon from "@/public/gemini.svg";
import Loading from "@/components/loading";

interface ChatHistoryProps {
  history: Content[];
  userImage: string | undefined;
}

export function ChatHistory({ history, userImage }: ChatHistoryProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const chatContainer = document.querySelector(".chat");
    if (chatContainer) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth",
      });
    }

    // 设置一个最小加载时间
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [history]);

  if (isLoading) {
    return <Loading size="large" />;
  }

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
            <Avatar className="mr-2 w-12 h-12 mt-6 max-sm:hidden">
              <AvatarImage src={userImage || undefined} />
              <AvatarFallback className="bg-[hsl(var(--background-main))] text-xl">
                L
              </AvatarFallback>
            </Avatar>
          ) : null}

          <div
            className={`${
              item.role === "user"
                ? "bg-[hsl(var(--secondary))]"
                : "bg-[hsl(var(--primary))] text-white"
            } rounded-xl p-4 my-2 max-w-full flex-1 myClass`}
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
            <div className="w-12 h-12 ml-2 mt-6 rounded-full bg-[hsl(var(--primary))] text-white flex justify-center items-center max-sm:hidden">
              <GeminiIcon width={24} height={24} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
