/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopMetrics } from './components/TopMetrics';
import { TelemetryTable } from './components/TelemetryTable';
import { CosmicRiskMatrix } from './components/CosmicRiskMatrix';
import { OrbitalRadar } from './components/OrbitalRadar';
import { MultiAgentCrew } from './components/MultiAgentCrew';
import { ObjectDetailModal } from './components/ObjectDetailModal';
import { PDCOTorinoPipeline } from './components/PDCOTorinoPipeline';
import { fetchNasaTelemetry, computeSummaryMetrics } from './services/nasaService';
import { TelemetryObject } from './types/nasa';
import { 
  Rocket, 
  AlertCircle, 
  Info, 
  Menu, 
  Activity, 
  RefreshCw, 
  SlidersHorizontal,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function App() {
  // Today's date YYYY-MM-DD
  const getTodayStr = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('nasa_neows_api_key') || 'DEMO_KEY';
  });

  const [startDate, setStartDate] = useState<string>(getTodayStr());
  const [endDate, setEndDate] = useState<string>(getTodayStr());
  const [data, setData] = useState<TelemetryObject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sourceLabel, setSourceLabel] = useState<string>('Initializing Telemetry...');
  const [isFallback, setIsFallback] = useState<boolean>(false);

  // Filter & Sort State
  const [hazardousOnly, setHazardousOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'velocity' | 'diameter' | 'missDistance' | 'date'>('velocity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // UI Navigation
  const [activeTab, setActiveTab] = useState<'table' | 'matrix' | 'radar' | 'crew' | 'pdco'>('table');
  const [selectedNeo, setSelectedNeo] = useState<TelemetryObject | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Save API key when changed
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('nasa_neows_api_key', apiKey.trim());
    }
  }, [apiKey]);

  // Data Fetching Pipeline
  const loadTelemetry = useCallback(async (force: boolean = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchNasaTelemetry(apiKey, startDate, endDate, force);
      setData(result.data);
      setError(result.error);
      setSourceLabel(result.sourceLabel);
      setIsFallback(result.isFallback);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(`Telemetry Ingestion Error: ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, startDate, endDate]);

  // Initial load
  useEffect(() => {
    loadTelemetry(false);
  }, [loadTelemetry]);

  // Filter and Sort Data Stream
  const filteredData = useMemo(() => {
    let result = [...data];

    // Hazard Filter: Show Potentially Hazardous Only
    if (hazardousOnly) {
      result = result.filter(item => item.hazardous);
    }

    // Search Query: Filter asteroid name or ID
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        item => item.name.toLowerCase().includes(q) || String(item.id).toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'velocity':
          comparison = a.velocityKmh - b.velocityKmh;
          break;
        case 'diameter':
          comparison = a.diameterMaxM - b.diameterMaxM;
          break;
        case 'missDistance':
          comparison = a.missDistanceKm - b.missDistanceKm;
          break;
        case 'date':
          comparison = (a.closeApproachDateFull || a.closeApproachDate).localeCompare(
            b.closeApproachDateFull || b.closeApproachDate
          );
          break;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [data, hazardousOnly, searchQuery, sortBy, sortOrder]);

  // Summary Metrics
  const summary = useMemo(() => {
    return computeSummaryMetrics(filteredData, startDate, endDate);
  }, [filteredData, startDate, endDate]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#040814] text-slate-100 font-sans">
      {/* Telemetry Sidebar */}
      <Sidebar
        apiKey={apiKey}
        setApiKey={setApiKey}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onRefresh={loadTelemetry}
        isLoading={isLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        hazardousOnly={hazardousOnly}
        setHazardousOnly={setHazardousOnly}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        filteredCount={filteredData.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Header App Bar */}
        <header className="px-6 py-4 border-b border-cyan-900/40 bg-[#060c1c]/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                {isSidebarCollapsed && (
                  <button
                    onClick={() => setIsSidebarCollapsed(false)}
                    className="p-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/40 transition-colors"
                    title="Open Telemetry Controls"
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                )}
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span className="text-2xl">🛸</span>
                  <span>Near-Earth Object (NEO) Telemetry Dashboard</span>
                </h1>
              </div>
              <p className="text-xs text-cyan-300/80 mt-1 flex items-center gap-2 font-mono">
                <span>Official Global Vetting Data Integration Portal — International Space Apps Challenge</span>
              </p>
            </div>

            {/* Source Status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#040916] border border-cyan-900/50 text-xs font-mono">
                <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400 animate-ping' : isFallback ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
                <span className="text-slate-300 truncate max-w-[280px]">{sourceLabel}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Active Ingest Loading Spinner */}
          {isLoading && (
            <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-xl p-4 flex items-center justify-center gap-3 text-cyan-200 text-sm font-mono shadow-lg shadow-cyan-950/40 animate-pulse">
              <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
              <span>🚀 Ingesting live space agency data arrays...</span>
            </div>
          )}

          {/* Error Banner with helpful Tip from Streamlit code */}
          {error && (
            <div className="bg-red-950/30 border border-red-500/50 rounded-xl p-4 text-red-200 text-xs space-y-2 font-mono">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="block text-red-300">{error}</strong>
                  <div className="text-slate-300 flex items-center gap-1 text-[11px] pt-1">
                    <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>💡 Tip: If the DEMO_KEY limit is exceeded, generate a personal key at <a href="https://api.nasa.gov" target="_blank" rel="noopener noreferrer" className="underline text-cyan-400 hover:text-cyan-300">api.nasa.gov</a> and insert it into the Telemetry Controls sidebar.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Presentation Layer: Core Focus & Clarity (Local Hub Rubric Section 2) */}
          <TopMetrics
            summary={summary}
            sourceLabel={sourceLabel}
            isFallback={isFallback}
          />

          {/* Visualization Mode Tabs */}
          <div className="border-b border-cyan-900/40 flex items-center justify-between">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('table')}
                className={`px-4 py-2.5 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'table'
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>📊</span>
                Operational Telemetry Stream
              </button>

              <button
                onClick={() => setActiveTab('matrix')}
                className={`px-4 py-2.5 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'matrix'
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>📈</span>
                Cosmic Risk Vector Matrix
              </button>

              <button
                onClick={() => setActiveTab('radar')}
                className={`px-4 py-2.5 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'radar'
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>🎯</span>
                Proximity Horizon Radar
              </button>

              <button
                onClick={() => setActiveTab('crew')}
                className={`px-4 py-2.5 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'crew'
                    ? 'border-amber-400 text-amber-300 bg-amber-950/20 shadow-sm'
                    : 'border-transparent text-slate-400 hover:text-amber-200 hover:border-slate-700'
                }`}
              >
                <span>🤖</span>
                Multi-Agent
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  CrewAI
                </span>
              </button>

              <button
                onClick={() => setActiveTab('pdco')}
                className={`px-4 py-2.5 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'pdco'
                    ? 'border-emerald-400 text-emerald-300 bg-emerald-950/30 shadow-sm'
                    : 'border-transparent text-slate-400 hover:text-emerald-200 hover:border-slate-700'
                }`}
              >
                <span>🛡️</span>
                PDCO Torino Pipeline
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  CSV ➔ AI ➔ Export
                </span>
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>Date Range:</span>
              <span className="text-cyan-300 font-semibold">{startDate} {startDate !== endDate ? `→ ${endDate}` : ''}</span>
            </div>
          </div>

          {/* Active View Tab Content */}
          <div className="space-y-6">
            {activeTab === 'table' && (
              <TelemetryTable
                data={filteredData}
                onSelectNeo={(neo) => setSelectedNeo(neo)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                hazardousOnly={hazardousOnly}
                setHazardousOnly={setHazardousOnly}
                onOpenPdcoPipeline={() => setActiveTab('pdco')}
              />
            )}

            {activeTab === 'matrix' && (
              <CosmicRiskMatrix
                data={filteredData}
                onSelectNeo={(neo) => setSelectedNeo(neo)}
              />
            )}

            {activeTab === 'radar' && (
              <OrbitalRadar
                data={filteredData}
                onSelectNeo={(neo) => setSelectedNeo(neo)}
              />
            )}

            {activeTab === 'crew' && (
              <MultiAgentCrew
                apiKey={apiKey}
              />
            )}

            {activeTab === 'pdco' && (
              <PDCOTorinoPipeline
                currentFilteredData={filteredData}
                onNavigateToTable={() => setActiveTab('table')}
              />
            )}
          </div>
        </div>
      </main>

      {/* Asteroid Detail Telemetry Modal */}
      <ObjectDetailModal
        neo={selectedNeo}
        onClose={() => setSelectedNeo(null)}
      />
    </div>
  );
}
