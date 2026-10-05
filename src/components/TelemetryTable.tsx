import React, { useState } from 'react';
import { TelemetryObject, UnitSystem } from '../types/nasa';
import { 
  ShieldAlert, 
  ExternalLink, 
  Download, 
  ArrowUpDown, 
  Search, 
  Eye, 
  Copy, 
  Check, 
  Info,
  Flame
} from 'lucide-react';

interface TelemetryTableProps {
  data: TelemetryObject[];
  onSelectNeo: (neo: TelemetryObject) => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  hazardousOnly?: boolean;
  setHazardousOnly?: (val: boolean) => void;
  onOpenPdcoPipeline?: () => void;
  unitSystem?: UnitSystem;
}

export const TelemetryTable: React.FC<TelemetryTableProps> = ({ 
  data, 
  onSelectNeo,
  searchQuery: controlledSearch,
  setSearchQuery: setControlledSearch,
  hazardousOnly: controlledHazardous,
  setHazardousOnly: setControlledHazardous,
  onOpenPdcoPipeline,
  unitSystem = 'metric'
}) => {
  const isImperial = unitSystem === 'imperial';
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Streamlit Filter Controls State
  const [internalSearch, setInternalSearch] = useState('');
  const [internalHazardous, setInternalHazardous] = useState(false);

  const search = controlledSearch !== undefined ? controlledSearch : internalSearch;
  const setSearch = setControlledSearch || setInternalSearch;

  const hazardousOnly = controlledHazardous !== undefined ? controlledHazardous : internalHazardous;
  const setHazardousOnly = setControlledHazardous || setInternalHazardous;

  // 1. Filter controls:
  // filtered_df = df_asteroids.copy()
  // if search: filtered_df[name.contains(search) | id.contains(search)]
  // if hazardous_only: filtered_df[is_potentially_hazardous_asteroid == True]
  const isControlled = controlledSearch !== undefined && controlledHazardous !== undefined;

  const displayData = React.useMemo(() => {
    if (isControlled) {
      return data;
    }
    let filtered_df = [...data];
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      filtered_df = filtered_df.filter(
        item => item.name.toLowerCase().includes(q) || String(item.id).toLowerCase().includes(q)
      );
    }
    if (hazardousOnly) {
      filtered_df = filtered_df.filter(item => item.hazardous);
    }
    return filtered_df;
  }, [data, search, hazardousOnly, isControlled]);

  const handleCopy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // 2. CSV Conversion
  const exportCSV = () => {
    const headers = [
      'id',
      'name',
      'is_potentially_hazardous_asteroid',
      'estimated_diameter_min_m',
      'estimated_diameter_max_m',
      'estimated_diameter_min_ft',
      'estimated_diameter_max_ft',
      'relative_velocity_kmh',
      'relative_velocity_kms',
      'relative_velocity_mph',
      'miss_distance_km',
      'miss_distance_miles',
      'miss_distance_lunar',
      'close_approach_date',
      'absolute_magnitude_h',
      'kinetic_energy_mt'
    ];

    const rows = displayData.map((item) => [
      `"${item.id}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      item.hazardous ? 'True' : 'False',
      item.diameterMinM,
      item.diameterMaxM,
      item.diameterMinFt,
      item.diameterMaxFt,
      item.velocityKmh,
      item.velocityKms,
      item.velocityMph,
      item.missDistanceKm,
      item.missDistanceMiles,
      item.missDistanceLunar,
      `"${item.closeApproachDateFull || item.closeApproachDate}"`,
      item.absoluteMagnitude,
      item.kineticEnergyMt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    // 3. Download Button: file_name="filtered_asteroid_telemetry.csv", mime="text/csv"
    link.setAttribute('download', 'filtered_asteroid_telemetry.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(displayData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', 'filtered_asteroid_telemetry.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(displayData.length / itemsPerPage);
  const currentItems = displayData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-[#091122]/95 border border-cyan-900/40 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
      {/* 1. Filter controls & 3. Download Button (Streamlit render_telemetry_table implementation) */}
      <div className="p-4 border-b border-cyan-900/40 bg-[#070e1c] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 flex-1">
          {/* search = st.text_input("Filter asteroid name or ID:") */}
          <div className="flex-1 max-w-sm">
            <label 
              htmlFor="telemetry-table-search" 
              className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono"
            >
              Filter asteroid name or ID:
            </label>
            <div className="relative">
              <input
                id="telemetry-table-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter asteroid name or ID:"
                className="w-full bg-[#050a16] border border-cyan-900/60 rounded-lg px-3 py-2 pl-9 font-mono text-cyan-200 text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-500 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* hazardous_only = st.checkbox("Show Potentially Hazardous Only") */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-200 hover:text-white transition-colors bg-[#050a16] border border-cyan-900/50 hover:border-cyan-700/60 px-3 py-2 rounded-lg">
              <input
                type="checkbox"
                checked={hazardousOnly}
                onChange={(e) => setHazardousOnly(e.target.checked)}
                className="w-4 h-4 rounded border-cyan-700 bg-[#050a16] text-cyan-500 focus:ring-cyan-500/20 cursor-pointer accent-cyan-500"
              />
              <span className="flex items-center gap-1.5 font-mono font-medium">
                <ShieldAlert className={`w-3.5 h-3.5 ${hazardousOnly ? 'text-red-400' : 'text-slate-400'}`} />
                Show Potentially Hazardous Only
              </span>
            </label>
          </div>
        </div>

        {/* 3. Download Button: st.download_button(label=f"⬇ Download Filtered CSV ({len(filtered_df)} records)") */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-lg font-mono font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-950/40 text-xs flex items-center gap-2 border border-cyan-400/40 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
            title={`⬇ Download Filtered CSV (${displayData.length} records)`}
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>⬇ Download Filtered CSV ({displayData.length} records)</span>
          </button>

          {onOpenPdcoPipeline && (
            <button
              onClick={onOpenPdcoPipeline}
              className="px-3 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-700/60 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap"
              title="Send CSV to PDCO Torino AI Pipeline"
            >
              <span>🛡️</span>
              <span>PDCO Torino AI</span>
            </button>
          )}

          <button
            onClick={exportJSON}
            className="px-3 py-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/40 text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Download JSON payload"
          >
            <Download className="w-3 h-3" />
            JSON
          </button>
        </div>
      </div>

      {/* 4. Display Table: st.dataframe(filtered_df) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#060c18] border-b border-cyan-900/60 text-slate-400 font-mono uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3">Hazard</th>
              <th className="py-3 px-3">ID</th>
              <th className="py-3 px-4">Designation Name</th>
              <th className="py-3 px-3 text-right">Max Diameter ({isImperial ? 'ft' : 'm'})</th>
              <th className="py-3 px-3 text-right">Velocity ({isImperial ? 'mph' : 'km/h'})</th>
              <th className="py-3 px-3 text-right">Miss Distance ({isImperial ? 'mi' : 'km'})</th>
              <th className="py-3 px-3 text-right">Miss (LD)</th>
              <th className="py-3 px-3">Approach Date</th>
              <th className="py-3 px-3 text-right">Est. Energy (Mt)</th>
              <th className="py-3 px-3 text-center">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-950/40 font-mono">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400 font-sans">
                  No near-earth objects matched the selected filters.
                </td>
              </tr>
            ) : (
              currentItems.map((item) => {
                // Apply Streamlit's #ff4b4b22 hazardous styling
                const isHazard = item.hazardous;
                const rowBg = isHazard ? 'bg-[#ff4b4b]/12 hover:bg-[#ff4b4b]/20 border-l-4 border-l-red-500' : 'hover:bg-cyan-950/20';

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectNeo(item)}
                    className={`cursor-pointer transition-colors ${rowBg}`}
                  >
                    {/* Hazard Status Badge */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {isHazard ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse">
                          <ShieldAlert className="w-3 h-3 text-red-400" />
                          HAZARDOUS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] text-emerald-400/80 bg-emerald-950/30 border border-emerald-900/30">
                          SAFE
                        </span>
                      )}
                    </td>

                    {/* ID with Copy Button */}
                    <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span>{item.id}</span>
                        <button
                          onClick={(e) => handleCopy(item.id, e)}
                          className="text-slate-500 hover:text-cyan-300 p-0.5 transition-colors"
                          title="Copy Catalog Reference ID"
                        >
                          {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>

                    {/* Designation Name */}
                    <td className="py-3 px-4 font-semibold text-slate-100 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className={isHazard ? 'text-red-200' : 'text-cyan-200'}>{item.name}</span>
                        <a
                          href={item.jplUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-500 hover:text-cyan-400 p-0.5 transition-colors"
                          title="Open Small-Body Database record"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>

                    {/* Max Diameter */}
                    <td className="py-3 px-3 text-right font-medium text-slate-200 whitespace-nowrap">
                      {isImperial ? (
                        <>
                          <span>{item.diameterMaxFt.toLocaleString()} ft</span>
                          <span className="text-[10px] text-slate-500 block">
                            {item.diameterMaxFt >= 5280 ? `${(item.diameterMaxFt / 5280).toFixed(2)} mi` : `${item.diameterMinFt.toFixed(0)} ft min`}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>{item.diameterMaxM.toLocaleString()} m</span>
                          <span className="text-[10px] text-slate-500 block">
                            {item.diameterMaxM >= 100 ? `${(item.diameterMaxM / 1000).toFixed(2)} km` : `${item.diameterMinM.toFixed(0)}m min`}
                          </span>
                        </>
                      )}
                    </td>

                    {/* Velocity */}
                    <td className="py-3 px-3 text-right font-medium text-amber-200 whitespace-nowrap">
                      {isImperial ? (
                        <>
                          <span>{item.velocityMph.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 block font-normal">
                            {(item.velocityMps).toFixed(1)} mi/s
                          </span>
                        </>
                      ) : (
                        <>
                          <span>{item.velocityKmh.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 block font-normal">
                            {(item.velocityKms).toFixed(1)} km/s
                          </span>
                        </>
                      )}
                    </td>

                    {/* Miss Distance */}
                    <td className="py-3 px-3 text-right text-slate-300 whitespace-nowrap">
                      {isImperial ? (
                        <>
                          <span>{item.missDistanceMiles.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-500 block">miles</span>
                        </>
                      ) : (
                        <>
                          <span>{item.missDistanceKm.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-500 block">km</span>
                        </>
                      )}
                    </td>

                    {/* Miss Distance (Lunar Distances) */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <span className={`font-semibold ${item.missDistanceLunar < 1 ? 'text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-500/40' : item.missDistanceLunar < 5 ? 'text-amber-300' : 'text-cyan-300'}`}>
                        {item.missDistanceLunar.toFixed(2)} LD
                      </span>
                    </td>

                    {/* Approach Date */}
                    <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                      <span>{item.closeApproachDateFull || item.closeApproachDate}</span>
                    </td>

                    {/* Est Kinetic Energy */}
                    <td className="py-3 px-3 text-right text-slate-200 whitespace-nowrap">
                      <span className="flex items-center justify-end gap-1 font-mono">
                        {item.kineticEnergyMt > 100 && <Flame className="w-3 h-3 text-red-400" />}
                        {item.kineticEnergyMt > 0 ? item.kineticEnergyMt.toLocaleString() : '< 0.01'}
                      </span>
                    </td>

                    {/* Inspect Button */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectNeo(item);
                        }}
                        className="px-2 py-1 rounded bg-cyan-950/80 hover:bg-cyan-800/80 text-cyan-300 border border-cyan-800/50 hover:border-cyan-400 text-[11px] inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-cyan-900/40 bg-[#070e1c] flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, data.length)} of {data.length} objects
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/40 disabled:opacity-30 disabled:cursor-not-allowed text-cyan-300"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-7 h-7 rounded text-xs transition-colors ${
                  currentPage === idx + 1
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 border border-cyan-800/30'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/40 disabled:opacity-30 disabled:cursor-not-allowed text-cyan-300"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
