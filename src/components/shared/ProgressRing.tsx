interface ProgressRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
  color?: string
  showLabel?: boolean
}

export function ProgressRing({ percentage, size = 48, strokeWidth = 4, color = 'var(--color-brand)', showLabel = true }: ProgressRingProps) {
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - Math.min(100, percentage) / 100)

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="drop-shadow-sm">
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-all duration-700 ease-out"
          style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
        />
      </svg>
      {showLabel && (
        <span className="absolute text-[10px] font-bold text-white/80">{Math.round(percentage)}%</span>
      )}
    </div>
  )
}
