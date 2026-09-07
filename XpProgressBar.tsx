import React from "react";
import { CheckCircle2 } from "lucide-react";
import { QuestStep } from "../types";

interface XpProgressBarProps {
  steps: QuestStep[];
  totalLifetimeXp: number;
}

export const XpProgressBar: React.FC<XpProgressBarProps> = ({ steps }) => {
  const totalQuestXp = steps.reduce((acc, step) => acc + step.xp_reward, 0);
  const earnedQuestXp = steps
    .filter((step) => step.defeated)
    .reduce((acc, step) => acc + step.xp_reward, 0);

  const defeatedCount = steps.filter((step) => step.defeated).length;
  const totalCount = steps.length;
  const progressPercent =
    totalQuestXp > 0 ? Math.min(100, Math.round((earnedQuestXp / totalQuestXp) * 100)) : 0;

  return (
    <section
      id="xp-progress-section"
      aria-label="Quest Progress"
      className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 space-y-2.5"
    >
      <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
        <span>XP Progress</span>
        <div className="flex items-center gap-2">
          <span>
            {earnedQuestXp} / {totalQuestXp} XP
          </span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="flex items-center gap-1 font-medium lowercase tracking-normal text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            {defeatedCount}/{totalCount}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        id="xp-progress-bar-container"
        className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          id="xp-progress-bar-fill"
          className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)] dark:shadow-[0_0_12px_rgba(99,102,241,0.4)] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </section>
  );
};
