import React, { useState } from 'react';
import { TelemetryObject } from '../types/nasa';
import { ShieldAlert, Compass, Play, Pause, RotateCcw } from 'lucide-react';

interface OrbitalRadarProps {
  data: TelemetryObject[];
  onSelectNeo: (neo: TelemetryObject) => void;
}

export const OrbitalRadar: React.FC<OrbitalRadarProps> = ({ data, onSelectNeo }) => {
  const [maxRadiusLd, setMaxRadiusLd] = useState<number>(20);
  const [hoveredNeo, setHoveredNeo] = useState<TelemetryObject | null>(null);

  const size = 520;
  const center = size / 2;
  const radarRadius = size * 0.44;

  // Concentric distance rings
  const rings = [
    { ld: 1, label: '1 LD (Moon Orbit ~384,400 km)', color: '#38bdf8' },
    { ld: 5, label: '5 LD (~1.92M km)', color: '#1e3a8a' },
    { ld: 10, label: '10 LD (~3.84M km)', color: '#1e293b' },
    { ld: 19.5, label: '0.05 AU (PHA Danger Threshold)', color: '#ef4444' }
  ];

  // Distribute asteroids around radial polar coordinates based on miss distance
  const radarObjects = data.map((neo, idx) => {
    // Distance mapped to radius
    const ratio = Math.min(1, neo.missDistanceLunar / maxRadiusLd);
    const r = ratio * radarRadius;

    // Distribute angles deterministically using asteroid ID hash
    const seed = neo.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const angle = ((seed * 47 + idx * 73) % 360) * (Math.PI / 180);

    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);

    return {
      neo,
      x,
      y,
      r,
      angle
    };
  });

  return (
    <div className="bg-[#091122]/95 border border-cyan-900/40 rounded-xl p-5 shadow-2xl backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              Cosmic Close-Approach Radar & Proximity Horizon
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
              Earth Perigee View
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Radial distance from center corresponds to flyby miss distance in Lunar Distances (1 LD = 384,400 km).
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Horizon Range:</span>
          <div className="flex gap-1 bg-[#060c18] p-1 rounded-lg border border-cyan-900/40">
            {[5, 10, 20, 40].map((ld) => (
              <button
                key={ld}
                onClick={() => setMaxRadiusLd(ld)}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  maxRadiusLd === ld
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'text-slate-400 hover:text-cyan-300'
                }`}
              >
                {ld} LD
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar Canvas */}
        <div className="lg:col-span-8 flex justify-center relative">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-full max-w-[480px] h-auto bg-[#040814] rounded-full border border-cyan-900/60 shadow-[0_0_50px_rgba(6,182,212,0.08)] select-none"
          >
            <defs>
              <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#083344" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#082f49" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background Grid Circles */}
            <circle cx={center} cy={center} r={radarRadius} fill="url(#radarSweep)" stroke="#0e244d" strokeWidth="1.5" />

            {/* Radar Crosshairs */}
            <line x1={center - radarRadius} y1={center} x2={center + radarRadius} y2={center} stroke="#0e244d" strokeWidth="1" strokeDasharray="2 4" />
            <line x1={center} y1={center - radarRadius} x2={center} y2={center + radarRadius} stroke="#0e244d" strokeWidth="1" strokeDasharray="2 4" />

            {/* Concentric Lunar Distance Rings */}
            {rings.map((ring, idx) => {
              if (ring.ld > maxRadiusLd) return null;
              const r = (ring.ld / maxRadiusLd) * radarRadius;
              return (
                <g key={idx}>
                  <circle
                    cx={center}
                    cy={center}
                    r={r}
                    fill="none"
                    stroke={ring.color}
                    strokeWidth={ring.ld === 1 ? 1.5 : 1}
                    strokeDasharray={ring.ld === 1 ? '4 3' : '2 4'}
                    opacity={ring.ld === 1 ? 0.7 : 0.4}
                  />
                  <text
                    x={center + 6}
                    y={center - r + 12}
                    fill={ring.color}
                    fontSize="9"
                    fontFamily="monospace"
                    opacity={0.8}
                  >
                    {ring.label}
                  </text>
                </g>
              );
            })}

            {/* Earth Center Body */}
            <circle cx={center} cy={center} r={10} fill="#38bdf8" stroke="#0284c7" strokeWidth="2" className="animate-pulse" />
            <circle cx={center} cy={center} r={18} fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.3" />
            <text x={center} y={center + 24} textAnchor="middle" fill="#7dd3fc" fontSize="10" fontFamily="monospace" fontWeight="bold">
              EARTH
            </text>

            {/* Plot Asteroids */}
            {radarObjects.map(({ neo, x, y }) => {
              const isHazard = neo.hazardous;
              const isSelected = hoveredNeo?.id === neo.id;
              const ptSize = isHazard ? 6 : 4;

              return (
                <g
                  key={neo.id}
                  className="cursor-pointer"
                  onClick={() => onSelectNeo(neo)}
                  onMouseEnter={() => setHoveredNeo(neo)}
                  onMouseLeave={() => setHoveredNeo(null)}
                >
                  {isHazard && (
                    <circle
                      cx={x}
                      cy={y}
                      r={ptSize + 6}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                      className="animate-spin origin-center"
                    />
                  )}

                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? ptSize + 3 : ptSize}
                    fill={isHazard ? '#ef4444' : '#22d3ee'}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 2 : 1}
                  />

                  {/* Velocity vector line pointing tangential to Earth */}
                  <line
                    x1={x}
                    y1={y}
                    x2={x + Math.cos(neo.velocityKmh) * 12}
                    y2={y + Math.sin(neo.velocityKmh) * 12}
                    stroke={isHazard ? '#f87171' : '#67e8f9'}
                    strokeWidth="1"
                    opacity="0.6"
                  />

                  {/* Name label */}
                  {(isHazard || isSelected) && (
                    <text
                      x={x + 9}
                      y={y + 3}
                      fill={isHazard ? '#fca5a5' : '#a5f3fc'}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {neo.name.replace(/[()]/g, '')}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Radar Info / Inspection Side Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#060c18] border border-cyan-900/40 rounded-xl p-4">
            <h4 className="text-xs font-bold text-cyan-300 uppercase font-mono tracking-wider mb-2 flex items-center gap-1.5">
              <span>🎯</span> Proximity Horizon Metrics
            </h4>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Moon Orbit (1 LD):</span>
                <span className="font-mono text-cyan-300">384,400 km</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Global PHA Threshold:</span>
                <span className="font-mono text-red-300">0.05 AU (~19.5 LD)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Within Moon Orbit:</span>
                <span className="font-mono font-bold text-amber-300">
                  {data.filter(d => d.missDistanceLunar < 1).length} Objects
                </span>
              </div>
            </div>
          </div>

          {/* Active Highlight Target Card */}
          {hoveredNeo ? (
            <div className="bg-[#060c18] border border-cyan-500/40 rounded-xl p-4 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-400">Acquired Target</span>
                {hoveredNeo.hazardous ? (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-300 border border-red-500/40 font-bold flex items-center gap-1">
                    <ShieldAlert className="w-2.5 h-2.5" />
                    PHA RISK
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    SAFE
                  </span>
                )}
              </div>
              <h5 className="font-bold text-white font-mono text-sm">{hoveredNeo.name}</h5>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1 text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-400 block">Miss Distance:</span>
                  <span className="text-cyan-300 font-bold">{hoveredNeo.missDistanceLunar.toFixed(2)} LD</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Velocity:</span>
                  <span className="text-amber-300 font-bold">{hoveredNeo.velocityKmh.toLocaleString()} km/h</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Diameter Max:</span>
                  <span className="text-white">{hoveredNeo.diameterMaxM} m</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Est. Impact Energy:</span>
                  <span className="text-white">{hoveredNeo.kineticEnergyMt} Mt</span>
                </div>
              </div>
              <button
                onClick={() => onSelectNeo(hoveredNeo)}
                className="w-full mt-2 py-1.5 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 text-xs font-mono text-center transition-colors"
              >
                Inspect Telemetry Dossier →
              </button>
            </div>
          ) : (
            <div className="bg-[#060c18]/60 border border-cyan-950 rounded-xl p-4 text-center text-slate-400 text-xs font-mono">
              Hover over or click any radar target to isolate orbital vectors.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
