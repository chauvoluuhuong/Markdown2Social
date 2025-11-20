import React, { useState, useRef, useMemo, useCallback } from "react";
import { convertMarkdownToSocial } from "./utils/converter";
import { generateSocialContent } from "./services/geminiService";
import { EditorToolbar } from "./components/EditorToolbar";
import { PreviewCard } from "./components/PreviewCard";
import { DEFAULT_INPUT } from "./constants";
import { AiAction, FontTheme } from "./types";
import { Copy, Check, ArrowRight, Type, AlertCircle } from "lucide-react";

const App: React.FC = () => {
  const [input, setInput] = useState<string>(DEFAULT_INPUT);
  const [fontTheme, setFontTheme] = useState<FontTheme>(FontTheme.Sans);
  const [copied, setCopied] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Derived state: Perform conversion whenever input changes
  const output = useMemo(
    () => convertMarkdownToSocial(input, fontTheme),
    [input, fontTheme]
  );

  const handleInsertSyntax = useCallback((syntax: string) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selection = text.substring(start, end);

    let newText = "";
    let newCursorPos = 0;

    switch (syntax) {
      case "bold":
        newText =
          text.substring(0, start) +
          `**${selection || "bold"}**` +
          text.substring(end);
        newCursorPos = end + 4;
        break;
      case "italic":
        newText =
          text.substring(0, start) +
          `*${selection || "italic"}*` +
          text.substring(end);
        newCursorPos = end + 2;
        break;
      case "code":
        newText =
          text.substring(0, start) +
          `\`${selection || "code"}\`` +
          text.substring(end);
        newCursorPos = end + 2;
        break;
      case "list":
        newText =
          text.substring(0, start) +
          `\n- ${selection || "item"}` +
          text.substring(end);
        newCursorPos = end + 3;
        break;
      default:
        return;
    }

    setInput(newText);
    // Restore focus and cursor
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newCursorPos, newCursorPos);
    });
  }, []);

  const handleAiAction = async (action: AiAction) => {
    if (!input.trim()) return;
    setIsAiLoading(true);
    setError(null);

    try {
      const newContent = await generateSocialContent(action, input);
      setInput(newContent);
    } catch (err) {
      setError("Failed to connect to AI. Check your connection or API Key.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white py-4 px-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-inner shadow-blue-400/30">
              <Type className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight">
                MarkDown To Social Text
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Markdown to Unicode Converter
              </p>
            </div>
          </div>
          <div className="hidden sm:block text-xs font-medium px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-slate-300">
            Luu Huong Tech Tool
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-slate-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Left Column: Editor */}
          <div className="flex flex-col h-full min-h-[500px]">
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Markdown Input
              </label>
              {error && (
                <div className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                  <AlertCircle size={12} /> {error}
                </div>
              )}
            </div>

            <div className="flex flex-col flex-grow bg-white rounded-xl shadow-sm border border-slate-200 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400">
              <EditorToolbar
                onInsertSyntax={handleInsertSyntax}
                onAiAction={handleAiAction}
                onClear={() => setInput("")}
                onThemeChange={setFontTheme}
                currentTheme={fontTheme}
                isAiLoading={isAiLoading}
                hasText={input.length > 0}
              />
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your post here... Use **bold**, *italic*, or `code`."
                className="flex-grow w-full p-4 resize-none outline-none font-mono text-sm text-slate-700 rounded-b-xl bg-white"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Middle Arrow (Mobile Only) */}
          <div className="lg:hidden flex justify-center text-slate-300">
            <ArrowRight className="rotate-90" size={24} />
          </div>

          {/* Right Column: Preview & Output */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between mb-[-8px]">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Preview
              </label>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                  copied
                    ? "bg-green-500 text-white ring-2 ring-green-200"
                    : "bg-slate-900 text-white hover:bg-blue-600"
                }`}
              >
                {copied ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  <Copy size={14} />
                )}
                {copied ? "COPIED" : "COPY TEXT"}
              </button>
            </div>

            {/* Social Preview Card */}
            <PreviewCard content={output} />

            {/* Helper Text */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-xs text-blue-800">
              <strong className="block mb-1">💡 Pro Tip:</strong>
              The text generated uses mathematical Unicode symbols. While they
              look great visually on Facebook, X (Twitter), and LinkedIn, screen
              readers may not parse them correctly. Use them for emphasis rather
              than essential information.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
