import React, { useMemo, useState } from 'react';
import {
  Beaker,
  CheckCircle2,
  FlaskConical,
  Info,
  RotateCcw,
  ShieldAlert,
  Thermometer,
} from 'lucide-react';
import { SAFE_LAB_REACTIONS, SAFE_LAB_REAGENTS } from '../data/labExperiments';
import { SafeLabReaction, SafeLabReagent } from '../types/chemquest';
import { LabVesselAnimation } from './LabVesselAnimation';

interface VirtualLabProps {
  triedExperimentIds: string[];
  onRecordLabExperiment: (reactionId: string) => void;
}

function findMatchingReaction(
  reagentA: SafeLabReagent,
  reagentB: SafeLabReagent
): SafeLabReaction | null {
  return (
    SAFE_LAB_REACTIONS.find(
      (r) =>
        (r.reagentAId === reagentA.id && r.reagentBId === reagentB.id) ||
        (r.reagentAId === reagentB.id && r.reagentBId === reagentA.id)
    ) || null
  );
}

export const VirtualLab: React.FC<VirtualLabProps> = ({
  triedExperimentIds,
  onRecordLabExperiment,
}) => {
  const [reagentAId, setReagentAId] = useState<string>('citric_acid');
  const [reagentBId, setReagentBId] = useState<string>('baking_soda');
  const [temperature, setTemperature] = useState<number>(25);
  const [hasMixed, setHasMixed] = useState<boolean>(false);
  const [phMeasured, setPhMeasured] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  const reagentA = useMemo(
    () => SAFE_LAB_REAGENTS.find((r) => r.id === reagentAId) || SAFE_LAB_REAGENTS[0],
    [reagentAId]
  );
  const reagentB = useMemo(
    () => SAFE_LAB_REAGENTS.find((r) => r.id === reagentBId) || SAFE_LAB_REAGENTS[1],
    [reagentBId]
  );

  const matchedReaction = useMemo(
    () => findMatchingReaction(reagentA, reagentB),
    [reagentA, reagentB]
  );

  const mixedPh = useMemo(() => {
    if (matchedReaction) return matchedReaction.resultPh;
    return Number(((reagentA.ph + reagentB.ph) / 2).toFixed(1));
  }, [matchedReaction, reagentA, reagentB]);

  const handleMix = () => {
    setHasMixed(true);
    setPhMeasured(true);
    const id = matchedReaction ? matchedReaction.id : `${reagentA.id}_${reagentB.id}`;
    onRecordLabExperiment(id);
  };

  const handleReset = () => {
    setHasMixed(false);
    setPhMeasured(false);
    setTemperature(25);
  };

  const vesselColors = hasMixed
    ? [
        reagentA.color,
        matchedReaction ? matchedReaction.resultColor : reagentA.color,
        reagentB.color,
      ]
    : [reagentA.color, '#1E293B', reagentB.color];

  const vesselLabels = [
    reagentA.formula,
    hasMixed ? 'Qarışıq qabı' : 'Boş qarışıq qabı',
    reagentB.formula,
  ];

  const activeEffect = hasMixed
    ? matchedReaction?.effect || 'ph_scan'
    : null;

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Banner Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/90 bg-[#0A1122]">
        {!imageError ? (
          <img
            src="/src/assets/images/virtual_lab_bench_1795348811914.jpg"
            alt="Virtual kimya laboratoriyası masası"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="h-48 sm:h-56 w-full object-cover opacity-50"
          />
        ) : (
          <div className="h-48 sm:h-56 w-full bg-gradient-to-r from-[#0A162E] via-[#131836] to-[#0B1120]" />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#060A13] via-[#060A13]/75 to-transparent"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-white">
            Kimya laboratoriyası
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm sm:text-base text-slate-300">
            Təhlükəsiz virtual reaktivləri birləşdirin, indikator rəng dəyişimlərini izləyin və pH göstəricilərini təhlil edin.
          </p>
        </div>
      </div>

      {/* Educational Safety Callout */}
      <div className="flex items-start gap-3 rounded-2xl border border-cyan-500/25 bg-cyan-500/5 px-4 py-3.5 text-sm text-cyan-100">
        <ShieldAlert className="h-5 w-5 text-cyan-300 shrink-0 mt-0.5" />
        <p>
          Bu bölmədəki bütün reaksiyalar təhlükəsiz təhsil simulyasiyasıdır. Real həyatda naməlum məişət və ya laboratoriya kimyəvi maddələrini özbaşına qarışdırmayın.
        </p>
      </div>

      {/* Main Interactive Bench Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Controls: Reagent Selection & Temperature */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-5 sm:p-6 space-y-5">
          <div>
            <h2 className="font-display text-lg font-semibold text-white flex items-center gap-2">
              <Beaker className="h-5 w-5 text-cyan-300" />
              <span>Reaktiv seçimi</span>
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Qarışdırmaq üçün iki təhlükəsiz maddə seçin.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="reagent-a-select"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Birinci maddə (Reaktiv A)
              </label>
              <select
                id="reagent-a-select"
                value={reagentAId}
                onChange={(e) => {
                  setReagentAId(e.target.value);
                  setHasMixed(false);
                }}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900 px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
              >
                {SAFE_LAB_REAGENTS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.formula})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-slate-400">{reagentA.description}</p>
            </div>

            <div>
              <label
                htmlFor="reagent-b-select"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                İkinci maddə (Reaktiv B)
              </label>
              <select
                id="reagent-b-select"
                value={reagentBId}
                onChange={(e) => {
                  setReagentBId(e.target.value);
                  setHasMixed(false);
                }}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900 px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
              >
                {SAFE_LAB_REAGENTS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.formula})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-slate-400">{reagentB.description}</p>
            </div>

            {/* Temperature Control Slider with explicit unit */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="flex items-center gap-1.5 font-medium text-slate-200">
                  <Thermometer className="h-4 w-4 text-cyan-300" />
                  <span>Məhlul temperaturu</span>
                </span>
                <span className="font-mono font-semibold text-cyan-300 tabular-nums">
                  {temperature} °C
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={80}
                step={5}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                aria-label="Məhlul temperaturu"
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-[11px] font-mono text-slate-500">
                <span>20 °C</span>
                <span>50 °C</span>
                <span>80 °C</span>
              </div>
            </div>
          </div>

          {/* Interactive Actions */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleMix}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all whitespace-nowrap"
            >
              <FlaskConical className="h-4 w-4" />
              <span>Reaksiyanı başlat</span>
            </button>
            <button
              type="button"
              onClick={() => setPhMeasured(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 text-sm font-medium text-slate-200 hover:border-cyan-400/50 transition-colors whitespace-nowrap"
            >
              <span>pH ölç</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              aria-label="Laboratoriyanı təmizlə"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Sınaqdan keçirilmiş təcrübələr:</span>
            <span className="font-mono font-semibold text-cyan-300 tabular-nums">
              {triedExperimentIds.length} / {SAFE_LAB_REACTIONS.length}
            </span>
          </div>
        </div>

        {/* Right Stage: Live Vessel Animation & Scientific Output */}
        <div className="lg:col-span-7 space-y-5">
          <LabVesselAnimation
            vesselLabels={vesselLabels}
            vesselColors={vesselColors}
            activeEffect={activeEffect}
            isReacting={hasMixed}
          />

          {/* Digital pH Readout Bar */}
          <div className="glass-panel rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-400">Rəqəmsal pH Analizatoru</span>
                <p className="font-mono text-2xl font-bold text-white tabular-nums mt-0.5">
                  {phMeasured ? `pH ${mixedPh.toFixed(1)}` : 'pH --.-'}
                </p>
              </div>
              <div className="text-right text-xs text-slate-300">
                {phMeasured ? (
                  <span>
                    {mixedPh < 6.5
                      ? 'Mühit: Turş (pH < 7)'
                      : mixedPh > 7.5
                      ? 'Mühit: Qələvi (pH > 7)'
                      : 'Mühit: Neytral (pH ≈ 7)'}
                  </span>
                ) : (
                  <span className="text-slate-500">Ölçmək üçün “pH ölç” seçin</span>
                )}
              </div>
            </div>
            <div className="mt-3 h-2.5 w-full rounded-full bg-gradient-to-r from-rose-500 via-emerald-400 to-violet-500 relative overflow-hidden">
              {phMeasured && (
                <div
                  className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_8px_#fff] transition-all duration-500"
                  style={{ left: `${Math.min(98, Math.max(1, (mixedPh / 14) * 100))}%` }}
                />
              )}
            </div>
            <div className="mt-1.5 flex justify-between font-mono text-[11px] text-slate-500">
              <span>0 (Güclü turşu)</span>
              <span>7 (Neytral)</span>
              <span>14 (Güclü qələvi)</span>
            </div>
          </div>

          {/* Reaction Result Card */}
          {hasMixed ? (
            matchedReaction ? (
              <div className="glass-panel-elevated rounded-2xl p-5 sm:p-6 space-y-3.5">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Kimyəvi reaksiya qeydə alındı ({temperature} °C)</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  {matchedReaction.title}
                </h3>
                <div className="rounded-xl bg-[#050914] border border-slate-800 px-4 py-3 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto">
                  {matchedReaction.equation}
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  <strong className="text-white">Müşahidə:</strong>{' '}
                  {matchedReaction.observation}
                  {temperature >= 55 &&
                    ' Yüksək temperatur molekulların toqquşma sürətini artırdığı üçün reaksiya daha sürətlə baş verdi.'}
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  <strong className="text-cyan-200">Elmi izah:</strong>{' '}
                  {matchedReaction.scientificExplanation}
                </p>
                <p className="text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <strong className="text-slate-200">Gündəlik həyatda nümunə:</strong>{' '}
                  {matchedReaction.everydayExample}
                </p>
              </div>
            ) : (
              <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-2.5">
                <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold">
                  <Info className="h-4 w-4" />
                  <span>Fiziki qarışıq müşahidəsi</span>
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  {reagentA.id === reagentB.id
                    ? 'Eyni maddələr qarışdırıldı'
                    : 'Görünən yeni kimyəvi reaksiya baş vermədi'}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {reagentA.name} və {reagentB.name} bu şəraitdə bir-biri ilə yeni çöküntü, qaz və ya indikator rəng dəyişimi yaratmır. Başqa bir kombinasiya (məsələn, Limon turşusu + Çay sodası və ya Mis(II) sulfat + Dəmir tozu) sınayın.
                </p>
              </div>
            )
          ) : (
            <div className="glass-panel rounded-2xl p-5 sm:p-6">
              <p className="text-sm text-slate-300">
                Soldan iki reaktiv seçib <strong className="text-white">“Reaksiyanı başlat”</strong> düyməsini sıxın. Tövsiyə olunan təhlükəsiz təcrübələr:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SAFE_LAB_REACTIONS.slice(0, 4).map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setReagentAId(preset.reagentAId);
                      setReagentBId(preset.reagentBId);
                      setHasMixed(false);
                    }}
                    className="rounded-xl border border-slate-700/80 bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-cyan-400/50 hover:text-cyan-200 transition-colors"
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
