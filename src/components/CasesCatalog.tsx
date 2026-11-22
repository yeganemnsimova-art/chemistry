import React from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { CASE_CATEGORIES } from '../data/cases';
import { CaseCategory, DifficultyLevel, MysteryCase } from '../types/chemquest';

interface CasesCatalogProps {
  allCases: MysteryCase[];
  solvedCaseIds: Set<string>;
  selectedCategory: CaseCategory | 'Hamısı';
  selectedDifficulty: DifficultyLevel | 'Hamısı';
  onSelectCategory: (category: CaseCategory | 'Hamısı') => void;
  onSelectDifficulty: (difficulty: DifficultyLevel | 'Hamısı') => void;
  onOpenCase: (mystery: MysteryCase) => void;
  onOpenAiModal: () => void;
}

const DIFFICULTY_FILTERS: (DifficultyLevel | 'Hamısı')[] = [
  'Hamısı',
  'Başlanğıc',
  'Orta',
  'Ekspert',
];

export const CasesCatalog: React.FC<CasesCatalogProps> = ({
  allCases,
  solvedCaseIds,
  selectedCategory,
  selectedDifficulty,
  onSelectCategory,
  onSelectDifficulty,
  onOpenCase,
  onOpenAiModal,
}) => {
  const filteredCases = allCases.filter((item) => {
    const matchesCat =
      selectedCategory === 'Hamısı' || item.category === selectedCategory;
    const matchesDiff =
      selectedDifficulty === 'Hamısı' || item.difficulty === selectedDifficulty;
    return matchesCat && matchesDiff;
  });

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">
            Kimya hadisələri arxivi
          </h1>
          <p className="mt-1.5 text-sm text-slate-300">
            Kateqoriya və ya çətinlik səviyyəsinə görə sirləri seçin və laboratoriyada həll edin.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAiModal}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all whitespace-nowrap shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>AI ilə öz hadisəni yarat</span>
        </button>
      </div>

      {/* Category & Difficulty Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-slate-900/75 border border-slate-800">
          <button
            type="button"
            onClick={() => onSelectCategory('Hamısı')}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
              selectedCategory === 'Hamısı'
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hamısı ({allCases.length})
          </button>
          {CASE_CATEGORIES.map((cat) => {
            const count = allCases.filter((c) => c.category === cat.name).length;
            const active = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => onSelectCategory(cat.name)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 mr-1">
            Çətinlik:
          </span>
          <div className="inline-flex flex-wrap gap-1 p-1 rounded-xl bg-slate-900/75 border border-slate-800">
            {DIFFICULTY_FILTERS.map((diff) => {
              const active = selectedDifficulty === diff;
              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => onSelectDifficulty(diff)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-violet-500/25 text-violet-200 border border-violet-400/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cases Grid */}
      {filteredCases.length === 0 ? (
        <div className="glass-panel rounded-2xl p-10 text-center space-y-3">
          <p className="font-display text-lg font-semibold text-white">
            Bu filtrə uyğun hadisə tapılmadı
          </p>
          <p className="text-sm text-slate-400">
            Bütün hadisələri göstərin və ya AI ilə yeni bir sirr yaradın.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                onSelectCategory('Hamısı');
                onSelectDifficulty('Hamısı');
              }}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Filtrləri sıfırla
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCases.map((item) => {
            const isSolved = solvedCaseIds.has(item.id);
            return (
              <article
                key={item.id}
                className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-5 hover:border-cyan-400/45 transition-all"
              >
                <div>
                  {/* Zero-pill clean unboxed metadata */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                    <span className="text-cyan-300 font-medium">{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.difficulty}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{item.xpReward} XP</span>
                    {item.isAiGenerated && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-violet-300 font-medium">AI hadisəsi</span>
                      </>
                    )}
                  </div>

                  <h2 className="mt-2 font-display text-xl font-bold text-white leading-snug">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-sm text-slate-300 leading-relaxed line-clamp-3">
                    {item.storyline}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  {isSolved ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Həll edilib</span>
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-slate-400 tabular-nums">
                      ~{item.estimatedMinutes} dəq · {item.stages.length} mərhələ
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => onOpenCase(item)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500/15 border border-cyan-400/40 px-4 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/25 transition-colors whitespace-nowrap"
                  >
                    <span>{isSolved ? 'Yenidən araşdır' : 'Araşdır'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
