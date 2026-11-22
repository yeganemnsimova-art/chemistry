export type CaseCategory =
  | 'Kimyəvi reaksiyalar'
  | 'Elementlər və dövri sistem'
  | 'Məhlullar'
  | 'Turşular və əsaslar'
  | 'Üzvi kimya'
  | 'Gündəlik həyatda kimya';

export type DifficultyLevel = 'Başlanğıc' | 'Orta' | 'Ekspert';

export type VisualEffectType =
  | 'color_shift'
  | 'bubbling'
  | 'precipitate'
  | 'flame'
  | 'ph_scan'
  | 'conductivity';

export interface CaseExperiment {
  id: string;
  actionLabel: string;
  reagentName: string;
  visualEffect: VisualEffectType;
  vesselColorsBefore: string[];
  vesselColorsAfter: string[];
  vesselLabels: string[];
  observation: string;
  scientificReasoning: string;
  measuredMetric: string;
}

export interface CaseStage {
  id: string;
  title: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  progressiveHints: string[];
  xpBonus: number;
}

export interface MysteryCase {
  id: string;
  title: string;
  category: CaseCategory;
  difficulty: DifficultyLevel;
  xpReward: number;
  estimatedMinutes: number;
  storyline: string;
  clues: string[];
  experiments: CaseExperiment[];
  stages: CaseStage[];
  isAiGenerated?: boolean;
  isDaily?: boolean;
}

export type DetectiveRank =
  | 'Junior Detektiv'
  | 'Kimyaçı Detektiv'
  | 'Baş Müstəntiq'
  | 'Usta Kimyaçı';

export interface SolvedCaseRecord {
  caseId: string;
  title: string;
  category: CaseCategory;
  difficulty: DifficultyLevel;
  earnedXp: number;
  earnedScore: number;
  hintsUsed: number;
  solvedAt: string;
  isDaily?: boolean;
  isAiGenerated?: boolean;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  xpBonus: number;
  categoryLabel: string;
}

export interface DetectiveProgress {
  xp: number;
  score: number;
  streak: number;
  lastSolvedDate: string | null;
  dailyCompletedDate: string | null;
  solvedCases: SolvedCaseRecord[];
  unlockedAchievements: string[];
  labExperimentsTried: string[];
  customCases: MysteryCase[];
}

export interface SafeLabReagent {
  id: string;
  name: string;
  formula: string;
  color: string;
  ph: number;
  description: string;
  type: 'acid' | 'base' | 'indicator' | 'salt' | 'neutral' | 'metal';
}

export interface SafeLabReaction {
  id: string;
  reagentAId: string;
  reagentBId: string;
  title: string;
  equation: string;
  resultColor: string;
  resultPh: number;
  effect: VisualEffectType;
  observation: string;
  scientificExplanation: string;
  everydayExample: string;
}
