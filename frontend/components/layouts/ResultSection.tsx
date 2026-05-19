import React from "react";
import ReactMarkdown from "react-markdown";

interface ResultSectionProps {
  title: string;
  result: string | null;
  emptyMessage: string;
  isMarkdown?: boolean;
}

const markdownComponents = {
  h1: ({ node, ...props }: any) => (
    <h1 className="text-lg font-bold mt-4 mb-2" {...props} />
  ),
  h2: ({ node, ...props }: any) => (
    <h2 className="text-base font-bold mt-3 mb-2" {...props} />
  ),
  h3: ({ node, ...props }: any) => (
    <h3 className="text-sm font-bold mt-2 mb-1" {...props} />
  ),
  p: ({ node, ...props }: any) => (
    <p className="mb-2 leading-relaxed" {...props} />
  ),
  ul: ({ node, ...props }: any) => (
    <ul className="list-disc list-inside mb-2" {...props} />
  ),
  ol: ({ node, ...props }: any) => (
    <ol className="list-decimal list-inside mb-2" {...props} />
  ),
  li: ({ node, ...props }: any) => <li className="mb-1" {...props} />,
  code: ({ node, ...props }: any) => (
    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono" {...props} />
  ),
  pre: ({ node, ...props }: any) => (
    <pre className="bg-gray-100 p-2 rounded overflow-x-auto mb-2 text-xs" {...props} />
  ),
};

export default function ResultSection({
  title,
  result,
  emptyMessage,
  isMarkdown = true,
}: ResultSectionProps) {
  return (
    <div className="content__right absolute top-[44px] left-[calc(55%-16px)] w-[45%] h-[300px] px-4 border border-solid border-gray-300 rounded-[3px] p-3 overflow-y-auto">
      <h3 className="mb-[10px] font-bold">{title}</h3>
      {result ? (
        <div className="text-sm markdown-content">
          {isMarkdown ? (
            <ReactMarkdown components={markdownComponents}>
              {result}
            </ReactMarkdown>
          ) : (
            <p className="whitespace-pre-wrap">{result}</p>
          )}
        </div>
      ) : (
        <p className="text-gray-400">{emptyMessage}</p>
      )}
    </div>
  );
}
