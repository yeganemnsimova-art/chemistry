import React, { useState } from 'react';
import { Award, CheckCircle2, Clock, Lock, RotateCcw, Shield } from 'lucide-react';
import {
  ACHIEVEMENTS,
  RANK_THRESHOLDS,
  getDetectiveRank,
} from '../data/achievements';
import { DetectiveProgress } from '../types/chemquest';

interface AchievementsViewProps {
  progress: DetectiveProgress;
  onResetProgress: () => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  progress,
  onResetProgress,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const rankInfo = getDetectiveRank(progress.xp);

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat('az-AZ', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(iso));
    } catch {
      return iso.slice(0, 10);
    }
  };

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">
            Rütbələr, nailiyyətlər və tarixçə
          </h1>
          <p className="mt-1.5 text-sm text-slate-300">
            Detektiv karyeranızı izləyin, açılmış nişanları və həll etdiyiniz hadisələri nəzərdən keçirin.
          </p>
        </div>

        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/70 px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-rose-300 hover:border-rose-500/40 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Tərəqqini sıfırla</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs">
            <span className="text-rose-200">Əminsiniz?</span>
            <button
              type="button"
              onClick={() => {
                onResetProgress();
                setConfirmReset(false);
              }}
              className="font-semibold text-rose-300 underline hover:text-rose-200"
            >
              Bəli, sıfırla
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="text-slate-300 hover:text-white ml-1"
            >
              Ləğv et
            </button>
          </div>
        )}
      </div>

      {/* Detective Ranks Ladder */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-cyan-300" />
          <span>Detektiv rütbə pilləkəni</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {RANK_THRESHOLDS.map((tier) => {
            const isCurrent = rankInfo.currentRank === tier.rank;
            const isReached = progress.xp >= tier.minXp;
            return (
              <div
                key={tier.rank}
                className={`rounded-2xl border p-5 transition-all ${
                  isCurrent
                    ? 'border-cyan-400/60 bg-cyan-500/10 glow-cyan'
                    : isReached
                    ? 'border-slate-700 bg-slate-900/70'
                    : 'border-slate-800/80 bg-slate-900/40 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-cyan-300 tabular-nums">
                    {tier.minXp}+ XP
                  </span>
                  <span
                    className={
                      isCurrent
                        ? 'font-semibold text-cyan-200'
                        : isReached
                        ? 'text-emerald-300'
                        : 'text-slate-500'
                    }
                  >
                    {isCurrent ? 'Cari rütbə' : isReached ? 'Keçilib' : 'Gələcək'}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-lg font-bold text-white">
                  {tier.rank}
                </h3>
                <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                  {tier.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* All Achievements */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
          <Award className="h-5 w-5 text-violet-300" />
          <span>
            Nailiyyətlər ({progress.unlockedAchievements.length} / {ACHIEVEMENTS.length})
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACHIEVEMENTS.map((ach) => {
            const unlocked = progress.unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between gap-3 ${
                  unlocked
                    ? 'border-violet-400/45 bg-violet-500/10'
                    : 'border-slate-800 bg-slate-900/50 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{ach.categoryLabel}</span>
                    <span className="font-mono text-cyan-300 tabular-nums">
                      +{ach.xpBonus} XP
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-base font-bold text-white flex items-center gap-2">
                    {unlocked ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="h-4 w-4 text-slate-500 shrink-0" />
                    )}
                    <span>{ach.title}</span>
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                <span
                  className={`text-xs font-medium ${
                    unlocked ? 'text-emerald-300' : 'text-slate-500'
                  }`}
                >
                  {unlocked ? 'Qazanılıb' : 'Hələ açılmayıb'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Case History */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-cyan-300" />
          <span>Həll edilən hadisələr tarixçəsi</span>
        </h2>

        {progress.solvedCases.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-sm text-slate-400">
            Hələ heç bir hadisə tamamlanmayıb. İlk sirri açaraq detektiv tarixçənizi başladın!
          </div>
        ) : (
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-800 text-xs text-slate-400 bg-slate-900/50">
                  <tr>
                    <th className="px-5 py-3.5 font-medium">Hadisə</th>
                    <th className="px-5 py-3.5 font-medium">Kateqoriya</th>
                    <th className="px-5 py-3.5 font-medium">Çətinlik</th>
                    <th className="px-5 py-3.5 font-medium">İpucu</th>
                    <th className="px-5 py-3.5 font-medium">Qazanc</th>
                    <th className="px-5 py-3.5 font-medium">Tarix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {progress.solvedCases.map((rec, idx) => (
                    <tr key={`${rec.caseId}-${idx}`} className="hover:bg-slate-900/40">
                      <td className="px-5 py-3.5 font-medium text-white">
                        {rec.title}
                      </td>
                      <td className="px-5 py-3.5 text-slate-300">{rec.category}</td>
                      <td className="px-5 py-3.5 text-slate-300">{rec.difficulty}</td>
                      <td className="px-5 py-3.5 font-mono text-slate-300 tabular-nums">
                        {rec.hintsUsed}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-cyan-300 tabular-nums">
                        +{rec.earnedXp} XP · +{rec.earnedScore} xal
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-400 tabular-nums">
                        {formatDate(rec.solvedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
