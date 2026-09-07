import React from "react";
import { Sword, Sun, Moon, RotateCcw } from "lucide-react";
import { PlayerStats } from "../types";

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  playerStats: PlayerStats;
  hasActiveQuest: boolean;
  onAbandonQuest: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  playerStats,
  hasActiveQuest,
  onAbandonQuest,
}) => {
  // Derive level and class based on total XP
  const getPlayerTitle = (xp: number) => {
    const level = Math.max(1, Math.floor(xp / 100) + 1);
    if (level >= 15) return `Level ${level} Grandmaster`;
    if (level >= 10) return `Level ${level} Paladin`;
    if (level >= 5) return `Level ${level} Knight`;
    if (level >= 2) return `Level ${level} Squire`;
    return `Level ${level} Novice`;
  };

  return (
    <header
      id="app-header"
      className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 flex flex-col gap-4 bg-white dark:bg-slate-900"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-indigo-950">
            <Sword className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-rpg text-xl sm:text-2xl font-bold tracking-wider text-slate-900 dark:text-slate-100">
              Epic Side Quest
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Turn everyday chores into heroic glory
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <div
            id="player-level-badge"
            className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 rounded-full"
            title={`Total Lifetime XP: ${playerStats.total_xp}`}
          >
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              {getPlayerTitle(playerStats.total_xp)}
            </span>
          </div>

          {hasActiveQuest && (
            <button
              id="abandon-quest-button"
              type="button"
              onClick={onAbandonQuest}
              className="p-2 text-xs font-medium text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Abandon active quest"
              aria-label="Abandon quest"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            id="theme-toggle-button"
            type="button"
            onClick={onToggleDarkMode}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
