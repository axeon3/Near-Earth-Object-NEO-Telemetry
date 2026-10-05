import React, { useState } from 'react';
import { UnitSystem } from '../types/nasa';
import { 
  Key, 
  Calendar, 
  RefreshCw, 
  ShieldAlert, 
  SlidersHorizontal, 
  Eye, 
  EyeOff, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Download
} from 'lucide-react';

interface SidebarProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  onRefresh: (force?: boolean) => void;
  isLoading: boolean;
  hazardFilter?: 'all' | 'hazardous' | 'safe';
  setHazardFilter?: (filter: 'all' | 'hazardous' | 'safe') => void;
  hazardousOnly?: boolean;
  setHazardousOnly?: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'velocity' | 'diameter' | 'missDistance' | 'date';
  setSortBy: (sort: 'velocity' | 'diameter' | 'missDistance' | 'date') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  filteredCount?: number;
  onDownloadCsv?: () => void;
  unitSystem?: UnitSystem;
  setUnitSystem?: (system: UnitSystem) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  apiKey,
  setApiKey,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onRefresh,
  isLoading,
  hazardFilter = 'all',
  setHazardFilter,
  hazardousOnly,
  setHazardousOnly,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  isCollapsed,
  setIsCollapsed,
  filteredCount,
  onDownloadCsv,
  unitSystem = 'metric',
  setUnitSystem
}) => {
  const [showApiKey, setShowApiKey] = useState(false);

  const setDatePreset = (days: number) => {
    const today = new Date();
    const endStr = today.toISOString().split('T')[0];
    
    const start = new Date();
    start.setDate(today.getDate() - (days - 1));
    const startStr = start.toISOString().split('T')[0];

    setStartDate(startStr);
    setEndDate(endStr);
  };

  if (isCollapsed) {
    return (
      <div className="bg-[#0b1329]/90 backdrop-blur-md border-r border-cyan-900/30 p-3 flex flex-col items-center gap-4 transition-all">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-400 border border-cyan-800/40 transition-colors"
          title="Expand Telemetry Controls"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <button
          onClick={() => onRefresh(true)}
          disabled={isLoading}
          className="p-2 rounded-lg bg-cyan-600/30 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/30 transition-colors"
          title="Trigger Refresh"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>
    );
  }

  return (
    <aside className="w-80 shrink-0 bg-[#090f20]/95 backdrop-blur-md border-r border-cyan-900/30 flex flex-col h-full overflow-y-auto text-slate-200">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-cyan-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🛸</span>
          <h2 className="font-bold tracking-wide text-cyan-100 font-mono text-sm uppercase">
            Telemetry Controls
          </h2>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/60 border border-transparent hover:border-cyan-800/40 transition-colors"
          title="Collapse Panel"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-6 flex-1 text-xs">
        {/* API Key Configuration */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              Telemetry API Key
            </label>
            <a
              href="https://api.nasa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 hover:underline"
            >
              Get Free Key <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="DEMO_KEY"
              className="w-full bg-[#050a16] border border-cyan-900/50 rounded-lg px-3 py-2 pr-9 font-mono text-cyan-200 text-xs focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-cyan-300 transition-colors"
            >
              {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            Defaults to <span className="font-mono text-cyan-300">DEMO_KEY</span>. NeoWS actively queries the Near Earth Object Web Service feed.
          </p>
        </div>

        {/* Date Window Selection */}
        <div className="space-y-2">
          <label className="text-slate-300 font-semibold flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            Observation Window (Max 7 Days)
          </label>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Start Date</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#050a16] border border-cyan-900/50 rounded-lg px-2 py-1.5 font-mono text-cyan-200 text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">End Date</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#050a16] border border-cyan-900/50 rounded-lg px-2 py-1.5 font-mono text-cyan-200 text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Quick Date Presets */}
          <div className="flex gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => setDatePreset(1)}
              className="flex-1 py-1 px-2 rounded bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-800/40 text-[10px] font-mono text-cyan-300 hover:text-white transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setDatePreset(3)}
              className="flex-1 py-1 px-2 rounded bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-800/40 text-[10px] font-mono text-cyan-300 hover:text-white transition-colors"
            >
              3 Days
            </button>
            <button
              type="button"
              onClick={() => setDatePreset(7)}
              className="flex-1 py-1 px-2 rounded bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-800/40 text-[10px] font-mono text-cyan-300 hover:text-white transition-colors"
            >
              7 Days
            </button>
          </div>
        </div>

        {/* Live Ingest Button */}
        <button
          onClick={() => onRefresh(true)}
          disabled={isLoading}
          className="w-full py-2.5 px-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 border border-cyan-400/30 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Ingesting Telemetry...' : '🚀 Ingest Live Telemetry'}
        </button>

        {/* Data Stream Filters */}
        <div className="space-y-3 pt-2 border-t border-cyan-900/40">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5 text-xs">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              Filter asteroid name or ID:
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter asteroid name or ID:"
                className="w-full bg-[#050a16] border border-cyan-900/50 rounded-lg px-2.5 py-1.5 pl-8 font-mono text-cyan-200 text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Hazardous Only Checkbox */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-200 hover:text-white transition-colors bg-[#050a16] border border-cyan-900/40 hover:border-cyan-700/50 p-2 rounded-lg">
              <input
                type="checkbox"
                checked={hazardousOnly !== undefined ? hazardousOnly : hazardFilter === 'hazardous'}
                onChange={(e) => {
                  if (setHazardousOnly) {
                    setHazardousOnly(e.target.checked);
                  }
                  if (setHazardFilter) {
                    setHazardFilter(e.target.checked ? 'hazardous' : 'all');
                  }
                }}
                className="w-4 h-4 rounded border-cyan-700 bg-[#050a16] text-cyan-500 focus:ring-cyan-500/20 cursor-pointer accent-cyan-500"
              />
              <span className="flex items-center gap-1.5 text-xs font-mono font-medium">
                <ShieldAlert className={`w-3.5 h-3.5 ${(hazardousOnly || hazardFilter === 'hazardous') ? 'text-red-400' : 'text-slate-400'}`} />
                Show Potentially Hazardous Only
              </span>
            </label>
          </div>

          {/* Download CSV Action Button */}
          {onDownloadCsv && filteredCount !== undefined && (
            <button
              type="button"
              onClick={onDownloadCsv}
              className="w-full py-2 px-3 rounded-lg font-mono text-xs font-semibold bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-700/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>⬇ Download Filtered CSV ({filteredCount} records)</span>
            </button>
          )}

          {/* Measurement System: Metric vs Imperial */}
          {setUnitSystem && (
            <div className="space-y-1 pt-1">
              <span className="text-[10px] text-slate-400 block font-mono">Measurement System:</span>
              <div className="grid grid-cols-2 gap-1 bg-[#050a16] p-1 rounded-lg border border-cyan-900/40 font-mono text-[11px]">
                <button
                  type="button"
                  onClick={() => setUnitSystem('metric')}
                  className={`py-1 rounded text-center transition-all ${
                    unitSystem === 'metric'
                      ? 'bg-cyan-600/40 text-cyan-200 border border-cyan-500/40 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  📏 Metric (km, m)
                </button>
                <button
                  type="button"
                  onClick={() => setUnitSystem('imperial')}
                  className={`py-1 rounded text-center transition-all ${
                    unitSystem === 'imperial'
                      ? 'bg-cyan-600/40 text-cyan-200 border border-cyan-500/40 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  📐 Imperial (mi, ft)
                </button>
              </div>
            </div>
          )}

          {/* Sort Settings */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 block">Sort Telemetry Stream By:</span>
            <div className="flex gap-1.5">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 bg-[#050a16] border border-cyan-900/50 rounded-lg px-2 py-1.5 text-xs text-cyan-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="velocity">Velocity ({unitSystem === 'imperial' ? 'Peak mph' : 'Peak km/h'})</option>
                <option value="diameter">Max Diameter ({unitSystem === 'imperial' ? 'ft' : 'm'})</option>
                <option value="missDistance">Miss Distance ({unitSystem === 'imperial' ? 'mi' : 'km'})</option>
                <option value="date">Approach Date / Time</option>
              </select>
              <button
                type="button"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1.5 bg-[#050a16] border border-cyan-900/50 rounded-lg text-cyan-300 hover:text-white"
                title={`Sort Order: ${sortOrder.toUpperCase()}`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-cyan-900/40 text-[10px] text-slate-500 flex items-center justify-between font-mono">
        <span>Planetary NeoWS Ephemeris</span>
        <span className="flex items-center gap-1 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Ready
        </span>
      </div>
    </aside>
  );
};
