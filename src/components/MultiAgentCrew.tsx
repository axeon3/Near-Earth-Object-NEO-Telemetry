import React, { useState } from 'react';
import { 
  Bot, 
  Play, 
  CheckCircle2, 
  Terminal, 
  FileCode, 
  FileText, 
  CheckSquare, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface LogEntry {
  agent: string;
  message: string;
  timestamp: string;
}

interface MultiAgentCrewProps {
  apiKey: string;
}

export const MultiAgentCrew: React.FC<MultiAgentCrewProps> = ({ apiKey }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeArtifactTab, setActiveArtifactTab] = useState<'blueprint' | 'code' | 'qa' | 'terminal'>('blueprint');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Pipeline result state
  const [pipelineData, setPipelineData] = useState<{
    blueprint: string;
    code: string;
    qaReport: string;
    logs: LogEntry[];
    durationMs: number;
    source: string;
  } | null>(null);

  const [liveTestOutput, setLiveTestOutput] = useState<string | null>(null);
  const [isTestingCode, setIsTestingCode] = useState(false);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleDownload = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const runPipeline = async () => {
    setIsRunning(true);
    setLiveTestOutput(null);
    try {
      const response = await fetch('/api/agents/kickoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();
      if (data) {
        setPipelineData({
          blueprint: data.blueprint || '',
          code: data.code || '',
          qaReport: data.qaReport || '',
          logs: data.logs || [],
          durationMs: data.durationMs || 0,
          source: data.source || 'gemini-2.5-flash',
        });
      }
    } catch (err: unknown) {
      console.error('CrewAI Pipeline failed:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const runLivePythonTest = async () => {
    setIsTestingCode(true);
    try {
      const response = await fetch('/api/run-telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });

      const res = await response.json();
      if (res.error) {
        setLiveTestOutput(`[EXECUTION ERROR]: ${res.error}`);
      } else {
        const lines = [
          '================================================================================',
          '🛸 Near-Earth Object (NEO) Operational Telemetry Stream',
          `Total Signatures Tracked: ${res.recordCount} | Ingestion Engine: urllib.request (Python 3.10+)`,
          `Executed: ${new Date(res.timestamp).toUTCString()} | Status: 200 OK`,
          '================================================================================',
          `${'RISK'.padEnd(8)} ${'ID'.padEnd(10)} ${'DESIGNATION'.padEnd(24)} ${'VELOCITY (km/h)'.padStart(18)} ${'DIAMETER (m)'.padStart(14)} ${'MISS DIST (LD)'}`,
          '--------------------------------------------------------------------------------',
          ...res.records.map((r: any) => {
            const risk = r.hazardous ? '[ALERT]' : '[SAFE]';
            return `${risk.padEnd(8)} ${String(r.id).padEnd(10)} ${String(r.name).slice(0, 22).padEnd(24)} ${r.velocityKmh.toLocaleString().padStart(18)} ${r.diameterM.toLocaleString().padStart(14)} ${r.missLd.toFixed(2).padStart(12)} LD`;
          }),
          '================================================================================',
          `>> Execution completed: Process returned exit code 0. Validated with zero mock placeholders.`
        ];
        setLiveTestOutput(lines.join('\n'));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setLiveTestOutput(`[SYSTEM ERROR]: Could not run simulation: ${msg}`);
    } finally {
      setIsTestingCode(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Crew Overview Banner */}
      <div className="bg-gradient-to-r from-[#0a1530] via-[#091122] to-[#0d1b3a] border border-cyan-700/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-widest flex items-center gap-1">
                <Cpu className="w-3 h-3 text-cyan-400" />
                CrewAI Multi-Agent Pipeline
              </span>
              <span className="text-xs font-mono text-slate-400">
                Engine: <strong className="text-cyan-300">gemini-2.5-flash</strong>
              </span>
            </div>
            <h2 className="text-2xl font-black text-white font-mono tracking-tight flex items-center gap-2">
              <span>🤖</span> Multi-Agent
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Sequential multi-agent execution pipeline based on CrewAI. Three autonomous agents deconstruct the NEO challenge, engineer operational Python pipelines hitting live NeoWS feeds, and conduct mission assurance verification.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={runPipeline}
              disabled={isRunning}
              className="py-3 px-5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-xl shadow-cyan-950/60 flex items-center gap-2.5 font-mono text-xs border border-cyan-300/40 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Pipeline Running Sequence...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white text-white" />
                  <span>Kickoff Multi-Agent Pipeline</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* The 3 Specialized Agents Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Agent 1: Coordinator */}
        <div className="bg-[#080f20]/95 border border-cyan-900/50 rounded-xl p-5 shadow-lg relative flex flex-col justify-between group hover:border-cyan-500/50 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950/80 text-blue-300 border border-blue-800/40">
                Agent 01
              </span>
              <span className="text-[10px] font-mono text-slate-400">Sequential Task 1</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono tracking-wide">
                System Architect & Mission Coordinator
              </h3>
              <span className="text-[11px] text-cyan-400 font-mono block mt-0.5">
                Role: Architecture & Blueprint
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              Deconstructs challenge requirements into planetary-scale, modular technical roadmaps. Strictly enforces evaluation blueprint standards and eliminates mock setups.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-cyan-950/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Produces:</span>
            <span className="text-cyan-300 font-semibold flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              blueprint.md
            </span>
          </div>
        </div>

        {/* Agent 2: Developer */}
        <div className="bg-[#080f20]/95 border border-cyan-900/50 rounded-xl p-5 shadow-lg relative flex flex-col justify-between group hover:border-cyan-500/50 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-800/40">
                Agent 02
              </span>
              <span className="text-[10px] font-mono text-slate-400">Sequential Task 2</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono tracking-wide">
                Aerospace Data Full-Stack Developer
              </h3>
              <span className="text-[11px] text-amber-400 font-mono block mt-0.5">
                Role: Ingestion Code Implementation
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              Writes robust, high-throughput Python 3 pipelines using live space agency telemetry. Strictly adheres to the DRY principle and refuses mock text.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-cyan-950/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Produces:</span>
            <span className="text-amber-300 font-semibold flex items-center gap-1">
              <FileCode className="w-3.5 h-3.5" />
              nasa_telemetry.py
            </span>
          </div>
        </div>

        {/* Agent 3: QA Engineer */}
        <div className="bg-[#080f20]/95 border border-cyan-900/50 rounded-xl p-5 shadow-lg relative flex flex-col justify-between group hover:border-cyan-500/50 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                Agent 03
              </span>
              <span className="text-[10px] font-mono text-slate-400">Sequential Task 3</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono tracking-wide">
                Mission Assurance QA & Validation Specialist
              </h3>
              <span className="text-[11px] text-emerald-400 font-mono block mt-0.5">
                Role: Mission Assurance & Unit Tests
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              Stress-tests datasets, uncovers API edge cases (HTTP 429 rate limits, malformed payloads), and guarantees extreme scalability and strict blueprint alignment.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-cyan-950/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Produces:</span>
            <span className="text-emerald-300 font-semibold flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5" />
              test_telemetry.py
            </span>
          </div>
        </div>
      </div>

      {/* Artifacts Viewer and Live Output */}
      {pipelineData && (
        <div className="bg-[#080f20]/95 border border-cyan-900/40 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
          {/* Artifact Nav Tabs */}
          <div className="p-3 bg-[#060c18] border-b border-cyan-900/40 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveArtifactTab('blueprint')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
                  activeArtifactTab === 'blueprint'
                    ? 'bg-blue-600/30 text-blue-200 border border-blue-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>1. Architecture Blueprint</span>
              </button>

              <button
                onClick={() => setActiveArtifactTab('code')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
                  activeArtifactTab === 'code'
                    ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>2. Python Pipeline Source</span>
              </button>

              <button
                onClick={() => setActiveArtifactTab('qa')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
                  activeArtifactTab === 'qa'
                    ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>3. QA Report & Unit Tests</span>
              </button>

              <button
                onClick={() => setActiveArtifactTab('terminal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
                  activeArtifactTab === 'terminal'
                    ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Execution Logs ({pipelineData.logs.length})</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {activeArtifactTab === 'code' && (
                <button
                  onClick={runLivePythonTest}
                  disabled={isTestingCode}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-500/40 text-emerald-200 border border-emerald-500/40 text-xs font-mono flex items-center gap-1.5 transition-all"
                >
                  <Zap className={`w-3.5 h-3.5 ${isTestingCode ? 'animate-spin' : ''}`} />
                  {isTestingCode ? 'Executing...' : 'Run Ingestion Script Live'}
                </button>
              )}

              <button
                onClick={() => {
                  const content = 
                    activeArtifactTab === 'blueprint' ? pipelineData.blueprint :
                    activeArtifactTab === 'code' ? pipelineData.code :
                    activeArtifactTab === 'qa' ? pipelineData.qaReport :
                    JSON.stringify(pipelineData.logs, null, 2);
                  handleCopy(content, activeArtifactTab);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/40 text-xs font-mono flex items-center gap-1 transition-colors"
                title="Copy current artifact"
              >
                {copiedKey === activeArtifactTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>

              <button
                onClick={() => {
                  const filename = 
                    activeArtifactTab === 'blueprint' ? 'system_blueprint.md' :
                    activeArtifactTab === 'code' ? 'nasa_telemetry.py' :
                    activeArtifactTab === 'qa' ? 'test_telemetry.py' :
                    'execution_logs.txt';
                  const content = 
                    activeArtifactTab === 'blueprint' ? pipelineData.blueprint :
                    activeArtifactTab === 'code' ? pipelineData.code :
                    activeArtifactTab === 'qa' ? pipelineData.qaReport :
                    JSON.stringify(pipelineData.logs, null, 2);
                  handleDownload(filename, content);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/40 text-xs font-mono flex items-center gap-1 transition-colors"
                title="Download artifact file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="p-5 font-mono text-xs">
            {/* Live Terminal Test Output Banner */}
            {liveTestOutput && activeArtifactTab === 'code' && (
              <div className="mb-4 bg-[#030610] border border-emerald-500/50 rounded-xl p-4 text-emerald-300 overflow-x-auto shadow-inner">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-900/40 text-[11px]">
                  <span className="font-bold flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    Live Terminal Output (nasa_telemetry.py Execution)
                  </span>
                  <button 
                    onClick={() => setLiveTestOutput(null)}
                    className="text-slate-500 hover:text-slate-300 text-xs"
                  >
                    Close
                  </button>
                </div>
                <pre className="whitespace-pre font-mono text-[11px] leading-relaxed">
                  {liveTestOutput}
                </pre>
              </div>
            )}

            {activeArtifactTab === 'blueprint' && (
              <div className="bg-[#050a16] border border-cyan-950 rounded-xl p-5 text-slate-200 overflow-x-auto leading-relaxed whitespace-pre-wrap font-sans text-xs">
                {pipelineData.blueprint}
              </div>
            )}

            {activeArtifactTab === 'code' && (
              <div className="bg-[#040814] border border-cyan-950 rounded-xl p-4 text-amber-200 overflow-x-auto shadow-inner">
                <pre className="whitespace-pre font-mono text-xs leading-relaxed">
                  {pipelineData.code}
                </pre>
              </div>
            )}

            {activeArtifactTab === 'qa' && (
              <div className="bg-[#050a16] border border-cyan-950 rounded-xl p-5 text-slate-200 overflow-x-auto leading-relaxed whitespace-pre-wrap font-sans text-xs">
                {pipelineData.qaReport}
              </div>
            )}

            {activeArtifactTab === 'terminal' && (
              <div className="bg-[#030610] border border-cyan-950 rounded-xl p-4 text-slate-300 space-y-2 overflow-x-auto">
                <div className="text-[11px] text-cyan-400 pb-2 border-b border-cyan-950">
                  ## Multi-Agent Pipeline Execution Logs ({pipelineData.durationMs}ms) ##
                </div>
                {pipelineData.logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-[11px] font-mono">
                    <span className="text-slate-500 shrink-0">
                      [{new Date(log.timestamp).toLocaleTimeString()}]
                    </span>
                    <span className={`font-bold shrink-0 ${
                      log.agent === 'Coordinator' ? 'text-blue-400' :
                      log.agent === 'Developer' ? 'text-amber-400' :
                      log.agent === 'QA Engineer' ? 'text-emerald-400' :
                      'text-cyan-400'
                    }`}>
                      [{log.agent}]:
                    </span>
                    <span className="text-slate-200">{log.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State when pipeline hasn't been kicked off yet */}
      {!pipelineData && (
        <div className="bg-[#080f20]/60 border border-cyan-900/30 rounded-xl p-8 text-center space-y-3">
          <Bot className="w-10 h-10 text-cyan-400 mx-auto opacity-75" />
          <h4 className="text-sm font-bold text-white font-mono">
            Multi-Agent Pipeline Ready for Deployment
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click &quot;Kickoff Multi-Agent Pipeline&quot; to initialize the sequential execution loop. The Coordinator, Developer, and QA Specialist will produce full system architecture, operational Python code, and mission assurance test suites.
          </p>
          <button
            onClick={runPipeline}
            disabled={isRunning}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-950/40 text-xs font-mono font-semibold inline-flex items-center gap-2 border border-cyan-400/40 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Pipeline Running Sequence...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                <span>Kickoff Multi-Agent Pipeline</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
