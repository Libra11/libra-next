/**
 * Author: Libra
 * Date: 2024-09-12 10:38:20
 * LastEditors: Libra
 * Description:
 */
import ReactMarkdown from "react-markdown";

export const MarkDownComponent = ({ text }: { text: string }) => {
  return (
    <ReactMarkdown
      className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none"
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="text-2xl font-bold my-4" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-xl font-semibold my-3" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-lg font-medium my-2" {...props} />
        ),
        p: ({ node, ...props }) => <p className="my-2" {...props} />,
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside my-2" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside my-2" {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-gray-300 pl-4 italic my-2"
            {...props}
          />
        ),
        code: ({ node, inline, className, ...props }: any) =>
          inline ? (
            <code className="bg-gray-100 rounded px-1" {...props} />
          ) : (
            <pre className="bg-gray-100 rounded p-2 overflow-x-auto">
              <code {...props} />
            </pre>
          ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
};
