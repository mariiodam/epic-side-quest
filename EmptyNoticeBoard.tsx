import React from "react";
import { Shield, Sparkles, Loader2 } from "lucide-react";

interface EmptyNoticeBoardProps {
  isLoading: boolean;
  onLaunchExample: () => void;
}

export const EmptyNoticeBoard: React.FC<EmptyNoticeBoardProps> = ({
  isLoading,
  onLaunchExample,
}) => {
  return (
    <section
      id="guild-notice-board-empty"
      className="relative rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/80 shadow-md text-center space-y-5 transition-all overflow-hidden"
    >
      {/* Decorative RPG Ornate Corner Accents */}
      <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-indigo-400/80 dark:border-indigo-600 pointer-events-none" />
      <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-indigo-400/80 dark:border-indigo-600 pointer-events-none" />
      <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-indigo-400/80 dark:border-indigo-600 pointer-events-none" />
      <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-indigo-400/80 dark:border-indigo-600 pointer-events-none" />

      {/* Guild Notice Board Header Pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/80 text-[10px] font-bold tracking-widest text-indigo-700 dark:text-indigo-300 uppercase font-rpg">
        <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
        <span>Guild Notice Board Announcement</span>
      </div>

      {/* Resting Shield Emblem */}
      <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
        {/* Soft magical glow backdrop */}
        <div className="absolute inset-0 rounded-2xl bg-indigo-500/15 dark:bg-indigo-400/10 blur-md pointer-events-none" />

        <div className="relative w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-md rotate-[-4deg] transition-transform hover:rotate-0">
          <Shield className="w-7 h-7 text-indigo-600 dark:text-indigo-400 stroke-[2]" />
          {/* Subtle resting badge indicator */}
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center text-[9px] text-slate-500 dark:text-slate-400 font-bold">
            ⚔
          </span>
        </div>
      </div>

      {/* Titles and Lore */}
      <div className="space-y-2 max-w-md mx-auto">
        <h2 className="font-rpg font-bold text-lg sm:text-xl text-slate-900 dark:text-slate-100 tracking-wide">
          The Guild Notice Board is Empty (for now)
        </h2>

        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic">
          «No dragon is besieging your kingdom today, but the fearsome Mountain of Dirty Stuff is plotting in the shadows»
        </p>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
          Every great paladin started by sweeping the training grounds: turn everyday laziness into epic and legendary glory.
        </p>
      </div>

      {/* Visual Feedback: Glowing Rune Animations during Loading */}
      {isLoading && (
        <div
          id="summoning-runes-feedback"
          className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/70 dark:bg-indigo-950/60 space-y-2 animate-in fade-in zoom-in-95 duration-300 shadow-[0_0_15px_rgba(99,102,241,0.25)]"
        >
          <div className="flex items-center justify-center gap-3 text-indigo-600 dark:text-indigo-400">
            <span className="animate-pulse text-base tracking-widest font-mono">᚛ ᚠ</span>
            <span className="animate-pulse delay-75 text-base tracking-widest font-mono">ᚢ</span>
            <span className="animate-pulse delay-150 text-base tracking-widest font-mono">ᚦ</span>
            <Sparkles className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
            <span className="animate-pulse delay-200 text-base tracking-widest font-mono">ᚨ</span>
            <span className="animate-pulse delay-300 text-base tracking-widest font-mono">ᚱ</span>
            <span className="animate-pulse delay-500 text-base tracking-widest font-mono">ᚲ ᚜</span>
          </div>
          <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 font-rpg tracking-wide">
            Summoning the AI Guildmaster & forging your epic quest...
          </p>
        </div>
      )}

      {/* Highlighted Action Button */}
      <div className="pt-1">
        <button
          id="example-quest-button"
          type="button"
          onClick={onLaunchExample}
          disabled={isLoading}
          className="w-full py-3.5 px-5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-950/80 transition-all flex items-center justify-center gap-2 cursor-pointer font-rpg tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Forging Adventure...</span>
            </>
          ) : (
            <>
              <span>⚔️ Trying an Example Quest!</span>
            </>
          )}
        </button>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 italic">
          Auto-summons: "Conquer the Sacred Mop and purify the floors of the sanctuary"
        </p>
      </div>
    </section>
  );
};
