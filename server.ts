import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

interface QuestStep {
  quest_title: string;
  epic_description: string;
  xp_reward: number;
  loot_drop: string;
}

// Dynamic generator that tailors fantasy quest steps to the specific chore
function generateFallbackQuest(chore: string): QuestStep[] {
  const cleanChore = chore.trim() || "Mundane Obligation";
  const lower = cleanChore.toLowerCase();

  if (lower.includes("laund") || lower.includes("cloth") || lower.includes("wash clothes")) {
    return [
      {
        quest_title: "Ascent of Mount Fabricius",
        epic_description: "Scale the colossal, wrinkled crags of Mount Fabricius where ancient garments lie dormant. Beware the curse of the mismatched socks!",
        xp_reward: 120,
        loot_drop: "Socks of Agility +2 (Warmth against Cold Castle Floors)",
      },
      {
        quest_title: "Subjugation of the Whirlpool Vortex",
        epic_description: "Offer detergents and sacred liquids unto the roaring metal centrifuge. Ward off rogue red shirts from tainting the holy whites.",
        xp_reward: 180,
        loot_drop: "Detergent Orb of Celestial Lavender (+10 Charisma)",
      },
      {
        quest_title: "The Great Geometric Fold",
        epic_description: "Impose immaculate right angles upon the vanquished cotton beasts. Banish them to their appropriate wooden drawers for eternity.",
        xp_reward: 220,
        loot_drop: "Hanger of Impeccable Order (+5 Armor to Shirts)",
      },
    ];
  }

  if (lower.includes("dish") || lower.includes("sink") || lower.includes("pot") || lower.includes("pan")) {
    return [
      {
        quest_title: "Reconnaissance at the Porcelain Trench",
        epic_description: "Confront the foul ceramic precipice where grease hydras have formed an impenetrable crust. Don thy rubber armor of defense!",
        xp_reward: 100,
        loot_drop: "Rubber Gauntlets of Scalding Resistance (+4 Fortitude)",
      },
      {
        quest_title: "The Battle of Scrubbing Foam",
        epic_description: "Wield the abrasive wand of yellow-and-green. Strike through the burnt marinara enchantments until the silver sparkles again.",
        xp_reward: 160,
        loot_drop: "Scrubber of Abrasive Justice (+3 Piercing vs Grime)",
      },
      {
        quest_title: "The Ritual of the Drying Rack",
        epic_description: "Stack the purified plates and cups in delicate equilibrium. One miscalculated balance could trigger catastrophic sonic collapse.",
        xp_reward: 200,
        loot_drop: "Porous Towel of Rapid Absorption (+2 Cleanliness)",
      },
    ];
  }

  if (lower.includes("trash") || lower.includes("garbage") || lower.includes("bin") || lower.includes("recycle")) {
    return [
      {
        quest_title: "The Knot of Containment",
        epic_description: "Tie the plastic shroud with ancient knot-craft to seal the pungent noxious miasma before it escapes into the living quarters.",
        xp_reward: 110,
        loot_drop: "Drawstring of Tensile Mastery (+1 Strength)",
      },
      {
        quest_title: "The Long March to the Outer Dumpster",
        epic_description: "Journey beyond the city gates across the treacherous concrete courtyard. Steer clear of alley cats and suspicious puddles.",
        xp_reward: 175,
        loot_drop: "Boots of Trench Traversing (+3 Poison Resist)",
      },
      {
        quest_title: "Consecration of the Empty Vessel",
        epic_description: "Install a pristine replacement liner within the dark bin. The sacred vessel is reborn, hungry for future mortal refuse.",
        xp_reward: 150,
        loot_drop: "Cloak of Odor Concealment (+2 Stealth)",
      },
    ];
  }

  // General fantasy quest generator tailored to the user chore name
  return [
    {
      quest_title: `Surveying the Chaos of "${cleanChore.slice(0, 32)}"`,
      epic_description: `Gaze into the dark abyss of "${cleanChore}". Foul procrastination spectres whisper doubts, but thy heroic duty calls thee to arms!`,
      xp_reward: 120,
      loot_drop: "Scroll of Reluctant Willpower (+2 Focus)",
    },
    {
      quest_title: "The Crucible of Relentless Effort",
      epic_description: `Engage the core labor of ${cleanChore}. Strike blow after blow against entropy and disarray until the realm yields to thy discipline.`,
      xp_reward: 190,
      loot_drop: "Gauntlets of Steady Progress (+5 Stamina)",
    },
    {
      quest_title: "Banishment of the Lingering Chaos",
      epic_description: "Put the finishing strokes to the battlefield. Stand proud amidst the restored order as peace descends upon thy realm.",
      xp_reward: 240,
      loot_drop: "Badge of the Conquering Householder (+10 Social Respect)",
    },
  ];
}

// API: Generate Epic Quest Steps
app.post("/api/quest/generate", async (req, res) => {
  try {
    const { chore } = req.body;

    if (!chore || typeof chore !== "string" || chore.trim().length === 0) {
      res.status(400).json({ error: "Chore description is required." });
      return;
    }

    const ai = getGeminiClient();

    if (!ai) {
      console.warn("GEMINI_API_KEY missing, using themed quest generator fallback.");
      const fallbackSteps = generateFallbackQuest(chore);
      res.json({ steps: fallbackSteps, source: "fallback" });
      return;
    }

    const prompt = `The mortal has submitted this mundane everyday chore:\n"${chore.trim()}"\n\nTransform this chore into a heroic sequence of 3 to 6 dramatic, hilarious, high-fantasy RPG quest steps. Make the lore theatrical, funny, and full of classic fantasy tropes (dragons, dungeons, potions, enchantments, goblins, stubborn curses). Ensure each step has a funny imaginary loot drop with humorous RPG perks.`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        systemInstruction:
          "You are the Grand Questmaster of the Fantasy Realm. Your sacred duty is to transform mundane everyday chores into dramatic, hilarious RPG quests with theatrical titles, funny fantasy-style lore descriptions, XP points (between 50 and 300 per step), and funny imaginary loot drops (e.g., 'Socks of Agility +2', 'Towel of Eternal Dampness -1'). Return pure JSON conforming strictly to the responseSchema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              quest_title: {
                type: Type.STRING,
                description: "Dramatic fantasy RPG name for the task step",
              },
              epic_description: {
                type: Type.STRING,
                description: "Funny, fantasy-style lore and backstory for this step",
              },
              xp_reward: {
                type: Type.INTEGER,
                description: "XP reward for completing this step (50 - 300)",
              },
              loot_drop: {
                type: Type.STRING,
                description: "A funny imaginary item awarded upon completion with stats or silly perks",
              },
            },
            required: ["quest_title", "epic_description", "xp_reward", "loot_drop"],
          },
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from Gemini API");
    }

    const parsedSteps = JSON.parse(responseText);

    if (!Array.isArray(parsedSteps) || parsedSteps.length === 0) {
      throw new Error("Invalid quest steps array returned");
    }

    // Sanitize steps
    const steps: QuestStep[] = parsedSteps.map((step, idx) => ({
      quest_title: String(step.quest_title || `Epic Task #${idx + 1}`),
      epic_description: String(step.epic_description || "Overcome this perilous obstacle with courage!"),
      xp_reward: Number(step.xp_reward) || (idx + 1) * 75,
      loot_drop: String(step.loot_drop || "Token of Reluctant Accomplishment +1"),
    }));

    res.json({ steps, source: "gemini" });
  } catch (error: any) {
    console.error("Error generating quest steps:", error);
    // Return fallback gracefully so the user is never stuck
    const fallbackSteps = generateFallbackQuest(req.body?.chore || "Mundane Task");
    res.json({
      steps: fallbackSteps,
      source: "fallback",
      notice: "Generated by backup Guildmaster spell due to realm interference.",
    });
  }
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Epic Side Quest server running on port ${PORT}`);
  });
}

startServer();
