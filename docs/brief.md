# Epic Side Quest

**One sentence.** The user pastes a boring chore and gets back an epic RPG side quest.

**Who has this problem.** Chronic procrastinators who need gamified motivation — about 5 times a week.

**Shape**
- In: raw text describing a mundane task (e.g., "fold the laundry").
- Out: an array of objects representing the quest steps, with:
  - quest_title: string — dramatic name for the task
  - epic_description: string — funny, fantasy-style lore for this step
  - xp_reward: number — how many points this step is worth
  - loot_drop: string — a funny imaginary item you get at the end (e.g., "Socks of Agility +2")

**v1 does three things**
1. Paste a boring chore, press "Accept Quest", and see the epic steps.
2. Checkboxes to mark each step as "Defeated".
3. A progress bar that fills up as you gain XP during the session.

**Deliberately not in v1.** No user accounts, no long-term saving of XP to a database, no multiplayer, no leaderboards, no generated images (text only).
