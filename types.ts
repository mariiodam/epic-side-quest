export interface QuestStep {
  id: string;
  quest_title: string;
  epic_description: string;
  xp_reward: number;
  loot_drop: string;
  defeated: boolean;
  defeated_at?: number;
}

export interface ActiveQuest {
  id: string;
  original_chore: string;
  created_at: number;
  steps: QuestStep[];
}

export interface PlayerStats {
  total_xp: number;
  completed_quests_count: number;
}
