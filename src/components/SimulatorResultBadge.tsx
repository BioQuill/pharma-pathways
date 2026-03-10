/**
 * SimulatorResultBadge — Navy/Gold circular result badge per SIM1b spec.
 * 96px outer ring (gold #F59E0B, 4px), 80px inner circle (navy #1e3a5f).
 * Number: white, DM Mono 500 28px. Label: white, Manrope 400 11px.
 */
interface SimulatorResultBadgeProps {
  value: number | string;
  label: string;
  suffix?: string;
  secondaryStats?: { label: string; value: string }[];
  autoBaseline?: boolean;
}

export function SimulatorResultBadge({
  value,
  label,
  suffix = "%",
  secondaryStats,
  autoBaseline = false,
}: SimulatorResultBadgeProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {autoBaseline && (
        <p className="text-xs text-[#F59E0B] font-medium text-center">
          Auto-calculated from molecule data · Adjust below
        </p>
      )}
      {/* Outer ring */}
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: 96,
          height: 96,
          border: "4px solid #F59E0B",
          background: "transparent",
        }}
      >
        {/* Inner circle */}
        <div
          className="flex flex-col items-center justify-center rounded-full"
          style={{
            width: 80,
            height: 80,
            backgroundColor: "#1e3a5f",
          }}
        >
          <span
            className="text-white font-medium leading-none"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 28,
            }}
          >
            {value}
          </span>
          {suffix && (
            <span
              className="text-white/70 leading-none mt-0.5"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
              }}
            >
              {suffix}
            </span>
          )}
        </div>
      </div>
      {/* Label */}
      <span
        className="text-white text-center leading-tight"
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: 11,
          fontWeight: 400,
          color: "#1e3a5f",
        }}
      >
        {label}
      </span>
      {/* Secondary stats */}
      {secondaryStats && secondaryStats.length > 0 && (
        <div className="flex flex-col items-center gap-0.5">
          {secondaryStats.map((stat, i) => (
            <span
              key={i}
              className="text-center"
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 13,
                fontWeight: 400,
                color: "#64748b",
              }}
            >
              {stat.label}: {stat.value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
