import React, { useState, useMemo } from 'react';
import { TelemetryObject } from '../types/nasa';
import { ShieldAlert, Crosshair, ZoomIn, Info } from 'lucide-react';

interface CosmicRiskMatrixProps {
  data: TelemetryObject[];
  onSelectNeo: (neo: TelemetryObject) => void;
}

export const CosmicRiskMatrix: React.FC<CosmicRiskMatrixProps> = ({ data, onSelectNeo }) => {
  const [hoveredNeo, setHoveredNeo] = useState<TelemetryObject | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [useLogScale, setUseLogScale] = useState(false);

  // SVG dimensions & margins
  const width = 800;
  const height = 440;
  const padding = { top: 30, right: 40, bottom: 55, left: 75 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Extents
  const { minDiameter, maxDiameter, minVelocity, maxVelocity } = useMemo(() => {
    if (data.length === 0) {
      return { minDiameter: 1, maxDiameter: 1000, minVelocity: 10000, maxVelocity: 120000 };
    }
    const diameters = data.map(d => Math.max(1, d.diameterMaxM));
    const velocities = data.map(d => d.velocityKmh);
    return {
      minDiameter: Math.min(...diameters),
      maxDiameter: Math.max(...diameters) * 1.15,
      minVelocity: Math.min(...velocities) * 0.9,
      maxVelocity: Math.max(...velocities) * 1.1
    };
  }, [data]);

  // Coordinate scales
  const getX = (diameter: number) => {
    const val = Math.max(1, diameter);
    if (useLogScale) {
      const minLog = Math.log10(Math.max(1, minDiameter));
      const maxLog = Math.log10(Math.max(10, maxDiameter));
      const curLog = Math.log10(val);
      const ratio = (curLog - minLog) / (maxLog - minLog || 1);
      return padding.left + Math.max(0, Math.min(1, ratio)) * plotWidth;
    } else {
      const ratio = (val - minDiameter) / (maxDiameter - minDiameter || 1);
      return padding.left + Math.max(0, Math.min(1, ratio)) * plotWidth;
    }
  };

  const getY = (velocity: number) => {
    const ratio = (velocity - minVelocity) / (maxVelocity - minVelocity || 1);
    return padding.top + plotHeight - Math.max(0, Math.min(1, ratio)) * plotHeight;
  };

  // Generate grid ticks
  const xTicks = useMemo(() => {
    if (useLogScale) {
      return [1, 10, 50, 100, 300, 1000].filter(v => v >= minDiameter * 0.8 && v <= maxDiameter * 1.2);
    }
    const count = 6;
    const step = (maxDiameter - minDiameter) / count;
    return Array.from({ length: count + 1 }, (_, i) => Math.round(minDiameter + i * step));
  }, [useLogScale, minDiameter, maxDiameter]);

  const yTicks = useMemo(() => {
    const count = 5;
    const step = (maxVelocity - minVelocity) / count;
    return Array.from({ length: count + 1 }, (_, i) => Math.round(minVelocity + i * step));
  }, [minVelocity, maxVelocity]);

  return (
    <div className="bg-[#091122]/95 border border-cyan-900/40 rounded-xl p-5 shadow-2xl backdrop-blur-sm relative">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <span>📈</span> Cosmic Risk Vector Matrix (Diameter vs Velocity)
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
              Interactive Scatter Plot
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Planetary defense vector analysis: Point radius maps to kinetic impact energy. Hover to inspect orbit vectors.
          </p>
        </div>

        {/* Controls and Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <button
            onClick={() => setUseLogScale(!useLogScale)}
            className="px-2.5 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/40 flex items-center gap-1.5 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            Scale: {useLogScale ? 'Logarithmic' : 'Linear'}
          </button>

          <div className="flex items-center gap-3 bg-[#060c18] px-3 py-1.5 rounded-lg border border-cyan-900/40">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50 inline-block animate-pulse" />
              <span className="text-red-300 font-semibold">Hazardous (PHA)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block" />
              <span className="text-cyan-300">Non-Hazardous</span>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Canvas Chart */}
      <div className="relative overflow-x-auto w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[460px] bg-[#050a16] rounded-xl border border-cyan-950 shadow-inner select-none"
          onMouseLeave={() => setHoveredNeo(null)}
        >
          <defs>
            {/* Red hazard gradient glow */}
            <radialGradient id="hazardGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#ef4444" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
            {/* Cyan safe glow */}
            <radialGradient id="safeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Plot Area Background and Grid */}
          <rect
            x={padding.left}
            y={padding.top}
            width={plotWidth}
            height={plotHeight}
            fill="#060d1e"
            stroke="#10203e"
            strokeWidth="1"
          />

          {/* Horizontal Grid lines & Y Ticks */}
          {yTicks.map((yVal, i) => {
            const y = getY(yVal);
            return (
              <g key={`y-${i}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + plotWidth}
                  y2={y}
                  stroke="#102548"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {(yVal / 1000).toFixed(0)}k
                </text>
              </g>
            );
          })}

          {/* Vertical Grid lines & X Ticks */}
          {xTicks.map((xVal, i) => {
            const x = getX(xVal);
            return (
              <g key={`x-${i}`}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={padding.top + plotHeight}
                  stroke="#102548"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={padding.top + plotHeight + 18}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {xVal >= 1000 ? `${(xVal / 1000).toFixed(1)}k` : xVal}
                </text>
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={padding.left + plotWidth / 2}
            y={height - 12}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="12"
            fontFamily="monospace"
            fontWeight="bold"
          >
            Estimated Max Diameter (Meters) {useLogScale ? '[Log Scale]' : ''}
          </text>

          <text
            x={-height / 2}
            y={22}
            transform="rotate(-90)"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="12"
            fontFamily="monospace"
            fontWeight="bold"
          >
            Relative Velocity (km/h)
          </text>

          {/* Critical Hazard Danger Threshold (e.g. Diameter > 140m) */}
          {maxDiameter >= 140 && (
            <line
              x1={getX(140)}
              y1={padding.top}
              x2={getX(140)}
              y2={padding.top + plotHeight}
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              opacity="0.5"
            />
          )}

          {/* Asteroid Data Scatter Points */}
          {data.map((neo) => {
            const cx = getX(neo.diameterMaxM);
            const cy = getY(neo.velocityKmh);
            const isHazard = neo.hazardous;
            const isSelected = hoveredNeo?.id === neo.id;
            
            // Point radius scales gently with diameter
            const baseRadius = isHazard ? 7 : 5;
            const radius = Math.min(18, Math.max(4, Math.sqrt(neo.diameterMaxM) * 0.4 + baseRadius));

            return (
              <g
                key={neo.id}
                className="cursor-pointer transition-transform duration-150"
                onClick={() => onSelectNeo(neo)}
                onMouseEnter={(e) => {
                  setHoveredNeo(neo);
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltipPos({ x: cx, y: cy });
                }}
              >
                {/* Outer Glow Halo */}
                {isHazard && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius + 8}
                    fill="url(#hazardGlow)"
                    className="animate-pulse"
                  />
                )}

                {/* Main Scatter Point */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? radius + 3 : radius}
                  fill={isHazard ? '#ef4444' : '#06b6d4'}
                  stroke={isSelected ? '#ffffff' : isHazard ? '#7f1d1d' : '#083344'}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  opacity={hoveredNeo && !isSelected ? 0.35 : 0.9}
                />

                {/* Center Core dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={2}
                  fill="#ffffff"
                  pointerEvents="none"
                />

                {/* Highlight Label for Large or Fast Hazard Asteroids */}
                {(isHazard || neo.diameterMaxM > 300) && (
                  <text
                    x={cx + radius + 4}
                    y={cy + 3}
                    fill={isHazard ? '#fca5a5' : '#7dd3fc'}
                    fontSize="9"
                    fontFamily="monospace"
                    pointerEvents="none"
                    opacity={isSelected || !hoveredNeo ? 0.9 : 0.2}
                  >
                    {neo.name.replace(/[()]/g, '')}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Interactive Floating Tooltip */}
        {hoveredNeo && tooltipPos && (
          <div
            className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 bg-[#070e1e]/95 border border-cyan-400/50 shadow-2xl rounded-xl p-3 text-xs w-64 backdrop-blur-md"
            style={{
              left: `${(tooltipPos.x / width) * 100}%`,
              top: `${(tooltipPos.y / height) * 100}%`,
            }}
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-cyan-900/60 mb-2">
              <span className="font-bold text-white truncate text-xs font-mono">
                {hoveredNeo.name}
              </span>
              {hoveredNeo.hazardous ? (
                <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 text-[9px] font-bold flex items-center gap-1">
                  <ShieldAlert className="w-2.5 h-2.5 text-red-400" />
                  HAZARD
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px]">
                  SAFE
                </span>
              )}
            </div>

            <div className="space-y-1 text-[11px] font-mono">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Max Diameter:</span>
                <span className="font-semibold text-cyan-200">{hoveredNeo.diameterMaxM} m</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Velocity:</span>
                <span className="font-semibold text-amber-300">{hoveredNeo.velocityKmh.toLocaleString()} km/h</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Miss Distance:</span>
                <span className="font-semibold text-violet-300">{hoveredNeo.missDistanceLunar.toFixed(2)} LD</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Scale Analogy:</span>
                <span className="text-slate-300 truncate max-w-[120px]">{hoveredNeo.sizeComparison}</span>
              </div>
            </div>

            <div className="mt-2 pt-1.5 border-t border-cyan-900/40 text-[10px] text-cyan-400 flex items-center justify-between">
              <span>Click point to view full orbital telemetry</span>
              <Crosshair className="w-3 h-3 text-cyan-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
