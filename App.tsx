/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ActiveQuest, PlayerStats, QuestStep } from "./types";
import {
  getActiveQuest,
  saveActiveQuest,
  getPlayerStats,
  saveDraftChore,
  getDraftChore,
  updateStepDefeated,
} from "./lib/db";
import { Header } from "./components/Header";
import { XpProgressBar } from "./components/XpProgressBar";
import { QuestInput } from "./components/QuestInput";
import { QuestStepCard } from "./components/QuestStepCard";
import { QuestVictory } from "./components/QuestVictory";
import { EmptyNoticeBoard } from "./components/EmptyNoticeBoard";
import { Shield, Sparkles } from "lucide-react";

export default function App() {
  const [activeQuest, setActiveQuest] = useState<ActiveQuest | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    total_xp: 0,
    completed_quests_count: 0,
  });
  const [choreInput, setChoreInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDbReady, setIsDbReady] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dark mode state with system preference fallback
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("esq_theme");
      if (savedTheme) return savedTheme === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Sync dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("esq_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("esq_theme", "light");
    }
  }, [darkMode]);

  // Load state from IndexedDB on startup
  useEffect(() => {
    async function initFromStorage() {
      try {
        const [savedQuest, savedStats, savedDraft] = await Promise.all([
          getActiveQuest(),
          getPlayerStats(),
          getDraftChore(),
        ]);

        if (savedQuest) setActiveQuest(savedQuest);
        if (savedStats) setPlayerStats(savedStats);
        if (savedDraft) setChoreInput(savedDraft);
      } catch (err) {
        console.error("Failed to load state from IndexedDB:", err);
      } finally {
        setIsDbReady(true);
      }
    }

    initFromStorage();
  }, []);

  // Save chore draft changes to IndexedDB
  const handleChoreInputChange = (value: string) => {
    setChoreInput(value);
    saveDraftChore(value).catch((err) => console.error("Could not persist draft:", err));
  };

  // Submit chore to server Gemini API (supports optional direct task override)
  const handleAcceptQuest = async (choreOverride?: string) => {
    const rawChore = choreOverride !== undefined ? choreOverride : choreInput;
    const choreToSubmit = rawChore.trim();
    if (!choreToSubmit || isLoading) return;

    if (choreOverride) {
      setChoreInput(choreOverride);
      saveDraftChore(choreOverride).catch(() => {});
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/quest/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chore: choreToSubmit }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      if (!data.steps || !Array.isArray(data.steps) || data.steps.length === 0) {
        throw new Error("No quest steps returned from the realm.");
      }

      // Convert raw steps to full QuestStep with unique IDs and defeated status
      const steps: QuestStep[] = data.steps.map(
        (raw: { quest_title: string; epic_description: string; xp_reward: number; loot_drop: string }, idx: number) => ({
          id: `step-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
          quest_title: raw.quest_title || `Epic Challenge #${idx + 1}`,
          epic_description: raw.epic_description || "Overcome this mighty task!",
          xp_reward: Number(raw.xp_reward) || 100,
          loot_drop: raw.loot_drop || "Trophy of Effort +1",
          defeated: false,
        })
      );

      const newQuest: ActiveQuest = {
        id: `quest-${Date.now()}`,
        original_chore: choreToSubmit,
        created_at: Date.now(),
        steps,
      };

      // Persist to IndexedDB
      await saveActiveQuest(newQuest);
      await saveDraftChore("");

      setActiveQuest(newQuest);
      setChoreInput("");
    } catch (err: any) {
      console.error("Failed to generate quest:", err);
      setErrorMessage(
        err.message || "The Guildmaster could not be reached. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Launch pre-configured example quest from Guild Notice Board
  const handleLaunchExampleQuest = () => {
    const exampleChore = "Conquer the Sacred Mop and purify the floors of the sanctuary";
    handleAcceptQuest(exampleChore);
  };

  // Toggle step defeated
  const handleToggleDefeated = async (stepId: string, defeated: boolean) => {
    if (!activeQuest) return;

    try {
      const { quest: updatedQuest, gainedXpDelta } = await updateStepDefeated(stepId, defeated);
      if (updatedQuest) {
        setActiveQuest(updatedQuest);
        setPlayerStats((prev) => ({
          ...prev,
          total_xp: Math.max(0, prev.total_xp + gainedXpDelta),
        }));
      }
    } catch (err) {
      console.error("Failed to update step defeat status:", err);
    }
  };

  // Abandon quest
  const handleAbandonQuest = async () => {
    const confirm = window.confirm(
      "Abandon this quest? Any unconquered steps will be lost to the abyss."
    );
    if (!confirm) return;

    await saveActiveQuest(null);
    setActiveQuest(null);
  };

  // Start new quest after victory
  const handleStartNewQuest = async () => {
    await saveActiveQuest(null);
    setActiveQuest(null);
  };

  const isAllStepsDefeated =
    Boolean(activeQuest) &&
    activeQuest!.steps.length > 0 &&
    activeQuest!.steps.every((s) => s.defeated);

  if (!isDbReady) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 mx-auto border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Opening Quest Journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="app-root"
      className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased flex flex-col items-center justify-center sm:p-6 md:p-8 selection:bg-indigo-500/20"
    >
      <div className="w-full max-w-md sm:h-[92vh] sm:max-h-[880px] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl sm:rounded-3xl overflow-hidden">
        <Header
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((prev) => !prev)}
          playerStats={playerStats}
          hasActiveQuest={Boolean(activeQuest)}
          onAbandonQuest={handleAbandonQuest}
        />

        {/* Top Progress Bar when active quest exists */}
        {activeQuest && (
          <XpProgressBar
            steps={activeQuest.steps}
            totalLifetimeXp={playerStats.total_xp}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Active Quest Context / Hero Card */}
          {activeQuest && (
            <div
              id="active-quest-hero"
              className="relative flex items-center gap-3.5 p-4 bg-indigo-50/50 dark:bg-indigo-950/40 border-2 border-indigo-200/90 dark:border-indigo-900/60 rounded-xl"
            >
              <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-indigo-400 dark:border-indigo-600 pointer-events-none" />
              <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-indigo-400 dark:border-indigo-600 pointer-events-none" />
              <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-indigo-400 dark:border-indigo-600 pointer-events-none" />
              <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-indigo-400 dark:border-indigo-600 pointer-events-none" />

              <div className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-lg shadow-sm shadow-indigo-200 dark:shadow-indigo-950 shrink-0 border border-indigo-400/40">
                <Shield className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold font-rpg tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
                  Current Quest Log
                </span>
                <h2 className="font-rpg font-bold text-slate-900 dark:text-slate-100 truncate text-base">
                  {activeQuest.original_chore}
                </h2>
              </div>
            </div>
          )}

          {/* If no active quest: show Guild Notice Board empty state and quest creation form */}
          {!activeQuest && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <EmptyNoticeBoard
                isLoading={isLoading}
                onLaunchExample={handleLaunchExampleQuest}
              />

              <QuestInput
                chore={choreInput}
                onChangeChore={handleChoreInputChange}
                onSubmitQuest={() => handleAcceptQuest()}
                isLoading={isLoading}
                errorMessage={errorMessage}
              />

              <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <p>
                  All quests, defeated states, and collected loot drops are preserved in your browser's IndexedDB. Close the tab or reload anytime—your heroic path is saved.
                </p>
              </div>
            </div>
          )}

          {/* If all steps defeated: show victory banner */}
          {isAllStepsDefeated && (
            <QuestVictory
              steps={activeQuest!.steps}
              onStartNewQuest={handleStartNewQuest}
            />
          )}

          {/* Checklist of Quest Step Cards */}
          {activeQuest && (
            <section id="quest-steps-list" className="space-y-3" aria-label="Quest Steps">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Quest Objectives ({activeQuest.steps.filter((s) => s.defeated).length}/
                  {activeQuest.steps.length} Defeated)
                </h2>
              </div>

              <div className="space-y-3">
                {activeQuest.steps.map((step, idx) => (
                  <QuestStepCard
                    key={step.id}
                    step={step}
                    index={idx}
                    totalSteps={activeQuest.steps.length}
                    onToggleDefeated={handleToggleDefeated}
                  />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
