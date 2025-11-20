import React from 'react';
import { 
  Bold, Italic, Code, List, Sparkles, Hash, 
  Minimize2, Maximize2, Eraser, Wand2, Type
} from 'lucide-react';
import { AiAction, FontTheme } from '../types';

interface EditorToolbarProps {
  onInsertSyntax: (syntax: string) => void;
  onAiAction: (action: AiAction) => void;
  onClear: () => void;
  onThemeChange: (theme: FontTheme) => void;
  currentTheme: FontTheme;
  isAiLoading: boolean;
  hasText: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onInsertSyntax,
  onAiAction,
  onClear,
  onThemeChange,
  currentTheme,
  isAiLoading,
  hasText
}) => {
  
  const btnClass = "p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const aiBtnClass = "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="bg-white border-b border-slate-200 rounded-t-xl flex flex-col gap-2 p-2">
      {/* Top Row: Formatting */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button onClick={() => onInsertSyntax('bold')} className={btnClass} title="Bold (**)">
            <Bold size={18} strokeWidth={2.5} />
          </button>
          <button onClick={() => onInsertSyntax('italic')} className={btnClass} title="Italic (*)">
            <Italic size={18} />
          </button>
          <button onClick={() => onInsertSyntax('code')} className={btnClass} title="Monospace (`)">
            <Code size={18} />
          </button>
          <button onClick={() => onInsertSyntax('list')} className={btnClass} title="List (-)">
            <List size={18} />
          </button>
          
          <div className="h-5 w-px bg-slate-200 mx-1" />
          
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => onThemeChange(FontTheme.Serif)}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                currentTheme === FontTheme.Serif ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Serif Style (𝐀𝐁𝐂)"
            >
              Serif
            </button>
            <button
              onClick={() => onThemeChange(FontTheme.Sans)}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                currentTheme === FontTheme.Sans ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Sans Style (𝗔𝗕𝗖)"
            >
              Sans
            </button>
          </div>
        </div>
        
        <button 
          onClick={onClear} 
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
          title="Clear All"
        >
          <Eraser size={18} />
        </button>
      </div>

      {/* Bottom Row: AI Actions */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-slate-100">
        <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 px-2 select-none">
          AI Assist
        </span>
        
        <button
          onClick={() => onAiAction(AiAction.Socialify)}
          disabled={isAiLoading || !hasText}
          className={`${aiBtnClass} bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200`}
        >
          <Sparkles size={12} className={isAiLoading ? "animate-spin" : ""} />
          Socialify
        </button>

        <button
          onClick={() => onAiAction(AiAction.Hashtags)}
          disabled={isAiLoading || !hasText}
          className={`${aiBtnClass} bg-white text-slate-700 border-slate-200 hover:bg-slate-50`}
        >
          <Hash size={12} />
          Tags
        </button>

        <button
          onClick={() => onAiAction(AiAction.Shorten)}
          disabled={isAiLoading || !hasText}
          className={`${aiBtnClass} bg-white text-slate-700 border-slate-200 hover:bg-slate-50`}
        >
          <Minimize2 size={12} />
          Shorten
        </button>

        <button
          onClick={() => onAiAction(AiAction.Expand)}
          disabled={isAiLoading || !hasText}
          className={`${aiBtnClass} bg-white text-slate-700 border-slate-200 hover:bg-slate-50`}
        >
          <Maximize2 size={12} />
          Expand
        </button>
      </div>
    </div>
  );
};