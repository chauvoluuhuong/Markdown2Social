import React from 'react';
import { ThumbsUp, MessageCircle, Share2, Globe } from 'lucide-react';

interface PreviewCardProps {
  content: string;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({ content }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Fake Header */}
      <div className="p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
          EX
        </div>
        <div className="flex-1">
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-sm">Example User</span>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span>Just now</span>
              <span>•</span>
              <Globe size={10} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-2 text-slate-900 whitespace-pre-wrap font-sans text-[15px] leading-relaxed break-words">
        {content || <span className="text-slate-400 italic">Your formatted post will appear here...</span>}
      </div>

      {/* Fake Interactions */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between text-slate-500 text-xs border-b border-slate-100 pb-2 mb-2">
          <div className="flex items-center gap-1">
            <div className="bg-blue-500 rounded-full p-1">
              <ThumbsUp size={8} className="text-white fill-current" />
            </div>
            <span>142</span>
          </div>
          <div className="flex gap-3">
            <span>24 comments</span>
            <span>5 shares</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <button className="flex-1 flex items-center justify-center gap-2 py-1 hover:bg-slate-50 rounded-md transition-colors text-slate-600 font-medium text-sm">
            <ThumbsUp size={18} />
            <span>Like</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-1 hover:bg-slate-50 rounded-md transition-colors text-slate-600 font-medium text-sm">
            <MessageCircle size={18} />
            <span>Comment</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-1 hover:bg-slate-50 rounded-md transition-colors text-slate-600 font-medium text-sm">
            <Share2 size={18} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};