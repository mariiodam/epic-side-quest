import React from "react";
import { Trophy, Sparkles, Plus, Gift } from "lucide-react";
import { QuestStep } from "../types";

interface QuestVictoryProps {
  steps: QuestStep[];
  onStartNewQuest: () => void;
}

export const QuestVictory: React.FC<QuestVictoryProps> = ({ steps, onStartNewQuest }) => {
  const totalXp = steps.reduce((sum, s) => sum + s.xp_reward, 0);

  return (
    <section
      id="quest-victory-banner"
      className="w-full bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 rounded-3xl p-6 space-y-4 text-center animate-in fade-in zoom-in-95 duration-300 shadow-sm"
    >
      <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-950">
        <Trophy className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h2 className="font-rpg text-xl font-bold tracking-wider text-slate-900 dark:text-slate-100">
          Quest Triumphant!
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
          Every foe has been vanquished. Order has been restored to your sanctuary!
        </p>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 text-xs font-bold font-rpg uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
        <span>+{totalXp} XP Harvested</span>
      </div>

      {/* Loot inventory claimed */}
      <div className="text-left bg-white/80 dark:bg-slate-900/80 rounded-2xl p-4 border-2 border-indigo-200 dark:border-indigo-900/60 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-rpg">
          <Gift className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          Acquired Loot Inventory
        </span>
        <ul className="space-y-1.5 text-xs divide-y divide-slate-100 dark:divide-slate-800">
          {steps.map((step) => (
            <li key={step.id} className="pt-2 first:pt-0 flex items-center justify-between gap-2">
              <span className="font-bold text-amber-600 dark:text-amber-400 truncate">
                {step.loot_drop}
              </span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 shrink-0">
                +{step.xp_reward} XP
              </span>
            </li>
          ))}
        </ul>
      </div>

      <button
        id="start-next-quest-button"
        type="button"
        onClick={onStartNewQuest}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
      >
        <Plus className="w-4 h-4" />
        <span>Embark on Another Quest</span>
      </button>
    </section>
  );
};
