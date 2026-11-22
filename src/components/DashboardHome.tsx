import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Flame,
  FlaskConical,
  Search,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { ACHIEVEMENTS, getDetectiveRank } from '../data/achievements';
import { CASE_CATEGORIES } from '../data/cases';
import { getTodayKey } from '../utils/storage';
import { CaseCategory, DetectiveProgress, MysteryCase } from '../types/chemquest';

interface DashboardHomeProps {
  progress: DetectiveProgress;
  allCases: MysteryCase[];
  dailyCase: MysteryCase;
  onStartNextMystery: () => void;
  onOpenCase: (mystery: MysteryCase) => void;
  onSelectCategory: (category: CaseCategory) => void;
  onOpenAiModal: () => void;
  onOpenLab: () => void;
  onOpenAchievements: () => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  progress,
  allCases,
  dailyCase,
  onStartNextMystery,
  onOpenCase,
  onSelectCategory,
  onOpenAiModal,
  onOpenLab,
  onOpenAchievements,
}) => {
  const [heroImgErr, setHeroImgErr] = useState(false);
  const [dailyImgErr, setDailyImgErr] = useState(false);

  const rankInfo = getDetectiveRank(progress.xp);
  const todayKey = getTodayKey();
  const isDailySolved = progress.dailyCompletedDate === todayKey;
  const solvedIds = new Set(progress.solvedCases.map((c) => c.caseId));

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Section 1: Hero Welcome Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 glass-panel-elevated rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-300">
              {rankInfo.currentRank} · Təhqiqat Mərkəzi
            </p>
            <h1 className="mt-2 font-display text-3xl sm:text-5xl font-bold tracking-tight text-white text-balance">
              Salam, Detektiv!
            </h1>
            <p className="mt-3 max-w-xl text-base text-slate-300 leading-relaxed">
              Kimya biliklərinizi, məntiqinizi və laboratoriya təcrübələrini birləşdirərək sirli hadisələri açın. Hər düzgün təhlil sizi <span className="text-white font-medium">Usta Kimyaçı</span> rütbəsinə yaxınlaşdırır.
            </p>

            {/* XP Progress Bar */}
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-medium text-slate-200">
                  Cari rütbə: <strong className="text-cyan-300">{rankInfo.currentRank}</strong>
                </span>
                <span className="font-mono text-slate-300 tabular-nums">
                  {rankInfo.nextRank
                    ? `${rankInfo.xpToNext} XP → ${rankInfo.nextRank}`
                    : 'Maksimum rütbə əldə edildi'}
                </span>
              </div>
              <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-500"
                  style={{ width: `${rankInfo.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onStartNextMystery}
              className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-[0.99] transition-all whitespace-nowrap"
            >
              <Search className="h-5 w-5" />
              <span>Yeni hadisəni araşdır</span>
            </button>

            <button
              type="button"
              onClick={onOpenAiModal}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-3.5 text-sm font-semibold text-slate-100 hover:border-cyan-400/50 hover:text-cyan-200 transition-colors whitespace-nowrap"
            >
              <Sparkles className="h-4 w-4 text-violet-300" />
              <span>AI ilə öz hadisəni yarat</span>
            </button>
          </div>
        </div>

        {/* Right Hero Visual */}
        <div className="lg:col-span-5 relative overflow-hidden rounded-3xl border border-slate-800/90 min-h-[260px] lg:min-h-full bg-[#091224]">
          {!heroImgErr ? (
            <img
              src="/src/assets/images/hero_chemistry_lab_1795348810782.jpg"
              alt="ChemQuest futuristik kimya detektivi laboratoriyası"
              referrerPolicy="no-referrer"
              onError={() => setHeroImgErr(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-950/70 via-slate-950 to-violet-950/70 p-8">
              <FlaskConical className="h-20 w-20 text-cyan-400/60" />
            </div>
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#060A13]/90 via-[#060A13]/20 to-transparent"
          />
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-cyan-300">Virtual Təhlil Masası</p>
              <p className="text-sm font-semibold text-white">
                {allCases.length} aktiv laboratoriya hadisəsi
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenLab}
              className="rounded-xl border border-cyan-400/40 bg-[#060A13]/80 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/20 transition-colors whitespace-nowrap"
            >
              Laboratoriyaya keç
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: 4-Column Detective Stats KPI Strip */}
      <section aria-label="Detektiv göstəriciləri" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5">
          <span className="text-xs text-slate-400">Detektiv səviyyəsi</span>
          <p className="mt-1.5 font-display text-xl sm:text-2xl font-bold text-white truncate">
            {rankInfo.currentRank}
          </p>
          <p className="mt-1 text-xs text-cyan-300 font-mono tabular-nums">
            {progress.xp} XP
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <span className="text-xs text-slate-400">Ümumi xal</span>
          <p className="mt-1.5 font-mono text-2xl sm:text-3xl font-bold text-violet-300 tabular-nums">
            {progress.score}
          </p>
          <p className="mt-1 text-xs text-slate-400">İpucusuz +40 XP bonus</p>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <span className="text-xs text-slate-400">Həll edilən hadisələr</span>
          <p className="mt-1.5 font-mono text-2xl sm:text-3xl font-bold text-cyan-300 tabular-nums">
            {progress.solvedCases.length}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {solvedIds.size} unikal sirr açılıb
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <span className="text-xs text-slate-400">Gündəlik seriya</span>
          <p className="mt-1.5 font-mono text-2xl sm:text-3xl font-bold text-amber-300 tabular-nums flex items-center gap-2">
            <Flame className="h-6 w-6 text-amber-400 shrink-0" />
            <span>{progress.streak} gün</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">Davamlı təhqiqat</p>
        </div>
      </section>

      {/* Section 3: Günün kimya sirri (Daily Mystery Challenge) */}
      <section className="glass-panel rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch">
        <div className="md:col-span-4 relative min-h-[200px] bg-[#091224]">
          {!dailyImgErr ? (
            <img
              src="/src/assets/images/daily_mystery_crest_1795348810668.jpg"
              alt="Günün kimya sirri nişanı"
              referrerPolicy="no-referrer"
              onError={() => setDailyImgErr(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-950/70 to-cyan-950/70">
              <Trophy className="h-14 w-14 text-cyan-300" />
            </div>
          )}
        </div>

        <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="text-violet-300 font-semibold">Günün kimya sirri</span>
              <span aria-hidden="true">·</span>
              <span>{dailyCase.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-cyan-300 tabular-nums">
                {dailyCase.xpReward} XP (+50 günlük bonus)
              </span>
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold text-white">
              {dailyCase.title}
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed line-clamp-2">
              {dailyCase.storyline}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            {isDailySolved ? (
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
                <CheckCircle2 className="h-5 w-5" />
                <span>Bugünkü tapşırıq tamamlandı! Yenidən məşq edə bilərsiniz.</span>
              </span>
            ) : (
              <span className="text-xs text-slate-400">
                Günün sirrini açaraq seriyanızı artırın.
              </span>
            )}

            <button
              type="button"
              onClick={() => onOpenCase(dailyCase)}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/15 border border-cyan-400/50 px-5 py-2.5 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/25 transition-colors whitespace-nowrap"
            >
              <span>{isDailySolved ? 'Yenidən bax' : 'Sirri araşdır'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Section 4: 6 Case Categories */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">
              Hadisə kateqoriyaları
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              İstədiyiniz kimya sahəsini seçib təhqiqata başlayın.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CASE_CATEGORIES.map((cat, idx) => {
            const catCases = allCases.filter((c) => c.category === cat.name);
            const catSolved = catCases.filter((c) => solvedIds.has(c.id)).length;

            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => onSelectCategory(cat.name)}
                className="group glass-panel rounded-2xl p-5 text-left hover:border-cyan-400/45 transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                    <span className="font-mono text-cyan-300">0{idx + 1}</span>
                    <span className="font-mono text-slate-400">{cat.formulaTag}</span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold text-white group-hover:text-cyan-200 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-300 leading-relaxed">
                    {cat.shortDesc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono tabular-nums">
                    {catSolved} / {catCases.length} həll edilib
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-cyan-300 group-hover:translate-x-0.5 transition-transform">
                    <span>Aç</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 5: Achievements & Progress Overview */}
      <section className="glass-panel rounded-3xl p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-violet-300" />
              <span>Nailiyyətlər və irəliləyiş</span>
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Cəmi {ACHIEVEMENTS.length} nailiyyətdən{' '}
              <span className="font-mono text-cyan-300 tabular-nums">
                {progress.unlockedAchievements.length}
              </span>{' '}
              ədədi qazanılıb.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenAchievements}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            <span>Hamısına bax</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ACHIEVEMENTS.slice(0, 4).map((ach) => {
            const unlocked = progress.unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`rounded-2xl border p-4 transition-colors ${
                  unlocked
                    ? 'border-cyan-400/35 bg-cyan-500/10'
                    : 'border-slate-800 bg-slate-900/50 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className={unlocked ? 'text-cyan-300 font-semibold' : 'text-slate-500'}>
                    {unlocked ? 'Qazanılıb' : 'Kilidli'}
                  </span>
                  <span className="font-mono text-slate-400 tabular-nums">
                    +{ach.xpBonus} XP
                  </span>
                </div>
                <h3 className="mt-2 font-display text-sm font-bold text-white">
                  {ach.title}
                </h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  {ach.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
