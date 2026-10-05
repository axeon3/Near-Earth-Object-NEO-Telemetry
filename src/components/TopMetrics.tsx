import React from 'react';
import { TelemetrySummary, UnitSystem } from '../types/nasa';
import { ShieldAlert, Zap, Globe2, Gauge, Compass } from 'lucide-react';

interface TopMetricsProps {
  summary: TelemetrySummary;
  sourceLabel: string;
  isFallback: boolean;
  unitSystem?: UnitSystem;
}

export const TopMetrics: React.FC<TopMetricsProps> = ({ summary, sourceLabel, isFallback, unitSystem = 'metric' }) => {
  const isImperial = unitSystem === 'imperial';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {/* Metric 1: Total Objects Monitored */}
      <div className="bg-[#0b1426]/90 border border-cyan-900/40 rounded-xl p-4 relative overflow-hidden backdrop-blur-sm group hover:border-cyan-500/40 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs uppercase font-mono tracking-wider font-semibold text-cyan-300 flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
            Total Monitored
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
            NeoWS
          </span>
        </div>
        <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
          {summary.totalCount}
        </div>
        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
          Active trajectory signatures
        </p>
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/10 transition-all" />
      </div>

      {/* Metric 2: Potentially Hazardous (Inverse Delta High-Alert) */}
      <div className={`rounded-xl p-4 relative overflow-hidden backdrop-blur-sm border transition-all group ${
        summary.hazardousCount > 0 
          ? 'bg-red-950/20 border-red-900/50 hover:border-red-500/60 shadow-lg shadow-red-950/20' 
          : 'bg-[#0b1426]/90 border-cyan-900/40 hover:border-cyan-500/40'
      }`}>
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs uppercase font-mono tracking-wider font-semibold text-red-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            Potentially Hazardous
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800/40 font-bold">
            PHA
          </span>
        </div>
        <div className="text-3xl font-extrabold font-mono tracking-tight text-white flex items-baseline gap-2">
          {summary.hazardousCount}
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 flex items-center gap-1">
            ▲ {summary.hazardousCount} Active Risks
          </span>
        </div>
        <p className="text-[11px] text-red-300/80 mt-1">
          {summary.hazardousCount > 0 ? 'Exceeds PHA minimum distance (< 0.05 AU)' : 'No immediate intersection threats'}
        </p>
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-red-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-red-500/20 transition-all" />
      </div>

      {/* Metric 3: Peak Velocity Observed */}
      <div className="bg-[#0b1426]/90 border border-cyan-900/40 rounded-xl p-4 relative overflow-hidden backdrop-blur-sm group hover:border-cyan-500/40 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs uppercase font-mono tracking-wider font-semibold text-cyan-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Peak Velocity
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
            {isImperial ? 'mph' : 'km/h'}
          </span>
        </div>
        <div className="text-2xl font-extrabold text-white font-mono tracking-tight">
          {isImperial ? (
            <>
              {summary.peakVelocityMph.toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
              <span className="text-sm font-normal text-slate-400 font-sans">mph</span>
            </>
          ) : (
            <>
              {summary.peakVelocityKmh.toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
              <span className="text-sm font-normal text-slate-400 font-sans">km/h</span>
            </>
          )}
        </div>
        <p className="text-[11px] text-amber-400/90 font-mono mt-1">
          {isImperial 
            ? `≈ ${(summary.peakVelocityMph / 3600).toFixed(1)} mi/s (${summary.peakVelocityKmh.toLocaleString()} km/h)` 
            : `≈ ${(summary.peakVelocityKmh / 3600).toFixed(2)} km/s (${summary.peakVelocityMph.toLocaleString()} mph)`}
        </p>
      </div>

      {/* Metric 4: Closest Miss Distance */}
      <div className="bg-[#0b1426]/90 border border-cyan-900/40 rounded-xl p-4 relative overflow-hidden backdrop-blur-sm group hover:border-cyan-500/40 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs uppercase font-mono tracking-wider font-semibold text-cyan-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            Closest Approach
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/40">
            Perigee
          </span>
        </div>
        <div className="text-2xl font-extrabold text-white font-mono tracking-tight">
          {summary.closestMissLunar < 1 ? (
            <span className="text-red-400 font-bold">{summary.closestMissLunar} <span className="text-sm font-normal text-slate-300">LD</span></span>
          ) : (
            <span>{summary.closestMissLunar} <span className="text-sm font-normal text-slate-400">LD</span></span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 font-mono mt-1">
          {isImperial 
            ? `${summary.closestMissMiles.toLocaleString()} mi (${summary.closestMissKm.toLocaleString()} km)` 
            : `${summary.closestMissKm.toLocaleString()} km (${summary.closestMissMiles.toLocaleString()} mi)`}
        </p>
      </div>

      {/* Metric 5: Max Diameter */}
      <div className="bg-[#0b1426]/90 border border-cyan-900/40 rounded-xl p-4 relative overflow-hidden backdrop-blur-sm group hover:border-cyan-500/40 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs uppercase font-mono tracking-wider font-semibold text-cyan-300 flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-violet-400" />
            Max Diameter
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-950/60 text-violet-300 border border-violet-800/40">
            {isImperial ? 'ft' : 'Est. Max'}
          </span>
        </div>
        <div className="text-2xl font-extrabold text-white font-mono tracking-tight">
          {isImperial ? (
            summary.maxDiameterFt >= 5280 
              ? `${(summary.maxDiameterFt / 5280).toFixed(2)} mi` 
              : `${summary.maxDiameterFt.toLocaleString()} ft`
          ) : (
            summary.maxDiameterM >= 1000 
              ? `${(summary.maxDiameterM / 1000).toFixed(2)} km` 
              : `${summary.maxDiameterM.toFixed(0)} m`
          )}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          {isImperial
            ? `Avg: ${summary.avgDiameterFt.toLocaleString()} ft (${summary.maxDiameterM.toFixed(0)}m)`
            : `Avg: ${summary.avgDiameterM.toFixed(0)} meters (${summary.maxDiameterFt.toLocaleString()} ft)`}
        </p>
      </div>
    </div>
  );
};
