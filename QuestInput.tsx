import React from "react";
import { Sparkles, AlertCircle, Loader2, Zap } from "lucide-react";

interface QuestInputProps {
  chore: string;
  onChangeChore: (val: string) => void;
  onSubmitQuest: () => void;
  isLoading: boolean;
  errorMessage: string | null;
}

const SAMPLE_CHORES = [
  "Fold the mountain of clean laundry",
  "Scrub the sink and dishes",
  "Dust the bookshelf and desk",
  "Take out trash & recycling",
];

export const QuestInput: React.FC<QuestInputProps> = ({
  chore,
  onChangeChore,
  onSubmitQuest,
  isLoading,
  errorMessage,
}) => {
  const handleSelectSample = (sample: string) => {
    onChangeChore(sample);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chore.trim() || isLoading) return;
    onSubmitQuest();
  };

  return (
    <div
      id="quest-input-section"
      className="p-6 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl space-y-4 shadow-sm"
    >
      <div className="space-y-1">
        <label
          htmlFor="chore-input"
          className="flex items-center space-x-2 text-sm font-bold text-slate-900 dark:text-slate-100 font-rpg"
        >
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Describe Your Mundane Chore</span>
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Paste any dull everyday task. The AI Guild will forge it into dramatic quest lore, XP rewards, and funny loot drops.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            id="chore-input"
            rows={3}
            value={chore}
            onChange={(e) => onChangeChore(e.target.value)}
            disabled={isLoading}
            placeholder="Describe your mundane chore (e.g. Wash the pile of dirty dishes in the sink)..."
            className="w-full h-24 p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100 shadow-xs disabled:opacity-60"
          />
          <div className="absolute bottom-2.5 right-3 text-[10px] font-medium text-slate-400 dark:text-slate-500 select-none">
            Gemini Flash v1.0
          </div>
        </div>

        {/* Quick sample chips */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Quick Invocations:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_CHORES.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => handleSelectSample(sample)}
                disabled={isLoading}
                className="text-xs py-1 px-3 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 shadow-2xs disabled:opacity-50 cursor-pointer"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div
            id="quest-error-notice"
            className="flex items-start space-x-2 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl p-3"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          id="accept-quest-button"
          type="submit"
          disabled={!chore.trim() || isLoading}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-950/60 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <span>Summoning Epic Quest...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 fill-current" />
              <span>Accept Quest</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
