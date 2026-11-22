import React, { useState } from 'react';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronRight,
  Eye,
  FlaskConical,
  HelpCircle,
  Lightbulb,
  Loader2,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { ACHIEVEMENTS } from '../data/achievements';
import { CaseExperiment, MysteryCase } from '../types/chemquest';
import { LabVesselAnimation } from './LabVesselAnimation';

interface CaseInvestigatorProps {
  mystery: MysteryCase;
  aiAvailable: boolean;
  onBack: () => void;
  onComplete: (
    mystery: MysteryCase,
    hintsUsed: number,
    bonusXpFromReasoning: number
  ) => {
    newlyUnlocked: string[];
    totalEarnedXp: number;
    totalEarnedScore: number;
  };
}

export const CaseInvestigator: React.FC<CaseInvestigatorProps> = ({
  mystery,
  aiAvailable,
  onBack,
  onComplete,
}) => {
  const [checkedClues, setCheckedClues] = useState<number[]>([]);
  const [activeExperiment, setActiveExperiment] = useState<CaseExperiment | null>(null);
  const [experimentsRunIds, setExperimentsRunIds] = useState<string[]>([]);
  const [isReacting, setIsReacting] = useState(false);

  const [stageIndex, setStageIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [reasoningText, setReasoningText] = useState('');
  const [stageSolved, setStageSolved] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'retry';
    message: string;
  } | null>(null);
  const [checkingAnswer, setCheckingAnswer] = useState(false);

  const [hintsUsed, setHintsUsed] = useState(0);
  const [revealedHints, setRevealedHints] = useState<string[]>([]);
  const [loadingHint, setLoadingHint] = useState(false);
  const [reasoningBonusXp, setReasoningBonusXp] = useState(0);

  const [completionSummary, setCompletionSummary] = useState<{
    newlyUnlocked: string[];
    totalEarnedXp: number;
    totalEarnedScore: number;
  } | null>(null);

  const currentStage = mystery.stages[stageIndex];

  const toggleClue = (idx: number) => {
    setCheckedClues((prev) =>
      prev.includes(idx) ? prev.filter((item) => item !== idx) : [...prev, idx]
    );
  };

  const handleRunExperiment = (exp: CaseExperiment) => {
    setActiveExperiment(exp);
    setIsReacting(false);
    setTimeout(() => {
      setIsReacting(true);
    }, 40);
    if (!experimentsRunIds.includes(exp.id)) {
      setExperimentsRunIds((prev) => [...prev, exp.id]);
    }
  };

  const handleRequestHint = async () => {
    if (!currentStage || loadingHint) return;
    const nextHintNumber = revealedHints.length + 1;

    setLoadingHint(true);
    setHintsUsed((prev) => prev + 1);

    if (aiAvailable) {
      try {
        const res = await fetch('/api/cases/hint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storyline: mystery.storyline,
            question: currentStage.question,
            experimentsRun: experimentsRunIds.map(
              (id) =>
                mystery.experiments.find((e) => e.id === id)?.actionLabel || id
            ),
            hintStep: nextHintNumber,
          }),
        });
        const data = await res.json();
        if (res.ok && data?.hint) {
          setRevealedHints((prev) => [...prev, data.hint]);
          setLoadingHint(false);
          return;
        }
      } catch {
        // Fall through cleanly to local progressive hint
      }
    }

    const fallbackIndex = Math.min(
      revealedHints.length,
      Math.max(0, currentStage.progressiveHints.length - 1)
    );
    const localHint =
      currentStage.progressiveHints[fallbackIndex] ||
      'Sol tərəfdəki laboratoriya təcrübələrini işə salıb nəticələri müqayisə edin.';
    setRevealedHints((prev) => [...prev, localHint]);
    setLoadingHint(false);
  };

  const handleCheckAnswer = async () => {
    if (selectedOption === null || !currentStage || checkingAnswer) return;
    setCheckingAnswer(true);

    const isCorrect = selectedOption === currentStage.correctIndex;
    const hasReasoning = reasoningText.trim().length >= 8;

    let aiFeedbackText: string | null = null;

    if (aiAvailable && (hasReasoning || !isCorrect)) {
      try {
        const res = await fetch('/api/cases/evaluate-reasoning', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: currentStage.question,
            selectedOption: currentStage.options[selectedOption],
            correctOption: currentStage.options[currentStage.correctIndex],
            isCorrect,
            userReasoning: reasoningText.trim(),
            scientificExplanation: currentStage.explanation,
          }),
        });
        const data = await res.json();
        if (res.ok && data?.feedback) {
          aiFeedbackText = data.feedback;
        }
      } catch {
        // Graceful fallback below
      }
    }

    if (isCorrect) {
      if (hasReasoning) {
        setReasoningBonusXp((prev) => prev + 15);
      }
      setStageSolved(true);
      setFeedback({
        type: 'success',
        message: aiFeedbackText
          ? `${aiFeedbackText} ${currentStage.explanation}`
          : currentStage.explanation,
      });
    } else {
      setFeedback({
        type: 'retry',
        message:
          aiFeedbackText ||
          'Bu seçim tam uyğun gəlmədi, lakin narahat olmayın! Təcrübə müşahidələrini bir daha nəzərdən keçirin və başqa bir variantı sınayın.',
      });
    }

    setCheckingAnswer(false);
  };

  const handleNextStageOrFinish = () => {
    if (stageIndex < mystery.stages.length - 1) {
      setStageIndex((prev) => prev + 1);
      setSelectedOption(null);
      setReasoningText('');
      setStageSolved(false);
      setFeedback(null);
      setRevealedHints([]);
    } else {
      const summary = onComplete(mystery, hintsUsed, reasoningBonusXp);
      setCompletionSummary(summary);
    }
  };

  if (completionSummary) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="glass-panel-elevated rounded-3xl p-6 sm:p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 glow-cyan">
            <ShieldCheck className="h-8 w-8" />
          </div>

          <h2 className="mt-5 font-display text-3xl font-bold text-white">
            Hadisə uğurla açıldı!
          </h2>
          <p className="mt-2 text-slate-300 text-base">
            “{mystery.title}” üzrə bütün elmi sübutları düzgün təhlil etdiniz.
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <span className="text-xs text-slate-400">Qazanılan XP</span>
              <p className="mt-1 font-mono text-2xl font-bold text-cyan-300 tabular-nums">
                +{completionSummary.totalEarnedXp}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <span className="text-xs text-slate-400">Xal artımı</span>
              <p className="mt-1 font-mono text-2xl font-bold text-violet-300 tabular-nums">
                +{completionSummary.totalEarnedScore}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <span className="text-xs text-slate-400">İstifadə olunan ipucu</span>
              <p className="mt-1 font-mono text-2xl font-bold text-slate-100 tabular-nums">
                {hintsUsed}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <span className="text-xs text-slate-400">İpucusuz bonus</span>
              <p className="mt-1 font-mono text-2xl font-bold text-emerald-300 tabular-nums">
                {hintsUsed === 0 ? '+40 XP' : '0 XP'}
              </p>
            </div>
          </div>

          {completionSummary.newlyUnlocked.length > 0 && (
            <div className="mt-6 rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5 text-left">
              <div className="flex items-center gap-2 text-sm font-semibold text-violet-200">
                <Award className="h-4 w-4 text-violet-300" />
                <span>Yeni nailiyyətlər açıldı</span>
              </div>
              <ul className="mt-3 space-y-2">
                {completionSummary.newlyUnlocked.map((achId) => {
                  const ach = ACHIEVEMENTS.find((item) => item.id === achId);
                  if (!ach) return null;
                  return (
                    <li
                      key={ach.id}
                      className="flex items-center justify-between text-sm text-slate-200"
                    >
                      <span className="font-medium">{ach.title}</span>
                      <span className="font-mono text-xs text-cyan-300">
                        +{ach.xpBonus} XP
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all"
            >
              <span>Digər hadisələrə qayıt</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  const defaultColors =
    mystery.experiments[0]?.vesselColorsBefore || ['#CBD5E1', '#CBD5E1', '#CBD5E1'];
  const defaultLabels =
    mystery.experiments[0]?.vesselLabels || ['Qab A', 'Qab B', 'Qab C'];

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
      {/* Top Investigation Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Hadisələrə qayıt</span>
          </button>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white text-balance">
            {mystery.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="text-cyan-300 font-medium">{mystery.category}</span>
            <span aria-hidden="true">·</span>
            <span>{mystery.difficulty} səviyyə</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{mystery.xpReward} XP</span>
            {mystery.isDaily && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-violet-300 font-medium">Günün kimya sirri</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono tabular-nums text-slate-300">
          <span>
            Mərhələ {stageIndex + 1} / {mystery.stages.length}
          </span>
          <span aria-hidden="true">·</span>
          <span>İpucu: {hintsUsed}</span>
        </div>
      </div>

      {/* Main Split Investigation Workspace */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone: Storyline, Clues & Interactive Lab Bench */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mystery Scenario */}
          <div className="glass-panel rounded-2xl p-5 sm:p-6">
            <h2 className="font-display text-lg font-semibold text-white">
              Hadisənin təsviri
            </h2>
            <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-slate-300">
              {mystery.storyline}
            </p>
          </div>

          {/* Interactive Lab Bench */}
          <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-semibold text-white flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-cyan-300" />
                  <span>İnteraktiv təcrübə masası</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Reaktivləri sınaqdan keçirin və nəticələri müşahidə edin.
                </p>
              </div>
              {activeExperiment && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveExperiment(null);
                    setIsReacting(false);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Masayı sıfırla</span>
                </button>
              )}
            </div>

            <LabVesselAnimation
              vesselLabels={
                activeExperiment ? activeExperiment.vesselLabels : defaultLabels
              }
              vesselColors={
                activeExperiment && isReacting
                  ? activeExperiment.vesselColorsAfter
                  : activeExperiment
                  ? activeExperiment.vesselColorsBefore
                  : defaultColors
              }
              activeEffect={activeExperiment?.visualEffect || null}
              isReacting={isReacting}
            />

            {/* Interactive Experiment Buttons */}
            <div className="flex flex-wrap gap-2.5">
              {mystery.experiments.map((exp) => {
                const isSelected = activeExperiment?.id === exp.id;
                const alreadyRun = experimentsRunIds.includes(exp.id);
                return (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => handleRunExperiment(exp)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/60 shadow-md shadow-cyan-500/10'
                        : alreadyRun
                        ? 'bg-slate-800/80 text-slate-200 border border-slate-700 hover:border-cyan-400/40'
                        : 'bg-slate-900/90 text-slate-200 border border-slate-700/80 hover:border-cyan-400/50 hover:text-cyan-200'
                    }`}
                  >
                    <FlaskConical className="h-4 w-4 text-cyan-400" />
                    <span>{exp.actionLabel}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={handleRequestHint}
                disabled={loadingHint}
                className="inline-flex items-center gap-2 rounded-xl border border-violet-500/40 bg-violet-500/10 px-4 py-2.5 text-sm font-semibold text-violet-200 hover:bg-violet-500/20 transition-all whitespace-nowrap shrink-0"
              >
                {loadingHint ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Lightbulb className="h-4 w-4 text-violet-300" />
                )}
                <span>İpucu al</span>
              </button>
            </div>

            {/* Experiment Observation Result */}
            {activeExperiment && (
              <div className="rounded-xl border border-cyan-500/25 bg-[#081020] p-4 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-cyan-300">
                    Reaktiv: {activeExperiment.reagentName}
                  </span>
                  <span className="font-mono text-slate-300">
                    {activeExperiment.measuredMetric}
                  </span>
                </div>
                <p className="text-sm text-slate-100 leading-relaxed">
                  <strong className="text-white">Müşahidə:</strong>{' '}
                  {activeExperiment.observation}
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  <strong className="text-cyan-200">Elmi izah:</strong>{' '}
                  {activeExperiment.scientificReasoning}
                </p>
              </div>
            )}
          </div>

          {/* Forensic Clues Checklist */}
          <div className="glass-panel rounded-2xl p-5 sm:p-6">
            <h2 className="font-display text-lg font-semibold text-white flex items-center gap-2">
              <Eye className="h-5 w-5 text-violet-300" />
              <span>Detektiv ipucuları ({mystery.clues.length})</span>
            </h2>
            <ul className="mt-3.5 space-y-2.5">
              {mystery.clues.map((clue, idx) => {
                const checked = checkedClues.includes(idx);
                return (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => toggleClue(idx)}
                      className={`w-full flex items-start gap-3 rounded-xl border p-3.5 text-left text-sm transition-colors ${
                        checked
                          ? 'border-cyan-500/30 bg-cyan-500/5 text-slate-300'
                          : 'border-slate-800 bg-slate-900/50 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <CheckCircle2
                        className={`h-4 w-4 mt-0.5 shrink-0 ${
                          checked ? 'text-cyan-400' : 'text-slate-600'
                        }`}
                      />
                      <span>{clue}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Right Zone: Question & Deduction Console */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          {currentStage && (
            <div className="glass-panel-elevated rounded-2xl p-5 sm:p-6 space-y-5">
              <div>
                <span className="text-xs font-medium text-cyan-300">
                  {currentStage.title}
                </span>
                <h2 className="mt-1.5 font-display text-xl font-bold text-white leading-snug">
                  {currentStage.question}
                </h2>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-2.5">
                {currentStage.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectOption =
                    stageSolved && idx === currentStage.correctIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={stageSolved}
                      onClick={() => {
                        setSelectedOption(idx);
                        if (feedback?.type === 'retry') setFeedback(null);
                      }}
                      className={`w-full flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                        isCorrectOption
                          ? 'border-emerald-400/70 bg-emerald-500/15 text-emerald-100 font-semibold'
                          : isSelected
                          ? 'border-cyan-400/70 bg-cyan-500/15 text-white font-medium'
                          : 'border-slate-700/80 bg-slate-900/60 text-slate-200 hover:border-slate-600'
                      }`}
                    >
                      <span className="font-mono text-xs mt-0.5 text-slate-400 shrink-0">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Optional Reasoning Explanation */}
              {!stageSolved && (
                <div>
                  <label
                    htmlFor="reasoning-input"
                    className="block text-xs font-medium text-slate-300 mb-1.5"
                  >
                    Məntiqini izah et (istəyə bağlı · +15 bonus XP)
                  </label>
                  <textarea
                    id="reasoning-input"
                    rows={2}
                    maxLength={400}
                    value={reasoningText}
                    onChange={(e) => setReasoningText(e.target.value)}
                    placeholder="Niyə bu nəticəyə gəldiyinizi qısaca yazın..."
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-900/70 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>
              )}

              {/* Progressive Hints Display */}
              {revealedHints.length > 0 && (
                <div className="space-y-2 rounded-xl border border-violet-500/30 bg-violet-500/10 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-200">
                    <HelpCircle className="h-4 w-4 text-violet-300" />
                    <span>Oyun ustasının ipucları</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-200 leading-relaxed">
                    {revealedHints.map((hint, hIdx) => (
                      <li key={hIdx}>
                        {hIdx + 1}. {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Immediate Feedback Banner */}
              {feedback && (
                <div
                  className={`rounded-xl border p-4 text-sm leading-relaxed ${
                    feedback.type === 'success'
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
                      : 'border-amber-500/40 bg-amber-500/10 text-amber-100'
                  }`}
                >
                  <p className="font-semibold mb-1">
                    {feedback.type === 'success'
                      ? 'Əla nəticə, Detektiv!'
                      : 'Yenidən düşünək:'}
                  </p>
                  <p>{feedback.message}</p>
                </div>
              )}

              {/* Primary Stage Action */}
              {!stageSolved ? (
                <button
                  type="button"
                  disabled={selectedOption === null || checkingAnswer}
                  onClick={handleCheckAnswer}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 disabled:opacity-50 transition-all"
                >
                  {checkingAnswer ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Təhlil edilir...</span>
                    </>
                  ) : (
                    <span>Cavabı yoxla</span>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextStageOrFinish}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
                >
                  <span>
                    {stageIndex < mystery.stages.length - 1
                      ? 'Növbəti mərhələyə keç'
                      : 'Hadisəni tamamla'}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
