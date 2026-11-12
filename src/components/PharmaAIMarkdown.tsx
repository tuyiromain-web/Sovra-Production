import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Edit, Maximize2, Download } from "lucide-react";

interface PharmaAIMarkdownProps {
  content: string;
  isStreaming?: boolean;
  onInsertToPrompt?: (text: string) => void;
  onExpandCode?: (code: string) => void;
}

interface CodeBlockProps {
  language: string;
  code: string;
  onInsertToPrompt?: (text: string) => void;
  onExpandCode?: (code: string) => void;
}

function CodeBlock({ language, code, onInsertToPrompt, onExpandCode }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SovraAI_Code_${Date.now().toString().slice(-4)}.${language === "python" ? "py" : language === "javascript" ? "js" : "txt"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="my-4 rounded-xl bg-[#090C10] border border-white/12 overflow-hidden shadow-xl text-left w-full">
      {/* Code Header Bar */}
      <div className="bg-[#14181F] border-b border-white/10 px-4 py-2 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider">
            {language || "code"}
          </span>
          {onInsertToPrompt && (
            <button
              onClick={() => onInsertToPrompt(`Revise this code snippet:\n\`\`\`${language}\n${code}\n\`\`\``)}
              className="flex items-center gap-1 text-[11px] font-mono text-[#94A3B8] hover:text-[#38BDF8] bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded transition-colors cursor-pointer"
              title="Load into chat input"
            >
              <Edit className="w-3 h-3 text-[#38BDF8]" />
              <span>Edit</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[11px] font-mono text-[#CBD5E1] hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied ✓</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-[#94A3B8]" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="p-1 text-[#94A3B8] hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
            title="Download code file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {onExpandCode && (
            <button
              onClick={() => onExpandCode(code)}
              className="p-1 text-[#94A3B8] hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
              title="Expand snippet"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Code Body */}
      <pre className="p-4 font-mono text-[13px] sm:text-[13.5px] text-[#E2E8F0] overflow-x-auto leading-relaxed bg-[#090C10] selection:bg-[#0284C7]/30">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function PharmaAIMarkdown({
  content,
  isStreaming = false,
  onInsertToPrompt,
  onExpandCode,
}: PharmaAIMarkdownProps) {
  return (
    <div className="sovra-ai-markdown text-left text-[#E2E8F0] w-full break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC] tracking-tight mt-6 mb-3 pb-2 border-b border-white/10 flex items-center gap-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg sm:text-xl font-bold text-[#38BDF8] tracking-tight mt-5 mb-2.5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base sm:text-lg font-semibold text-[#38BDF8] mt-4 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs sm:text-sm font-bold text-[#CBD5E1] uppercase tracking-wider mt-3 mb-1.5 font-mono">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-[15px] sm:text-[15.5px] leading-[1.75] text-[#E2E8F0] mb-3.5 font-normal">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-[#F8FAFC]">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-[#E2E8F0]">
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul className="space-y-2 my-3 pl-6 list-disc marker:text-[#38BDF8] text-[15px] sm:text-[15.5px] text-[#E2E8F0] leading-relaxed">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2.5 my-3 pl-6 list-decimal marker:text-[#38BDF8] marker:font-semibold text-[15px] sm:text-[15.5px] text-[#E2E8F0] leading-relaxed">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed text-[#E2E8F0] pl-1">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#0284C7] bg-[#14181E]/80 rounded-r-xl py-3 px-4.5 my-4 text-[#CBD5E1] text-[14.5px] italic leading-relaxed border-y border-r border-white/5">
              {children}
            </blockquote>
          ),
          hr: () => (
            <hr className="my-6 border-white/10" />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-5 rounded-xl border border-white/10 shadow-lg bg-[#0F1216]">
              <table className="w-full text-left text-sm border-collapse min-w-[500px]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#181D24] text-xs font-mono font-semibold text-[#F8FAFC] uppercase tracking-wider border-b border-white/10">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="py-3 px-4 text-xs font-mono font-semibold text-[#F8FAFC] tracking-wider border-b border-white/10">
              {children}
            </th>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-white/5 text-[14px] text-[#CBD5E1]">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-white/[0.03] transition-colors">
              {children}
            </tr>
          ),
          td: ({ children }) => (
            <td className="py-3 px-4 text-[14px] text-[#CBD5E1] align-top">
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[#38BDF8] hover:text-[#7DD3FC] underline underline-offset-3 font-medium transition-colors"
            >
              {children}
            </a>
          ),
          code: ({ inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");

            if (!inline && (codeString.includes("\n") || match)) {
              return (
                <CodeBlock
                  language={match ? match[1] : ""}
                  code={codeString}
                  onInsertToPrompt={onInsertToPrompt}
                  onExpandCode={onExpandCode}
                />
              );
            }

            return (
              <code
                className="bg-[#181D24] border border-white/10 text-[#38BDF8] px-1.5 py-0.5 rounded text-[13px] font-mono break-words"
                {...props}
              >
                {children}
              </code>
            );
          },
          input: ({ type, checked, ...props }: any) => {
            if (type === "checkbox") {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="mr-2 rounded border-white/20 bg-white/10 text-[#38BDF8] accent-[#38BDF8] focus:ring-0 cursor-default"
                />
              );
            }
            return <input type={type} {...props} />;
          }
        }}
      >
        {content}
      </ReactMarkdown>

      {/* Subtle streaming / generating typing cursor */}
      {isStreaming && (
        <span className="inline-block w-2 h-4 ml-1 bg-[#38BDF8] animate-pulse rounded-xs align-middle" />
      )}
    </div>
  );
}

export default PharmaAIMarkdown;
