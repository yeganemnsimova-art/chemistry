import { useEffect, useMemo, useState } from 'react';
import { ACHIEVEMENTS } from './data/achievements';
import { PRELOADED_CASES, getDailyMysteryCase } from './data/cases';
import {
  DEFAULT_PROGRESS,
  evaluateUnlockedAchievements,
  loadDetectiveProgress,
  recordCaseCompletion,
  saveDetectiveProgress,
} from './utils/storage';
import {
  CaseCategory,
  DetectiveProgress,
  DifficultyLevel,
  MysteryCase,
} from './types/chemquest';
import { ActiveTab, Navbar } from './components/Navbar';
import { DashboardHome } from './components/DashboardHome';
import { CasesCatalog } from './components/CasesCatalog';
import { CaseInvestigator } from './components/CaseInvestigator';
import { VirtualLab } from './components/VirtualLab';
import { AchievementsView } from './components/AchievementsView';
import { AiCaseModal } from './components/AiCaseModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeCase, setActiveCase] = useState<MysteryCase | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CaseCategory | 'Hamısı'>('Hamısı');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'Hamısı'>('Hamısı');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(true);

  const [progress, setProgress] = useState<DetectiveProgress>(() =>
    loadDetectiveProgress()
  );

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data?.aiAvailable === 'boolean') {
          setAiAvailable(data.aiAvailable);
        }
      })
      .catch(() => {
        setAiAvailable(false);
      });
  }, []);

  const allCases = useMemo(
    () => [...progress.customCases, ...PRELOADED_CASES],
    [progress.customCases]
  );

  const dailyCase = useMemo(
    () => getDailyMysteryCase(PRELOADED_CASES),
    []
  );

  const solvedCaseIds = useMemo(
    () => new Set(progress.solvedCases.map((c) => c.caseId)),
    [progress.solvedCases]
  );

  const handleOpenCase = (mystery: MysteryCase) => {
    setActiveCase(mystery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartNextMystery = () => {
    const unsolved = allCases.find((c) => !solvedCaseIds.has(c.id));
    handleOpenCase(unsolved || allCases[0]);
  };

  const handleCompleteCase = (
    mystery: MysteryCase,
    hintsUsed: number,
    bonusXpFromReasoning: number
  ) => {
    const result = recordCaseCompletion(
      progress,
      mystery,
      hintsUsed,
      bonusXpFromReasoning
    );

    let extraAchievementXp = 0;
    for (const achId of result.newlyUnlocked) {
      const def = ACHIEVEMENTS.find((a) => a.id === achId);
      if (def) extraAchievementXp += def.xpBonus;
    }

    const finalProgress: DetectiveProgress =
      extraAchievementXp > 0
        ? {
            ...result.nextProgress,
            xp: result.nextProgress.xp + extraAchievementXp,
          }
        : result.nextProgress;

    saveDetectiveProgress(finalProgress);
    setProgress(finalProgress);

    return {
      newlyUnlocked: result.newlyUnlocked,
      totalEarnedXp: result.totalEarnedXp + extraAchievementXp,
      totalEarnedScore: result.totalEarnedScore,
    };
  };

  const handleAiCaseCreated = (newCase: MysteryCase) => {
    const draft: DetectiveProgress = {
      ...progress,
      customCases: [newCase, ...progress.customCases],
    };
    const updatedAchievements = evaluateUnlockedAchievements(draft);
    const next: DetectiveProgress = {
      ...draft,
      unlockedAchievements: updatedAchievements,
    };
    saveDetectiveProgress(next);
    setProgress(next);
    handleOpenCase(newCase);
  };

  const handleRecordLabExperiment = (reactionId: string) => {
    if (progress.labExperimentsTried.includes(reactionId)) return;
    const draft: DetectiveProgress = {
      ...progress,
      labExperimentsTried: [...progress.labExperimentsTried, reactionId],
      xp: progress.xp + 15,
      score: progress.score + 20,
    };
    const updatedAchievements = evaluateUnlockedAchievements(draft);
    const next: DetectiveProgress = {
      ...draft,
      unlockedAchievements: updatedAchievements,
    };
    saveDetectiveProgress(next);
    setProgress(next);
  };

  const handleResetProgress = () => {
    saveDetectiveProgress(DEFAULT_PROGRESS);
    setProgress(DEFAULT_PROGRESS);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060A13] text-slate-100 relative overflow-x-hidden">
      {/* Subtle atmospheric dark navy + cyan/violet radial backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 65% 45% at 15% 0%, rgba(6, 182, 212, 0.12), transparent 60%), radial-gradient(ellipse 55% 40% at 85% 10%, rgba(139, 92, 246, 0.12), transparent 60%)',
        }}
      />

      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveCase(null);
          setActiveTab(tab);
        }}
        onOpenAiModal={() => setAiModalOpen(true)}
      />

      <main className="relative z-10 flex-1 pb-12">
        {activeCase ? (
          <CaseInvestigator
            key={activeCase.id}
            mystery={activeCase}
            aiAvailable={aiAvailable}
            onBack={() => setActiveCase(null)}
            onComplete={handleCompleteCase}
          />
        ) : activeTab === 'home' ? (
          <DashboardHome
            progress={progress}
            allCases={allCases}
            dailyCase={dailyCase}
            onStartNextMystery={handleStartNextMystery}
            onOpenCase={handleOpenCase}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setSelectedDifficulty('Hamısı');
              setActiveTab('cases');
            }}
            onOpenAiModal={() => setAiModalOpen(true)}
            onOpenLab={() => setActiveTab('lab')}
            onOpenAchievements={() => setActiveTab('achievements')}
          />
        ) : activeTab === 'cases' ? (
          <CasesCatalog
            allCases={allCases}
            solvedCaseIds={solvedCaseIds}
            selectedCategory={selectedCategory}
            selectedDifficulty={selectedDifficulty}
            onSelectCategory={setSelectedCategory}
            onSelectDifficulty={setSelectedDifficulty}
            onOpenCase={handleOpenCase}
            onOpenAiModal={() => setAiModalOpen(true)}
          />
        ) : activeTab === 'lab' ? (
          <VirtualLab
            triedExperimentIds={progress.labExperimentsTried}
            onRecordLabExperiment={handleRecordLabExperiment}
          />
        ) : (
          <AchievementsView
            progress={progress}
            onResetProgress={handleResetProgress}
          />
        )}
      </main>

      <footer className="relative z-10 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2">
          <span>ChemQuest — Kimya Detektivi</span>
          <span>Bütün laboratoriya təcrübələri təhlükəsiz təhsil simulyasiyasıdır.</span>
        </div>
      </footer>

      <AiCaseModal
        isOpen={aiModalOpen}
        aiAvailable={aiAvailable}
        onClose={() => setAiModalOpen(false)}
        onCaseCreated={handleAiCaseCreated}
      />
    </div>
  );
}
