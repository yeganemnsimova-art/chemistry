import { DetectiveProgress, MysteryCase, SolvedCaseRecord } from '../types/chemquest';

const STORAGE_KEY = 'chemquest_detective_progress_v1';

export const DEFAULT_PROGRESS: DetectiveProgress = {
  xp: 0,
  score: 0,
  streak: 0,
  lastSolvedDate: null,
  dailyCompletedDate: null,
  solvedCases: [],
  unlockedAchievements: [],
  labExperimentsTried: [],
  customCases: [],
};

export function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayKey(): string {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadDetectiveProgress(): DetectiveProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<DetectiveProgress>;
    return {
      xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
      score: typeof parsed.score === 'number' ? parsed.score : 0,
      streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
      lastSolvedDate: typeof parsed.lastSolvedDate === 'string' ? parsed.lastSolvedDate : null,
      dailyCompletedDate:
        typeof parsed.dailyCompletedDate === 'string' ? parsed.dailyCompletedDate : null,
      solvedCases: Array.isArray(parsed.solvedCases) ? parsed.solvedCases : [],
      unlockedAchievements: Array.isArray(parsed.unlockedAchievements)
        ? parsed.unlockedAchievements
        : [],
      labExperimentsTried: Array.isArray(parsed.labExperimentsTried)
        ? parsed.labExperimentsTried
        : [],
      customCases: Array.isArray(parsed.customCases) ? parsed.customCases : [],
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveDetectiveProgress(progress: DetectiveProgress): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore quota or storage restriction errors cleanly
  }
}

export function evaluateUnlockedAchievements(
  progress: DetectiveProgress,
  latestSolved?: SolvedCaseRecord
): string[] {
  const unlocked = new Set<string>(progress.unlockedAchievements);

  if (progress.solvedCases.length >= 1) {
    unlocked.add('first_case');
  }
  if (latestSolved && latestSolved.hintsUsed === 0) {
    unlocked.add('no_hint_genius');
  }
  if (progress.solvedCases.some((c) => c.category === 'Turşular və əsaslar')) {
    unlocked.add('acid_base_master');
  }
  if (progress.streak >= 3) {
    unlocked.add('streak_three');
  }
  if (progress.solvedCases.some((c) => c.isDaily)) {
    unlocked.add('daily_solver');
  }
  if (progress.solvedCases.some((c) => c.isAiGenerated) || progress.customCases.length >= 1) {
    unlocked.add('ai_creator');
  }
  if (progress.labExperimentsTried.length >= 3) {
    unlocked.add('lab_explorer');
  }
  if (progress.solvedCases.some((c) => c.difficulty === 'Ekspert')) {
    unlocked.add('expert_investigator');
  }

  return Array.from(unlocked);
}

export function recordCaseCompletion(
  current: DetectiveProgress,
  mystery: MysteryCase,
  hintsUsed: number,
  bonusXpFromReasoning: number
): { nextProgress: DetectiveProgress; newlyUnlocked: string[]; totalEarnedXp: number; totalEarnedScore: number } {
  const today = getTodayKey();
  const yesterday = getYesterdayKey();

  const noHintBonus = hintsUsed === 0 ? 40 : 0;
  const totalEarnedXp = mystery.xpReward + noHintBonus + bonusXpFromReasoning;
  const totalEarnedScore = Math.max(50, totalEarnedXp * 2 - hintsUsed * 15);

  let nextStreak = current.streak;
  if (current.lastSolvedDate === today) {
    nextStreak = Math.max(1, current.streak);
  } else if (current.lastSolvedDate === yesterday) {
    nextStreak = current.streak + 1;
  } else {
    nextStreak = 1;
  }

  const record: SolvedCaseRecord = {
    caseId: mystery.id,
    title: mystery.title,
    category: mystery.category,
    difficulty: mystery.difficulty,
    earnedXp: totalEarnedXp,
    earnedScore: totalEarnedScore,
    hintsUsed,
    solvedAt: new Date().toISOString(),
    isDaily: mystery.isDaily,
    isAiGenerated: mystery.isAiGenerated,
  };

  const draft: DetectiveProgress = {
    ...current,
    xp: current.xp + totalEarnedXp,
    score: current.score + totalEarnedScore,
    streak: nextStreak,
    lastSolvedDate: today,
    dailyCompletedDate: mystery.isDaily ? today : current.dailyCompletedDate,
    solvedCases: [record, ...current.solvedCases],
  };

  const updatedUnlocked = evaluateUnlockedAchievements(draft, record);
  const newlyUnlocked = updatedUnlocked.filter(
    (id) => !current.unlockedAchievements.includes(id)
  );

  const nextProgress: DetectiveProgress = {
    ...draft,
    unlockedAchievements: updatedUnlocked,
  };

  saveDetectiveProgress(nextProgress);

  return {
    nextProgress,
    newlyUnlocked,
    totalEarnedXp,
    totalEarnedScore,
  };
}
