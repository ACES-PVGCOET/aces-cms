import { useState, useMemo } from 'react';
import { Users, Sparkles } from 'lucide-react';

const GUILD_COLOR_PALETTES = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#8b5cf6', // Violet
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#f43f5e', // Rose
  '#14b8a6', // Teal
  '#84cc16', // Lime
  '#a855f7', // Purple
];

const RADIUS = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function computeDonutSlices(teamsData, totalActive) {
  let accumulated = 0;
  const result = [];
  for (let i = 0; i < teamsData.length; i++) {
    const team = teamsData[i];
    const percent = team.count / totalActive;
    const dashLength = percent * CIRCUMFERENCE;
    const strokeDasharray = `${dashLength} ${CIRCUMFERENCE - dashLength}`;
    const strokeDashoffset = -accumulated * CIRCUMFERENCE;
    accumulated += percent;

    result.push({
      ...team,
      percent: Math.round(percent * 100),
      strokeDasharray,
      strokeDashoffset,
    });
  }
  return result;
}

/**
 * ActiveMembersPieCard Component
 * Multi-Theme dynamic active members donut breakdown.
 */
export function ActiveMembersPieCard({ members = [] }) {
  const activeMembers = useMemo(() => members.filter((m) => m.status === 'ACTIVE' || m.status === 'Active'), [members]);
  const totalActive = activeMembers.length || members.length || 1;

  const teamsData = useMemo(() => {
    const teamDistribution = members.reduce((acc, m, idx) => {
      const team = m.team || 'Unassigned';
      if (!acc[team]) {
        acc[team] = {
          name: team,
          count: 0,
          color: GUILD_COLOR_PALETTES[Object.keys(acc).length % GUILD_COLOR_PALETTES.length],
        };
      }
      acc[team].count += 1;
      return acc;
    }, {});

    return Object.values(teamDistribution).sort((a, b) => b.count - a.count);
  }, [members]);

  const slices = useMemo(() => {
    return computeDonutSlices(teamsData, totalActive);
  }, [teamsData, totalActive]);

  const [hoveredSlice, setHoveredSlice] = useState(null);

  return (
    <div
      className="w-full h-full glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden transition-all duration-300 group flex flex-col justify-between"
      role="region"
      aria-label="Active Members with Guild Breakdown"
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs leading-4 font-bold uppercase tracking-wider opacity-70 font-sans">
              Active Members
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold btn-secondary">
              <Sparkles className="w-2.5 h-2.5" />
              <span>By Guild</span>
            </span>
          </div>

          <div className="w-10 h-10 rounded-xl flex items-center justify-center btn-secondary shrink-0 shadow-xs">
            <Users className="w-4 h-4" />
          </div>
        </div>

        {/* Content: Large Numeric Value & SVG Pie Chart */}
        <div className="flex items-center justify-between gap-4 pt-1 pb-2">
          
          <div className="space-y-1">
            <div className="text-3xl leading-9 sm:text-4xl sm:leading-10 font-extrabold tracking-tight font-sans">
              {totalActive}
            </div>

            {hoveredSlice ? (
              <div className="text-xs leading-4 font-bold flex items-center gap-1.5 animate-in fade-in duration-150">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: hoveredSlice.color }}
                />
                <span className="truncate max-w-[110px]">{hoveredSlice.name}:</span>
                <strong className="font-extrabold">{hoveredSlice.count} ({hoveredSlice.percent}%)</strong>
              </div>
            ) : (
              <div className="text-xs leading-4 font-semibold opacity-60">
                {teamsData.length} Active Guilds
              </div>
            )}
          </div>

          {/* SVG Donut Chart */}
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg
              className="w-full h-full -rotate-90 transform"
              viewBox="0 0 88 88"
            >
              <circle
                cx="44"
                cy="44"
                r={RADIUS}
                className="opacity-20"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
              />

              {slices.map((slice) => {
                const isHovered = hoveredSlice?.name === slice.name;
                return (
                  <circle
                    key={slice.name}
                    cx="44"
                    cy="44"
                    r={RADIUS}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={isHovered ? 12 : 10}
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    className="transition-all duration-200 cursor-pointer"
                    style={{
                      opacity: hoveredSlice && !isHovered ? 0.35 : 1,
                    }}
                    onMouseEnter={() => setHoveredSlice(slice)}
                    onMouseLeave={() => setHoveredSlice(null)}
                  />
                );
              })}
            </svg>

            {/* Donut Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none">
              <span className="text-xs leading-4 font-black">
                {hoveredSlice ? `${hoveredSlice.percent}%` : totalActive}
              </span>
              <span className="text-[8px] font-bold opacity-60 uppercase tracking-tighter">
                {hoveredSlice ? 'Guild' : 'Active'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Guild Swatches */}
      <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto pb-0.5">
        {teamsData.slice(0, 5).map((t) => (
          <button
            key={t.name}
            type="button"
            onMouseEnter={() => {
              const matched = slices.find((s) => s.name === t.name);
              setHoveredSlice(matched || null);
            }}
            onMouseLeave={() => setHoveredSlice(null)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all duration-200 shrink-0 cursor-pointer ${
              hoveredSlice?.name === t.name
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: t.color }}
            />
            <span className="truncate max-w-[55px]">{t.name}</span>
          </button>
        ))}
        {teamsData.length > 5 && (
          <span className="text-[10px] opacity-60 font-bold px-1 shrink-0">
            +{teamsData.length - 5}
          </span>
        )}
      </div>

    </div>
  );
}

export default ActiveMembersPieCard;
