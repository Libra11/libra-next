/**
 * Author: Libra
 * Date: 2024-07-04 16:55:41
 * LastEditors: Libra
 * Description:
 */
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Content,
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { MagicWandIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState, useTransition } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function GeminiPage() {
  const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
  const safetySetting = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ];

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings: safetySetting,
  });
  const [history, setHistory] = useState<Content[]>([]);
  const [msg, setMsg] = useState("");
  const [isPending, startTransition] = useTransition();
  const textRef = useRef("");
  const indexRef = useRef(0);
  const user = useCurrentUser();
  const image = user?.image;

  useEffect(() => {
    const chatContainer = document.querySelector(".chat");
    if (chatContainer) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [history]); // 在 history 变化时触发

  async function run() {
    setHistory((preHistory) => [
      ...preHistory,
      {
        role: "user",
        parts: [{ text: msg }],
      },
      {
        role: "model",
        parts: [{ text: "" }], // Placeholder for the model's response
      },
    ]);

    startTransition(async () => {
      const chat = model.startChat({
        history,
      });
      const result = await chat.sendMessageStream(msg);

      textRef.current = "";
      indexRef.current = 0;
      for await (const chunk of result.stream) {
        const chunkText = await chunk.text();
        textRef.current += chunkText;
        // displayTextWithTypingEffect();
        setHistory((preHistory) => {
          const newHistory = [...preHistory];
          newHistory[newHistory.length - 1] = {
            role: "model",
            parts: [{ text: textRef.current }],
          };
          return newHistory;
        });
      }
      setMsg("");
    });
  }

  function displayTextWithTypingEffect() {
    if (indexRef.current < textRef.current.length) {
      setHistory((preHistory) => {
        const newHistory = [...preHistory];
        newHistory[newHistory.length - 1] = {
          role: "model",
          parts: [{ text: textRef.current.slice(0, indexRef.current + 1) }],
        };
        console.log(newHistory);
        return newHistory;
      });
      indexRef.current++;
      requestAnimationFrame(displayTextWithTypingEffect); // Use requestAnimationFrame for smoother updates
    }
  }
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !isPending && msg.trim()) {
      run();
    }
  }

  return (
    <div className=" w-full h-full flex flex-col justify-center items-center">
      <div className="chat flex-1 w-full h-0 overflow-auto p-4">
        {history.map((item, index) => {
          return (
            <div
              className={`flex items-start ${
                item.role === "user" ? "justify-start" : "justify-end"
              }`}
              key={index}
            >
              {item.role === "user" ? (
                <Avatar className=" mr-2 w-12 h-12 mt-6">
                  <AvatarImage src={image || undefined} />
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
                    <Markdown
                      className="h-full mt-2"
                      rehypePlugins={[rehypeRaw, rehypeKatex]}
                      remarkPlugins={[remarkGfm, remarkMath]}
                      components={{
                        code(props) {
                          const { children, className, ...rest } = props;
                          const match = /language-(\w+)/.exec(className || "");
                          return match ? (
                            <SyntaxHighlighter
                              {...rest}
                              PreTag="div"
                              language={match[1]}
                              style={atomDark}
                              showLineNumbers={true}
                              wrapLines={true}
                              ref={null}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code {...rest} className={className}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {part.text || ""}
                    </Markdown>
                  </div>
                ))}
              </div>

              {item.role === "model" ? (
                <div className="w-12 h-12 ml-2 mt-6 rounded-full bg-[hsl(var(--primary))] text-white flex justify-center items-center">
                  <MagicWandIcon />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="w-[800px] flex justify-center items-center relative">
        <Input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="w-full rounded-full h-12 pl-4"
          placeholder="☺Type your message to Gemini..."
          onKeyDown={handleKeyDown}
        />
        <Button
          onClick={run}
          disabled={isPending || !msg}
          className="h-10 absolute right-1 top-1 rounded-full w-24 p-0"
        >
          Send <PaperPlaneIcon className="ml-2" width={18} height={18} />
        </Button>
      </div>
    </div>
  );
}
