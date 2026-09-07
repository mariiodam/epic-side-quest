import React from "react";
import { Check, ShieldCheck, Sparkles } from "lucide-react";
import { QuestStep } from "../types";

interface QuestStepCardProps {
  step: QuestStep;
  index: number;
  totalSteps: number;
  onToggleDefeated: (stepId: string, defeated: boolean) => void;
}

export const QuestStepCard: React.FC<QuestStepCardProps> = ({
  step,
  index,
  totalSteps,
  onToggleDefeated,
}) => {
  const isDefeated = step.defeated;

  return (
    <article
      id={`quest-step-card-${step.id}`}
      className={`relative group rounded-xl p-4 sm:p-5 transition-all duration-200 ${
        isDefeated
          ? "border-2 border-indigo-200/80 dark:border-indigo-900/50 bg-indigo-50/25 dark:bg-indigo-950/25"
          : "border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700/70"
      }`}
    >
      {/* Decorative RPG Menu Corner Accents */}
      <div className={`absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 pointer-events-none transition-colors ${
        isDefeated ? "border-indigo-300 dark:border-indigo-800" : "border-slate-300 dark:border-slate-700 group-hover:border-indigo-400"
      }`} />
      <div className={`absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 pointer-events-none transition-colors ${
        isDefeated ? "border-indigo-300 dark:border-indigo-800" : "border-slate-300 dark:border-slate-700 group-hover:border-indigo-400"
      }`} />
      <div className={`absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 pointer-events-none transition-colors ${
        isDefeated ? "border-indigo-300 dark:border-indigo-800" : "border-slate-300 dark:border-slate-700 group-hover:border-indigo-400"
      }`} />
      <div className={`absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 pointer-events-none transition-colors ${
        isDefeated ? "border-indigo-300 dark:border-indigo-800" : "border-slate-300 dark:border-slate-700 group-hover:border-indigo-400"
      }`} />

      {/* Inner RPG double-line frame effect */}
      <div className="flex items-start gap-3.5 sm:gap-4">
        {/* Checkbox / Defeat Action */}
        <button
          id={`toggle-step-button-${step.id}`}
          type="button"
          onClick={() => onToggleDefeated(step.id, !isDefeated)}
          className={`mt-1 w-6 h-6 rounded-md border-2 shrink-0 flex items-center justify-center transition-all cursor-pointer ${
            isDefeated
              ? "border-indigo-600 bg-indigo-600 text-white shadow-xs"
              : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:border-indigo-500 hover:text-indigo-600"
          }`}
          title={isDefeated ? "Mark step incomplete" : "Mark step as Defeated"}
          aria-label={isDefeated ? `Mark ${step.quest_title} as incomplete` : `Mark ${step.quest_title} as defeated`}
        >
          <Check
            className={`w-4 h-4 stroke-[3] transition-opacity ${
              isDefeated ? "opacity-100 text-white" : "opacity-0 group-hover:opacity-60"
            }`}
          />
        </button>

        <div className={`flex-1 min-w-0 ${isDefeated ? "opacity-60" : ""}`}>
          <div className="flex justify-between items-start gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                  Quest Objective {index + 1}/{totalSteps}
                </span>
              </div>
              <h3
                className={`font-rpg font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 leading-snug tracking-wide ${
                  isDefeated ? "line-through text-slate-500 dark:text-slate-400" : ""
                }`}
              >
                {step.quest_title}
              </h3>
            </div>

            {isDefeated ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold py-1 px-2.5 bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800/70 shrink-0 font-rpg tracking-wider">
                <ShieldCheck className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                DEFEATED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold py-0.5 px-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 shrink-0 font-rpg">
                <Sparkles className="w-3 h-3 text-amber-500" />
                +{step.xp_reward} XP
              </span>
            )}
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 italic leading-relaxed font-sans">
            "{step.epic_description}"
          </p>

          {/* Loot Drop Section styled as RPG Inventory Item */}
          <div className="mt-3.5 pt-2.5 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-rpg">
              ⚔ Loot Drop
            </span>
            <span className="font-semibold text-amber-600 dark:text-amber-400 text-right truncate">
              {step.loot_drop}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
