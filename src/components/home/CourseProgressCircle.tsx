interface CourseProgressCircleProps {
  percentage: number;
  completedCount: number;
  totalCount: number;
  size?: number;
  strokeWidth?: number;
}

export function CourseProgressCircle({
  percentage,
  completedCount,
  totalCount,
  size = 140,
  strokeWidth = 10,
}: CourseProgressCircleProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="w-full h-full -rotate-90 transform"
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
        >
          {/* Cercle de fond */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-pale-pink"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Cercle de progression */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-primary-red transition-all duration-700 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Contenu central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-display text-3xl font-bold tracking-tight text-ink leading-none">
            {percentage}%
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink/75 mt-0.5">
            FAIT
          </span>
        </div>
      </div>

      <span className="mt-2 font-mono text-[11px] font-bold text-ink/80 text-center">
        {completedCount} sur {totalCount} validés
      </span>
    </div>
  );
}
