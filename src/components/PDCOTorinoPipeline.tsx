import React, { useState, useEffect } from 'react';
import { TelemetryObject } from '../types/nasa';
import { 
  ShieldAlert, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  FileText, 
  Code, 
  FileJson, 
  Table, 
  Play, 
  Upload, 
  RefreshCw, 
  Info, 
  AlertTriangle, 
  Rocket, 
  CheckCircle2, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface PDCOTorinoPipelineProps {
  currentFilteredData: TelemetryObject[];
  onNavigateToTable?: () => void;
}

interface EvaluatedRecord {
  id: string;
  name: string;
  diameterM: number;
  velocityKmh: number;
  velocityKms: number;
  missDistanceKm: number;
  missDistanceLunar: number;
  isHazardous: boolean;
  approachDate: string;
  kineticEnergyMt: number;
  collisionProbability: number;
  torinoScale: number;
  torinoZone: 'White' | 'Green' | 'Yellow' | 'Orange' | 'Red';
  torinoDescription: string;
  alertTier: string;
  recommendedMitigation: string;
}

interface EvaluationResult {
  success: boolean;
  timestamp: string;
  recordCount: number;
  topTorinoScale: number;
  topTorinoZone: 'White' | 'Green' | 'Yellow' | 'Orange' | 'Red';
  records: EvaluatedRecord[];
  aiBriefing: string;
  pythonCode: string;
  structuredJson: any;
  enrichedCsv: string;
}

export const PDCOTorinoPipeline: React.FC<PDCOTorinoPipelineProps> = ({
  currentFilteredData
}) => {
  // Convert current TelemetryObject[] to standard CSV string
  const generateCsvFromTelemetry = (items: TelemetryObject[]): string => {
    const headers = [
      'id',
      'name',
      'is_potentially_hazardous_asteroid',
      'estimated_diameter_min_m',
      'estimated_diameter_max_m',
      'relative_velocity_kmh',
      'relative_velocity_kms',
      'miss_distance_km',
      'miss_distance_lunar',
      'close_approach_date',
      'absolute_magnitude_h',
      'kinetic_energy_mt'
    ];

    const rows = items.map((item) => [
      `"${item.id}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      item.hazardous ? 'True' : 'False',
      item.diameterMinM,
      item.diameterMaxM,
      item.velocityKmh,
      item.velocityKms,
      item.missDistanceKm,
      item.missDistanceLunar,
      `"${item.closeApproachDateFull || item.closeApproachDate}"`,
      item.absoluteMagnitude,
      item.kineticEnergyMt
    ]);

    return [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  };

  // 1. Pipeline State
  const [csvText, setCsvText] = useState<string>(() => generateCsvFromTelemetry(currentFilteredData));
  const [activePreset, setActivePreset] = useState<'standard' | 'kinetic_vs_nuclear' | 'civil_defense'>('standard');
  const [customDirective, setCustomDirective] = useState<string>(
    "Comprehensive Torino Impact Hazard Scale Evaluation & Planetary Defense Mission Directives"
  );

  // 2. Evaluation State
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null);

  // 3. Export View State
  const [activeExportTab, setActiveExportTab] = useState<'code' | 'json' | 'csv' | 'briefing'>('code');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Sync CSV if currentFilteredData changes and user hasn't typed custom CSV
  useEffect(() => {
    if (currentFilteredData.length > 0 && !evaluationResult) {
      setCsvText(generateCsvFromTelemetry(currentFilteredData));
    }
  }, [currentFilteredData]);

  // Handle Preset Changes
  const handlePresetSelect = (preset: 'standard' | 'kinetic_vs_nuclear' | 'civil_defense') => {
    setActivePreset(preset);
    if (preset === 'standard') {
      setCustomDirective("Comprehensive Torino Impact Hazard Scale Evaluation & Planetary Defense Mission Directives");
    } else if (preset === 'kinetic_vs_nuclear') {
      setCustomDirective("Deflection Dynamics: Calculate required delta-v for DART Kinetic Impactor vs Standoff Nuclear Ablation based on warning lead time.");
    } else {
      setCustomDirective("Ground Impact Blast Modeling: Civil Defense ground overpressure (psi), thermal radiation radius, and coastal tsunami risk corridors.");
    }
  };

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setCsvText(text);
          setError(null);
        }
      };
      reader.readAsText(file);
    }
  };

  // Run Pipeline Evaluation
  const runEvaluation = async () => {
    if (!csvText.trim()) {
      setError("Please provide or load CSV data before running evaluation.");
      return;
    }

    setIsEvaluating(true);
    setError(null);
    const start = Date.now();

    try {
      const response = await fetch('/api/planetary-defense/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csvData: csvText,
          promptDirective: customDirective
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP ${response.status}`);
      }

      const result: EvaluationResult = await response.json();
      setEvaluationResult(result);
      setExecutionTimeMs(Date.now() - start);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Evaluation Pipeline Error: ${msg}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Copy to Clipboard
  const handleCopy = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1800);
  };

  // Download File Helper
  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Count rows in CSV
  const csvRowCount = Math.max(0, csvText.trim().split('\n').filter(l => l.trim()).length - 1);

  // Torino Zone Badge Color
  const getTorinoColor = (zone: string) => {
    switch (zone) {
      case 'Red':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'Orange':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      case 'Yellow':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      case 'Green':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* 🚀 Visual Pipeline Diagram Banner */}
      <div className="bg-[#070e1e] border border-cyan-800/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-cyan-950 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-700/60 text-cyan-300 font-mono text-[11px] font-semibold uppercase tracking-wider">
                Planetary Defense Pipeline
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                NASA PDCO Torino Logic
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mt-1">
              CSV Data ➔ AI Studio Prompt ➔ Code / JSON Export
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl font-sans leading-relaxed">
              Automated planetary defense evaluation pipeline. Ingests raw or filtered asteroid CSV telemetry, runs Torino Impact Hazard Scale mathematical modeling via AI Studio, and exports production Python scripts and structured JSON.
            </p>
          </div>

          <button
            onClick={runEvaluation}
            disabled={isEvaluating}
            className="px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-xl shadow-cyan-950/60 border border-cyan-400/40 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50 shrink-0"
          >
            {isEvaluating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Evaluating Torino Scale...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white text-white" />
                <span>Run AI Studio Torino Pipeline</span>
              </>
            )}
          </button>
        </div>

        {/* 3-Step Pipeline Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
          {/* Step 1: Your CSV Data */}
          <div className="bg-[#050a16] border border-cyan-900/50 rounded-xl p-4 relative flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                Step 1
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                {csvRowCount} records
              </span>
            </div>
            <div className="mt-2">
              <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Table className="w-4 h-4 text-cyan-400" />
                [ Your CSV Data ]
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Active telemetry dataset or custom uploaded CSV with orbital metrics.
              </p>
            </div>
            <div className="mt-3 text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Loaded & Validated</span>
            </div>
          </div>

          {/* Step 2: AI Studio Prompt */}
          <div className="bg-[#050a16] border border-cyan-900/50 rounded-xl p-4 relative flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                Step 2
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-950/70 text-indigo-300 border border-indigo-800/40">
                gemini-3.8-flash
              </span>
            </div>
            <div className="mt-2">
              <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                [ AI Studio Prompt ]
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                NASA PDCO Torino Hazard Scale (0-10) matrix & mitigation directive engine.
              </p>
            </div>
            <div className="mt-3 text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
              {isEvaluating ? (
                <span className="text-amber-400 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Processing AI Logic...
                </span>
              ) : evaluationResult ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Evaluated ({executionTimeMs}ms)
                </span>
              ) : (
                <span className="text-slate-400">Ready to execute</span>
              )}
            </div>
          </div>

          {/* Step 3: Export Button Code/JSON */}
          <div className="bg-[#050a16] border border-cyan-900/50 rounded-xl p-4 relative flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                Step 3
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                Code + JSON
              </span>
            </div>
            <div className="mt-2">
              <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" />
                [ "Export" Button Code/JSON ]
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Standalone Python CLI evaluator, structured JSON hazard ratings, & enriched CSV.
              </p>
            </div>
            <div className="mt-3 text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
              {evaluationResult ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Export
                </span>
              ) : (
                <span className="text-slate-400">Awaiting step 2 execution</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/60 text-red-200 text-xs font-mono flex items-center gap-3 shadow-lg">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Step 1 (CSV Data) & Step 2 (AI Studio Prompt) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Step 1: Your CSV Data Input Card */}
          <div className="bg-[#080f20] border border-cyan-900/40 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-950 pb-3">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <span>📁</span> Step 1: [ Your CSV Data ]
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCsvText(generateCsvFromTelemetry(currentFilteredData))}
                  className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/50 text-[11px] font-mono flex items-center gap-1 transition-colors"
                  title="Reload active telemetry filter from table"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Sync Current Filter</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>CSV Payload Editor ({csvRowCount} objects)</span>
                <label className="cursor-pointer text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span>Upload .csv</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                rows={9}
                className="w-full bg-[#040814] border border-cyan-900/60 rounded-lg p-3 font-mono text-cyan-200 text-[11px] leading-relaxed focus:outline-none focus:border-cyan-400 resize-y"
                placeholder="Paste CSV rows with headers: id, name, estimated_diameter_max_m, velocity_kmh, miss_distance_km, is_potentially_hazardous_asteroid..."
              />
            </div>
          </div>

          {/* Step 2: AI Studio Prompt Card */}
          <div className="bg-[#080f20] border border-cyan-900/40 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-950 pb-3">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <span>🤖</span> Step 2: [ AI Studio Prompt ]
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                Torino Logic
              </span>
            </div>

            {/* Directive Presets */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono text-slate-400 block">
                Planetary Defense Directives Preset:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetSelect('standard')}
                  className={`p-2 rounded-lg text-left text-[11px] font-mono transition-all border ${
                    activePreset === 'standard'
                      ? 'bg-cyan-950/90 text-cyan-200 border-cyan-500/60'
                      : 'bg-[#040814] text-slate-400 border-cyan-900/40 hover:text-slate-200'
                  }`}
                >
                  <strong className="block text-white text-[11px]">Standard Torino</strong>
                  Full 0-10 rating
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('kinetic_vs_nuclear')}
                  className={`p-2 rounded-lg text-left text-[11px] font-mono transition-all border ${
                    activePreset === 'kinetic_vs_nuclear'
                      ? 'bg-cyan-950/90 text-cyan-200 border-cyan-500/60'
                      : 'bg-[#040814] text-slate-400 border-cyan-900/40 hover:text-slate-200'
                  }`}
                >
                  <strong className="block text-white text-[11px]">DART vs Nuclear</strong>
                  Deflection Delta-V
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('civil_defense')}
                  className={`p-2 rounded-lg text-left text-[11px] font-mono transition-all border ${
                    activePreset === 'civil_defense'
                      ? 'bg-cyan-950/90 text-cyan-200 border-cyan-500/60'
                      : 'bg-[#040814] text-slate-400 border-cyan-900/40 hover:text-slate-200'
                  }`}
                >
                  <strong className="block text-white text-[11px]">Blast Modeling</strong>
                  FEMA evacuation
                </button>
              </div>
            </div>

            {/* Editable Directive Textarea */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 block">
                Prompt Instruction Directive:
              </label>
              <textarea
                value={customDirective}
                onChange={(e) => setCustomDirective(e.target.value)}
                rows={3}
                className="w-full bg-[#040814] border border-cyan-900/60 rounded-lg p-2.5 font-mono text-slate-200 text-xs focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <button
              onClick={runEvaluation}
              disabled={isEvaluating}
              className="w-full py-2.5 px-4 rounded-lg font-mono text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 border border-cyan-400/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isEvaluating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Executing Torino AI Directive...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Execute Torino Evaluation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Step 3: [ "Export" Button Code/JSON ] Hub */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#080f20] border border-cyan-900/40 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full">
            {/* Export Header & Action Buttons */}
            <div className="p-4 border-b border-cyan-900/40 bg-[#060c18] flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <span>🛡️</span> Step 3: [ "Export" Button Code / JSON ]
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Production-grade artifacts generated from your CSV with mathematical Torino ratings.
                </p>
              </div>

              {/* Top Quick Export Buttons */}
              {evaluationResult && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadFile(evaluationResult.pythonCode, "pdco_torino_evaluator.py", "text/x-python")}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    title="Download Python Script"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Python Code (.py)</span>
                  </button>
                  <button
                    onClick={() => downloadFile(JSON.stringify(evaluationResult.structuredJson, null, 2), "pdco_torino_assessment.json", "application/json")}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    title="Download Structured JSON"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>JSON (.json)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Summary Metrics Banner if Result is Ready */}
            {evaluationResult && (
              <div className="p-4 bg-[#050a16] border-b border-cyan-950 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-[#070e1c] border border-cyan-900/40">
                  <span className="text-[10px] text-slate-400 block">Peak Torino Hazard</span>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getTorinoColor(evaluationResult.topTorinoZone)}`}>
                      Torino {evaluationResult.topTorinoScale}
                    </span>
                    <span className="text-slate-300 text-[11px] font-sans">{evaluationResult.topTorinoZone} Zone</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#070e1c] border border-cyan-900/40">
                  <span className="text-[10px] text-slate-400 block">Objects Evaluated</span>
                  <span className="text-sm font-bold text-white mt-1 block">
                    {evaluationResult.recordCount} Near-Earth Objects
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#070e1c] border border-cyan-900/40">
                  <span className="text-[10px] text-slate-400 block">Top Threat Vector</span>
                  <span className="text-xs font-bold text-cyan-300 mt-1 block truncate">
                    {evaluationResult.records[0]?.name || 'None'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#070e1c] border border-cyan-900/40">
                  <span className="text-[10px] text-slate-400 block">Peak Kinetic Energy</span>
                  <span className="text-xs font-bold text-amber-300 mt-1 block">
                    {evaluationResult.records[0]?.kineticEnergyMt.toLocaleString() || '0'} Mt TNT
                  </span>
                </div>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="flex border-b border-cyan-950 bg-[#070d1a] px-4">
              <button
                type="button"
                onClick={() => setActiveExportTab('code')}
                className={`py-3 px-4 font-mono text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeExportTab === 'code'
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Python Code (.py)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveExportTab('json')}
                className={`py-3 px-4 font-mono text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeExportTab === 'json'
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileJson className="w-3.5 h-3.5" />
                <span>Structured JSON</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveExportTab('csv')}
                className={`py-3 px-4 font-mono text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeExportTab === 'csv'
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Enriched CSV</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveExportTab('briefing')}
                className={`py-3 px-4 font-mono text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeExportTab === 'briefing'
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDCO AI Briefing</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-4 flex-1 overflow-y-auto max-h-[560px]">
              {!evaluationResult && !isEvaluating && (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-center">
                    <Rocket className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h4 className="text-base font-bold text-white font-mono">
                    Ready to Execute Torino AI Pipeline
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Click <strong>"Run AI Studio Torino Pipeline"</strong> above to ingest the current CSV, evaluate kinetic impact potentials, and generate ready-to-run Python code and structured JSON.
                  </p>
                  <button
                    onClick={runEvaluation}
                    className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold transition-colors"
                  >
                    Start Pipeline Evaluation
                  </button>
                </div>
              )}

              {isEvaluating && (
                <div className="text-center py-20 space-y-4">
                  <RefreshCw className="w-10 h-10 animate-spin text-cyan-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white font-mono">
                    Evaluating Asteroid CSV with Torino Scale & PDCO Directives...
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    Synthesizing kinetic velocities, collision cross sections, and space mitigation options
                  </p>
                </div>
              )}

              {evaluationResult && (
                <div>
                  {/* TAB 1: Python Code */}
                  {activeExportTab === 'code' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400">
                          File: <strong className="text-cyan-300">pdco_torino_evaluator.py</strong> (Python 3.10+ CLI)
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(evaluationResult.pythonCode, 'code')}
                            className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 text-xs font-mono flex items-center gap-1 transition-colors"
                          >
                            {copiedType === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedType === 'code' ? 'Copied!' : 'Copy Code'}</span>
                          </button>
                          <button
                            onClick={() => downloadFile(evaluationResult.pythonCode, "pdco_torino_evaluator.py", "text/x-python")}
                            className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-medium flex items-center gap-1 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download .py</span>
                          </button>
                        </div>
                      </div>
                      <pre className="p-4 rounded-xl bg-[#040814] border border-cyan-950 font-mono text-xs text-cyan-200 overflow-x-auto leading-relaxed">
                        {evaluationResult.pythonCode}
                      </pre>
                    </div>
                  )}

                  {/* TAB 2: Structured JSON */}
                  {activeExportTab === 'json' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400">
                          File: <strong className="text-cyan-300">pdco_torino_assessment.json</strong>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(JSON.stringify(evaluationResult.structuredJson, null, 2), 'json')}
                            className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 text-xs font-mono flex items-center gap-1 transition-colors"
                          >
                            {copiedType === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedType === 'json' ? 'Copied!' : 'Copy JSON'}</span>
                          </button>
                          <button
                            onClick={() => downloadFile(JSON.stringify(evaluationResult.structuredJson, null, 2), "pdco_torino_assessment.json", "application/json")}
                            className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-medium flex items-center gap-1 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download .json</span>
                          </button>
                        </div>
                      </div>
                      <pre className="p-4 rounded-xl bg-[#040814] border border-cyan-950 font-mono text-xs text-amber-200 overflow-x-auto leading-relaxed">
                        {JSON.stringify(evaluationResult.structuredJson, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* TAB 3: Enriched CSV */}
                  {activeExportTab === 'csv' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400">
                          File: <strong className="text-cyan-300">asteroid_telemetry_torino_enriched.csv</strong>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(evaluationResult.enrichedCsv, 'csv')}
                            className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 text-xs font-mono flex items-center gap-1 transition-colors"
                          >
                            {copiedType === 'csv' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedType === 'csv' ? 'Copied!' : 'Copy CSV'}</span>
                          </button>
                          <button
                            onClick={() => downloadFile(evaluationResult.enrichedCsv, "asteroid_telemetry_torino_enriched.csv", "text/csv")}
                            className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-medium flex items-center gap-1 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Enriched CSV</span>
                          </button>
                        </div>
                      </div>

                      <div className="overflow-x-auto border border-cyan-950 rounded-xl">
                        <table className="w-full text-left text-xs font-mono">
                          <thead>
                            <tr className="bg-[#040814] border-b border-cyan-900/60 text-slate-400">
                              <th className="py-2.5 px-3">Torino</th>
                              <th className="py-2.5 px-3">Zone</th>
                              <th className="py-2.5 px-3">ID</th>
                              <th className="py-2.5 px-3">Name</th>
                              <th className="py-2.5 px-3 text-right">Energy (Mt)</th>
                              <th className="py-2.5 px-3 text-right">Velocity</th>
                              <th className="py-2.5 px-3">Mitigation Directive</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-cyan-950/60 bg-[#060c18]">
                            {evaluationResult.records.map((r) => (
                              <tr key={r.id} className="hover:bg-cyan-950/20">
                                <td className="py-2.5 px-3">
                                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getTorinoColor(r.torinoZone)}`}>
                                    {r.torinoScale}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-slate-300">{r.torinoZone}</td>
                                <td className="py-2.5 px-3 text-cyan-400">{r.id}</td>
                                <td className="py-2.5 px-3 text-white font-medium">{r.name}</td>
                                <td className="py-2.5 px-3 text-right text-amber-300">{r.kineticEnergyMt.toLocaleString()} Mt</td>
                                <td className="py-2.5 px-3 text-right text-slate-300">{r.velocityKmh.toLocaleString()} km/h</td>
                                <td className="py-2.5 px-3 text-slate-400 text-[11px] truncate max-w-xs">{r.recommendedMitigation}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: AI Briefing */}
                  {activeExportTab === 'briefing' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400">
                          Mission Directorate AI Assessment (NASA PDCO Guidelines)
                        </span>
                        <button
                          onClick={() => handleCopy(evaluationResult.aiBriefing, 'briefing')}
                          className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 text-xs font-mono flex items-center gap-1 transition-colors"
                        >
                          {copiedType === 'briefing' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedType === 'briefing' ? 'Copied!' : 'Copy Briefing'}</span>
                        </button>
                      </div>
                      <div className="p-5 rounded-xl bg-[#040814] border border-cyan-950 font-sans text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {evaluationResult.aiBriefing}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
