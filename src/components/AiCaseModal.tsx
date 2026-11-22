import React, { useState } from 'react';
import { Loader2, Sparkles, X } from 'lucide-react';
import { CASE_CATEGORIES } from '../data/cases';
import { CaseCategory, DifficultyLevel, MysteryCase } from '../types/chemquest';

interface AiCaseModalProps {
  isOpen: boolean;
  aiAvailable: boolean;
  onClose: () => void;
  onCaseCreated: (newCase: MysteryCase) => void;
}

const DIFFICULTIES: DifficultyLevel[] = ['Başlanğıc', 'Orta', 'Ekspert'];

function buildFallbackDemoCase(
  category: CaseCategory,
  difficulty: DifficultyLevel,
  customFocus: string
): MysteryCase {
  const xpMap: Record<DifficultyLevel, number> = {
    Başlanğıc: 110,
    Orta: 155,
    Ekspert: 220,
  };
  const focusNote = customFocus ? ` ("${customFocus}" mövzusu üzrə)` : '';
  return {
    id: `demo-custom-${Date.now()}`,
    title: `${category}: Laboratoriya Təhqiqatı${focusNote}`,
    category,
    difficulty,
    xpReward: xpMap[difficulty],
    estimatedMinutes: 4,
    storyline: `${category} bölməsi üzrə xüsusi hazırlanmış bu hadisədə iki oxşar görünüşlü nümunə qarışdırılıb. Qeydlər qismən zədələndiyi üçün detektiv kimi indikator və reaktiv testləri apararaq düzgün maddəni müəyyən etməlisiniz.`,
    clues: [
      'Nümunə 1 suda yaxşı həll olur və indikatorla aydın reaksiya verir.',
      'Nümunə 2 neytral xassə göstərir və temperatur dəyişikliyində sabit qalır.',
      'Təcrübə nəticələrinin ölçü göstəriciləri fərqi dərhal üzə çıxarır.',
    ],
    experiments: [
      {
        id: 'demo-exp-1',
        actionLabel: 'İndikator əlavə et',
        reagentName: 'Universal indikator',
        visualEffect: 'color_shift',
        vesselColorsBefore: ['#CBD5E1', '#CBD5E1', '#CBD5E1'],
        vesselColorsAfter: ['#22D3EE', '#A855F7', '#94A3B8'],
        vesselLabels: ['Nümunə 1', 'Nümunə 2', 'Referens'],
        observation:
          'Nümunə 1 parlaq firuzəyi-mavi, Nümunə 2 isə bənövşəyi rəng aldı.',
        scientificReasoning:
          'Universal indikator məhluldakı ion tərkibindən asılı olaraq fərqli rəng spektrləri göstərir.',
        measuredMetric: 'Nümunə 1: Aktiv reaksiya · Nümunə 2: Sabit',
      },
      {
        id: 'demo-exp-2',
        actionLabel: 'Reaksiya müşahidə et',
        reagentName: 'Təhlil reaktivi',
        visualEffect: 'bubbling',
        vesselColorsBefore: ['#CBD5E1', '#CBD5E1', '#CBD5E1'],
        vesselColorsAfter: ['#38BDF8', '#CBD5E1', '#CBD5E1'],
        vesselLabels: ['Nümunə 1 (Qaz↑)', 'Nümunə 2', 'Referens'],
        observation: 'Nümunə 1-də qaz qabarcıqları yarandı, Nümunə 2 dəyişməz qaldı.',
        scientificReasoning:
          'Qaz ayrılması kimyəvi çevrilmənin baş verdiyini sübut edən əsas əlamətlərdən biridir.',
        measuredMetric: 'Nümunə 1: Qaz ayrılması qeydə alındı',
      },
    ],
    stages: [
      {
        id: 'demo-st-1',
        title: 'Mərhələ 1: Reaktiv nəticəsinin şərhi',
        question: 'Aparılan təcrübələrə əsasən hansı nümunə kimyəvi cəhətdən aktiv reaksiya verdi?',
        options: [
          'Nümunə 1 — indikatoru dəyişdi və qaz ayırdı',
          'Nümunə 2 — heç bir dəyişiklik olmadı',
          'Referens qabı',
          'Hər iki nümunə eyni nəticə verdi',
        ],
        correctIndex: 0,
        explanation:
          'Doğrudur! Nümunə 1 həm rəng dəyişikliyi, həm də qaz ayrılması göstərərək aktiv kimyəvi xassəsini təsdiqlədi.',
        progressiveHints: [
          'Reaksiya müşahidə et təcrübəsində hansı qabda qaz qabarcıqları göründü?',
        ],
        xpBonus: 35,
      },
    ],
    isAiGenerated: true,
  };
}

export const AiCaseModal: React.FC<AiCaseModalProps> = ({
  isOpen,
  aiAvailable,
  onClose,
  onCaseCreated,
}) => {
  const [category, setCategory] = useState<CaseCategory>('Turşular və əsaslar');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Orta');
  const [customFocus, setCustomFocus] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/cases/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, difficulty, customFocus }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data?.aiUnavailable) {
          const fallbackCase = buildFallbackDemoCase(category, difficulty, customFocus);
          onCaseCreated(fallbackCase);
          onClose();
          return;
        }
        setErrorMsg(data?.error || 'Hadisə yaradılarkən xəta baş verdi.');
        setLoading(false);
        return;
      }

      if (data?.mysteryCase) {
        onCaseCreated(data.mysteryCase);
        setCustomFocus('');
        onClose();
      } else {
        setErrorMsg('Süni intellektdən gözlənilən cavab alınmadı.');
      }
    } catch {
      setErrorMsg('Serverlə əlaqə yaradılarkən xəta baş verdi. Demo rejimində yaratmağı sınaya bilərsiniz.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-modal-title"
    >
      <div className="glass-panel-elevated relative w-full max-w-xl rounded-2xl p-6 sm:p-7 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="ai-modal-title"
              className="font-display text-2xl font-bold text-white"
            >
              AI ilə öz hadisəni yarat
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Mövzu və çətinlik səviyyəsini seçin — süni intellekt sizin üçün yeni bir kimya sirri hazırlasın.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Bağla"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Kimya kateqoriyası
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CASE_CATEGORIES.map((cat) => {
                const selected = category === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`rounded-xl border px-3.5 py-2.5 text-left text-sm transition-all ${
                      selected
                        ? 'border-cyan-400/60 bg-cyan-500/15 text-cyan-200 font-semibold'
                        : 'border-slate-700/70 bg-slate-900/60 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Çətinlik səviyyəsi
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
              {DIFFICULTIES.map((level) => {
                const selected = difficulty === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`rounded-lg py-2 text-sm font-medium transition-colors ${
                      selected
                        ? 'bg-gradient-to-r from-cyan-500/25 to-violet-500/25 text-white border border-cyan-400/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="custom-focus-input"
              className="block text-sm font-medium text-slate-200 mb-2"
            >
              Xüsusi mövzu istəyi (istəyə bağlı)
            </label>
            <input
              id="custom-focus-input"
              type="text"
              maxLength={140}
              value={customFocus}
              onChange={(e) => setCustomFocus(e.target.value)}
              placeholder="Məsələn: Dəmirin paslanması, sabunlaşma və ya elektrolitlər..."
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>

          {!aiAvailable && (
            <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-200">
              Demo rejimi aktivdir: Hazırda süni intellekt açarı qoşulmadığı üçün seçdiyiniz mövzuya uyğun interaktiv demo hadisə yaradılacaq.
            </p>
          )}

          {errorMsg && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              <p>{errorMsg}</p>
              <button
                type="button"
                onClick={() => {
                  const fallback = buildFallbackDemoCase(category, difficulty, customFocus);
                  onCaseCreated(fallback);
                  onClose();
                }}
                className="mt-2 text-xs font-semibold text-cyan-300 underline hover:text-cyan-200"
              >
                Demo rejimində nümunə hadisə ilə davam et
              </button>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Ləğv et
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 hover:brightness-110 disabled:opacity-60 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Hadisə hazırlanır...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Hadisəni yarat</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
