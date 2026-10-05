import React from 'react';
import { TelemetryObject } from '../types/nasa';
import { 
  X, 
  ShieldAlert, 
  ExternalLink, 
  Globe2, 
  Zap, 
  Compass, 
  Gauge, 
  Flame, 
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Copy
} from 'lucide-react';

interface ObjectDetailModalProps {
  neo: TelemetryObject | null;
  onClose: () => void;
}

export const ObjectDetailModal: React.FC<ObjectDetailModalProps> = ({ neo, onClose }) => {
  if (!neo) return null;

  const isHazard = neo.hazardous;
  const satisfiesMoid = neo.missDistanceAU <= 0.05;
  const satisfiesMagnitude = neo.absoluteMagnitude <= 22.0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-[#091124] border border-cyan-700/50 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl text-slate-200 relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className={`p-5 border-b flex items-start justify-between ${
          isHazard ? 'bg-red-950/30 border-red-900/40' : 'bg-cyan-950/30 border-cyan-900/40'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/40 text-cyan-300 border border-cyan-800/40">
                Catalog ID: {neo.id}
              </span>
              {isHazard ? (
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  POTENTIALLY HAZARDOUS ASTEROID
                </span>
              ) : (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  NON-HAZARDOUS FLYBY
                </span>
              )}
            </div>
            <h2 className="text-2xl font-extrabold text-white font-mono tracking-wide">
              {neo.name}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Approach Date: <span className="text-cyan-300">{neo.closeApproachDateFull}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-black/40 hover:bg-black/60 border border-slate-700/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs font-mono">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#050a16] border border-cyan-950 rounded-xl p-3">
              <span className="text-slate-400 text-[10px] block">Estimated Diameter</span>
              <span className="text-base font-bold text-white block mt-1">
                {neo.diameterMaxM} m <span className="text-xs font-normal text-slate-400">({neo.diameterMaxFt?.toLocaleString() || Math.round(neo.diameterMaxM * 3.28084).toLocaleString()} ft)</span>
              </span>
              <span className="text-[10px] text-slate-500">Min: {neo.diameterMinM}m / {neo.diameterMinFt?.toLocaleString() || Math.round(neo.diameterMinM * 3.28084).toLocaleString()} ft</span>
            </div>

            <div className="bg-[#050a16] border border-cyan-950 rounded-xl p-3">
              <span className="text-slate-400 text-[10px] block">Relative Velocity</span>
              <span className="text-base font-bold text-amber-300 block mt-1">
                {neo.velocityKmh.toLocaleString()} <span className="text-[10px] font-normal">km/h</span>
              </span>
              <span className="text-[10px] text-amber-400/80">{neo.velocityMph?.toLocaleString() || Math.round(neo.velocityKmh * 0.621371).toLocaleString()} mph ({neo.velocityKms} km/s)</span>
            </div>

            <div className="bg-[#050a16] border border-cyan-950 rounded-xl p-3">
              <span className="text-slate-400 text-[10px] block">Perigee Miss Distance</span>
              <span className={`text-base font-bold block mt-1 ${neo.missDistanceLunar < 1 ? 'text-red-400' : 'text-violet-300'}`}>
                {neo.missDistanceLunar.toFixed(2)} LD
              </span>
              <span className="text-[10px] text-slate-400 block">{neo.missDistanceKm.toLocaleString()} km ({neo.missDistanceMiles?.toLocaleString() || Math.round(neo.missDistanceKm * 0.621371).toLocaleString()} mi)</span>
            </div>

            <div className="bg-[#050a16] border border-cyan-950 rounded-xl p-3">
              <span className="text-slate-400 text-[10px] block">Absolute Magnitude (H)</span>
              <span className="text-base font-bold text-cyan-200 block mt-1">
                {neo.absoluteMagnitude}
              </span>
              <span className="text-[10px] text-slate-500">Brightness index</span>
            </div>
          </div>

          {/* Planetary Defense Criteria Card */}
          <div className="bg-[#060d1e] border border-cyan-900/50 rounded-xl p-4 space-y-3 font-sans">
            <h4 className="font-bold text-sm text-cyan-200 uppercase font-mono flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              Planetary Defense Vetting Criteria
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className={`p-3 rounded-lg border flex items-start gap-2.5 ${
                satisfiesMoid 
                  ? 'bg-red-950/20 border-red-900/40 text-red-200' 
                  : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200'
              }`}>
                {satisfiesMoid ? <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                <div>
                  <strong className="block font-mono">MOID Distance ≤ 0.05 AU (~7.48M km)</strong>
                  <span className="text-[11px] opacity-80 font-mono">
                    Observed: {neo.missDistanceAU.toFixed(4)} AU ({neo.missDistanceLunar.toFixed(1)} LD). {satisfiesMoid ? 'Threshold met.' : 'Safely outside 0.05 AU.'}
                  </span>
                </div>
              </div>

              <div className={`p-3 rounded-lg border flex items-start gap-2.5 ${
                satisfiesMagnitude 
                  ? 'bg-red-950/20 border-red-900/40 text-red-200' 
                  : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200'
              }`}>
                {satisfiesMagnitude ? <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                <div>
                  <strong className="block font-mono">Absolute Magnitude H ≤ 22.0 (~140m+)</strong>
                  <span className="text-[11px] opacity-80 font-mono">
                    H = {neo.absoluteMagnitude} (Est. {neo.diameterMaxM}m). {satisfiesMagnitude ? 'Size criteria met.' : 'Below 140m threshold.'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Scale Comparison & Kinetic Energy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#050a16] border border-cyan-900/40 rounded-xl p-4 space-y-2">
              <span className="text-slate-400 uppercase text-[10px] tracking-wider block font-bold">
                Physical Scale Benchmark
              </span>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📐</span>
                <div>
                  <div className="text-white font-bold text-sm">{neo.sizeComparison}</div>
                  <div className="text-[11px] text-slate-400">
                    Max span {neo.diameterMaxM} meters (~{(neo.diameterMaxM * 3.28084).toFixed(0)} ft)
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#050a16] border border-cyan-900/40 rounded-xl p-4 space-y-2">
              <span className="text-slate-400 uppercase text-[10px] tracking-wider block font-bold">
                Kinetic Impact Energy (E = ½mv²)
              </span>
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <div className="text-amber-300 font-bold text-sm">
                    {neo.kineticEnergyMt > 0 ? `${neo.kineticEnergyMt.toLocaleString()} Megatons TNT` : '< 0.01 Megaton'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {neo.kineticEnergyMt > 15 ? 'Exceeds Tunguska event (~15 Mt)' : 'Sub-Tunguska impact scale'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Planetary Ephemeris Resources */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-cyan-950">
            <a
              href={neo.jplUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-cyan-600/30 hover:bg-cyan-500/40 text-cyan-200 border border-cyan-500/40 text-xs font-mono inline-flex items-center gap-2 transition-colors"
            >
              <span>Small-Body Database Browser</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(neo, null, 2));
              }}
              className="px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 border border-slate-700/40 text-xs font-mono inline-flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
