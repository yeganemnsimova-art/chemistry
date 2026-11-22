import { AchievementDefinition, DetectiveRank } from '../types/chemquest';

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first_case',
    title: 'İlk Təhqiqat',
    description: 'İlk kimya sirri hadisəsini uğurla həll etdiniz.',
    xpBonus: 50,
    categoryLabel: 'Başlanğıc',
  },
  {
    id: 'no_hint_genius',
    title: 'İpucusuz Dahi',
    description: 'Heç bir ipucu almadan tam bir hadisəni açdınız.',
    xpBonus: 75,
    categoryLabel: 'Məntiq',
  },
  {
    id: 'acid_base_master',
    title: 'Turşu-Qələvi Ustası',
    description: 'Turşular və əsaslar kateqoriyasından bir sirri həll etdiniz.',
    xpBonus: 60,
    categoryLabel: 'Analitika',
  },
  {
    id: 'streak_three',
    title: 'Ardıcıl 3 Gün',
    description: '3 gün ardıcıl təhqiqat seriyasını qoruyub saxladınız.',
    xpBonus: 100,
    categoryLabel: 'Davamlılıq',
  },
  {
    id: 'daily_solver',
    title: 'Günün Detektivi',
    description: 'Günün kimya sirri tapşırığını uğurla tamamladınız.',
    xpBonus: 60,
    categoryLabel: 'Gündəlik',
  },
  {
    id: 'ai_creator',
    title: 'Süni İntellekt Müəllifi',
    description: 'AI ilə öz unikal kimya hadisənizi yaradıb araşdırdınız.',
    xpBonus: 80,
    categoryLabel: 'Yaradıcılıq',
  },
  {
    id: 'lab_explorer',
    title: 'Laboratoriya Tədqiqatçısı',
    description: 'Virtual kimya laboratoriyasında azı 3 təhlükəsiz reaksiya sınaqdan keçirdiniz.',
    xpBonus: 60,
    categoryLabel: 'Təcrübə',
  },
  {
    id: 'expert_investigator',
    title: 'Ekspert Müstəntiq',
    description: 'Ekspert çətinlik səviyyəli bir hadisəni uğurla tamamladınız.',
    xpBonus: 120,
    categoryLabel: 'Ustalıq',
  },
];

export const RANK_THRESHOLDS: { rank: DetectiveRank; minXp: number; nextXp: number | null; description: string }[] = [
  {
    rank: 'Junior Detektiv',
    minXp: 0,
    nextXp: 300,
    description: 'Əsas laboratoriya müşahidələri və sadə təhlillər aparır.',
  },
  {
    rank: 'Kimyaçı Detektiv',
    minXp: 300,
    nextXp: 800,
    description: 'İndikatorlar, məhlullar və dövri qanunlarla mürəkkəb sirləri açır.',
  },
  {
    rank: 'Baş Müstəntiq',
    minXp: 800,
    nextXp: 1500,
    description: 'Çoxmərhələli reaksiyaları və üzvi molekulları səhvsiz analiz edir.',
  },
  {
    rank: 'Usta Kimyaçı',
    minXp: 1500,
    nextXp: null,
    description: 'Kimya laboratoriyasının ən yüksək təhqiqat rütbəsi.',
  },
];

export function getDetectiveRank(xp: number): {
  currentRank: DetectiveRank;
  nextRank: DetectiveRank | null;
  progressPercent: number;
  xpToNext: number;
} {
  let currentIndex = 0;
  for (let i = 0; i < RANK_THRESHOLDS.length; i++) {
    if (xp >= RANK_THRESHOLDS[i].minXp) {
      currentIndex = i;
    }
  }
  const current = RANK_THRESHOLDS[currentIndex];
  const next = RANK_THRESHOLDS[currentIndex + 1] ?? null;

  if (!next || current.nextXp === null) {
    return {
      currentRank: current.rank,
      nextRank: null,
      progressPercent: 100,
      xpToNext: 0,
    };
  }

  const span = current.nextXp - current.minXp;
  const gained = xp - current.minXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((gained / span) * 100)));

  return {
    currentRank: current.rank,
    nextRank: next.rank,
    progressPercent,
    xpToNext: Math.max(0, current.nextXp - xp),
  };
}
