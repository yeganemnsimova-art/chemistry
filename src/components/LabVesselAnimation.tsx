import React from 'react';
import { VisualEffectType } from '../types/chemquest';

interface LabVesselAnimationProps {
  vesselLabels: string[];
  vesselColors: string[];
  activeEffect: VisualEffectType | null;
  isReacting: boolean;
}

export const LabVesselAnimation: React.FC<LabVesselAnimationProps> = ({
  vesselLabels,
  vesselColors,
  activeEffect,
  isReacting,
}) => {
  const safeLabels = vesselLabels.length >= 3 ? vesselLabels.slice(0, 3) : ['Qab A', 'Qab B', 'Qab C'];
  const safeColors =
    vesselColors.length >= 3
      ? vesselColors.slice(0, 3)
      : ['#94A3B8', '#94A3B8', '#94A3B8'];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-[#050914] p-5 sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(34,211,238,0.14), transparent 45%), radial-gradient(circle at 80% 30%, rgba(168,85,247,0.14), transparent 45%)',
        }}
      />

      <div className="relative z-10 grid grid-cols-3 gap-3 sm:gap-6 items-end pt-4 pb-2">
        {safeLabels.map((label, idx) => {
          const liquidColor = safeColors[idx] || '#94A3B8';
          const showBubbles =
            isReacting &&
            activeEffect === 'bubbling' &&
            (idx === 0 || liquidColor !== '#CBD5E1');
          const showFlame = isReacting && activeEffect === 'flame';
          const showPrecipitate = isReacting && activeEffect === 'precipitate' && idx === 0;
          const showScan = isReacting && activeEffect === 'ph_scan';
          const showConductivity = isReacting && activeEffect === 'conductivity' && idx === 0;

          return (
            <div key={label + idx} className="flex flex-col items-center">
              <div className="relative flex h-40 w-24 sm:h-44 sm:w-28 items-end justify-center">
                {/* Flame effect above / below sample */}
                {showFlame && (
                  <div
                    className="animate-flame absolute top-2 left-1/2 -translate-x-1/2 h-14 w-8 rounded-full blur-[2px]"
                    style={{
                      background: `radial-gradient(circle at 50% 70%, #ffffff 0%, ${liquidColor} 55%, transparent 85%)`,
                    }}
                  />
                )}

                {/* Conductivity spark */}
                {showConductivity && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_16px_4px_rgba(34,211,238,0.9)]" />
                    <span className="font-mono text-[11px] font-semibold text-cyan-300">
                      18.4 mS
                    </span>
                  </div>
                )}

                {/* SVG Laboratory Beaker / Flask */}
                <svg
                  viewBox="0 0 110 140"
                  className="h-36 w-full drop-shadow-[0_12px_18px_rgba(0,0,0,0.6)]"
                  aria-label={label}
                >
                  <defs>
                    <clipPath id={`beaker-clip-${idx}`}>
                      <path d="M 22 25 L 88 25 L 88 118 Q 88 128 78 128 L 32 128 Q 22 128 22 118 Z" />
                    </clipPath>
                  </defs>

                  {/* Liquid body */}
                  <g clipPath={`url(#beaker-clip-${idx})`}>
                    <rect
                      x="20"
                      y="58"
                      width="70"
                      height="74"
                      fill={liquidColor}
                      fillOpacity={0.72}
                      className="transition-all duration-700"
                    />
                    {/* Liquid meniscus highlight */}
                    <ellipse
                      cx="55"
                      cy="58"
                      rx="33"
                      ry="4.5"
                      fill={liquidColor}
                      fillOpacity={0.95}
                      className="transition-all duration-700"
                    />

                    {/* Rising gas bubbles */}
                    {showBubbles && (
                      <g>
                        <circle
                          cx="42"
                          cy="110"
                          r="3.2"
                          fill="#E0F2FE"
                          className="animate-bubble"
                        />
                        <circle
                          cx="58"
                          cy="115"
                          r="4"
                          fill="#BAE6FD"
                          className="animate-bubble"
                          style={{ animationDelay: '0.45s' }}
                        />
                        <circle
                          cx="68"
                          cy="106"
                          r="2.6"
                          fill="#FFFFFF"
                          className="animate-bubble"
                          style={{ animationDelay: '0.9s' }}
                        />
                      </g>
                    )}

                    {/* Precipitate sediment */}
                    {showPrecipitate && (
                      <g className="animate-precipitate">
                        <ellipse cx="55" cy="122" rx="28" ry="6" fill="#F8FAFC" fillOpacity="0.92" />
                        <circle cx="42" cy="108" r="2" fill="#F8FAFC" />
                        <circle cx="62" cy="112" r="2.5" fill="#F8FAFC" />
                        <circle cx="52" cy="104" r="1.8" fill="#F8FAFC" />
                      </g>
                    )}

                    {/* pH scan beam */}
                    {showScan && (
                      <line
                        x1="24"
                        y1="88"
                        x2="86"
                        y2="88"
                        stroke="#22D3EE"
                        strokeWidth="2"
                        strokeDasharray="4 3"
                      />
                    )}
                  </g>

                  {/* Glass Beaker Outline */}
                  <path
                    d="M 18 20 L 22 25 L 22 118 Q 22 128 32 128 L 78 128 Q 88 128 88 118 L 88 25 L 92 20"
                    fill="none"
                    stroke="rgba(148, 163, 184, 0.55)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Graduation Marks */}
                  <line x1="25" y1="50" x2="34" y2="50" stroke="rgba(148,163,184,0.4)" strokeWidth="1.5" />
                  <line x1="25" y1="75" x2="37" y2="75" stroke="rgba(148,163,184,0.4)" strokeWidth="1.5" />
                  <line x1="25" y1="100" x2="34" y2="100" stroke="rgba(148,163,184,0.4)" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Lab Bench Label */}
              <div className="mt-2 text-center">
                <span className="font-mono text-xs font-medium text-slate-200 block truncate max-w-[110px] sm:max-w-[140px]">
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bench reflection line */}
      <div className="mt-1 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
    </div>
  );
};
