import { ActiveQuest, PlayerStats, QuestStep } from "../types";

const DB_NAME = "epic_side_quest_db";
const DB_VERSION = 1;
const STORE_NAME = "quest_store";

// Helper to open IndexedDB
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this environment."));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Failed to open IndexedDB"));
  });
}

// Fallback to localStorage if IndexedDB is blocked in sandboxed frames
const isStorageAvailable = () => typeof window !== "undefined" && window.localStorage;

async function getFromStore<T>(key: string): Promise<T | null> {
  try {
    const db = await openDatabase();
    return new Promise<T | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => resolve(req.result !== undefined ? (req.result as T) : null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    if (isStorageAvailable()) {
      const item = localStorage.getItem(`esq_${key}`);
      return item ? JSON.parse(item) : null;
    }
    return null;
  }
}

async function setInStore<T>(key: string, value: T): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    if (isStorageAvailable()) {
      localStorage.setItem(`esq_${key}`, JSON.stringify(value));
    }
  }
}

async function removeFromStore(key: string): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    if (isStorageAvailable()) {
      localStorage.removeItem(`esq_${key}`);
    }
  }
}

// Public Database APIs
export async function getActiveQuest(): Promise<ActiveQuest | null> {
  return getFromStore<ActiveQuest>("active_quest");
}

export async function saveActiveQuest(quest: ActiveQuest | null): Promise<void> {
  if (!quest) {
    await removeFromStore("active_quest");
  } else {
    await setInStore<ActiveQuest>("active_quest", quest);
  }
}

export async function getPlayerStats(): Promise<PlayerStats> {
  const stats = await getFromStore<PlayerStats>("player_stats");
  return (
    stats || {
      total_xp: 0,
      completed_quests_count: 0,
    }
  );
}

export async function savePlayerStats(stats: PlayerStats): Promise<void> {
  await setInStore<PlayerStats>("player_stats", stats);
}

export async function getDraftChore(): Promise<string> {
  const draft = await getFromStore<string>("draft_chore");
  return draft || "";
}

export async function saveDraftChore(chore: string): Promise<void> {
  await setInStore<string>("draft_chore", chore);
}

export async function updateStepDefeated(
  stepId: string,
  defeated: boolean
): Promise<{ quest: ActiveQuest | null; gainedXpDelta: number }> {
  const quest = await getActiveQuest();
  if (!quest) return { quest: null, gainedXpDelta: 0 };

  let gainedXpDelta = 0;
  const updatedSteps = quest.steps.map((step: QuestStep) => {
    if (step.id === stepId) {
      if (step.defeated !== defeated) {
        gainedXpDelta = defeated ? step.xp_reward : -step.xp_reward;
      }
      return {
        ...step,
        defeated,
        defeated_at: defeated ? Date.now() : undefined,
      };
    }
    return step;
  });

  const updatedQuest: ActiveQuest = {
    ...quest,
    steps: updatedSteps,
  };

  await saveActiveQuest(updatedQuest);

  // Update total player XP
  if (gainedXpDelta !== 0) {
    const stats = await getPlayerStats();
    const newTotalXp = Math.max(0, stats.total_xp + gainedXpDelta);
    await savePlayerStats({
      ...stats,
      total_xp: newTotalXp,
    });
  }

  return { quest: updatedQuest, gainedXpDelta };
}
