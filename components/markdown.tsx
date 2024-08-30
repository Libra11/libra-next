/**
 * Author: Libra
 * Date: 2024-07-09 15:55:38
 * LastEditors: Libra
 * Description:
 */
"use client";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokaiSublime } from "react-syntax-highlighter/dist/esm/styles/hljs";
export const MarkDownComponent = ({ text }: { text: string | undefined }) => {
  return (
    <Markdown
      className="h-full mt-2"
      rehypePlugins={[rehypeRaw, rehypeKatex]}
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        code(props) {
          const { children, className, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <div className="my-4">
              <header className="bg-[#23241f] pt-2 px-4 rounded-t-lg overflow-hidden">
                <span className="bg-red-500 rounded-full w-3 h-3 inline-block mr-2"></span>
                <span className="bg-yellow-500 rounded-full w-3 h-3 inline-block mr-2"></span>
                <span className="bg-green-500 rounded-full w-3 h-3 inline-block mr-2"></span>
              </header>
              <SyntaxHighlighter
                {...rest}
                PreTag="div"
                language={match[1]}
                style={monokaiSublime}
                showLineNumbers={true}
                wrapLines={true}
                ref={null}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
              <footer className="bg-[#23241f] p-1 rounded-b-lg overflow-hidden"></footer>
            </div>
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          );
        },
      }}
    >
      {text || ""}
    </Markdown>
  );
};
