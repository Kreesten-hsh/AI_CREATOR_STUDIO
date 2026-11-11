interface CourseProgressCircleProps {
  percentage: number;
}

export function CourseProgressCircle({ percentage }: CourseProgressCircleProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  return (
    <div
      aria-label={`Progression globale : ${clampedPercentage}% fait`}
      className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full shadow-brutal flex items-center justify-center shrink-0 select-none bg-surface"
    >
      {/* Anneau SVG unique sans double contour ni rail gris parasite */}
      <svg
        className="w-full h-full"
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        {/* Disque blanc plein et bordure noire extérieure unique style Abigail */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="#FFFDFC"
          stroke="#1F1916"
          strokeWidth="3"
        />

        {/* Arc de progression dynamique sur la bordure extérieure */}
        {clampedPercentage > 0 && (
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#C94A4A"
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            className="-rotate-90 origin-center transition-all duration-500 ease-out"
          />
        )}
      </svg>

      {/* Contenu textuel centré style sticker Abigail */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-display text-3xl sm:text-4xl font-black tracking-tight text-ink leading-none">
          {clampedPercentage}%
        </span>
        <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-ink mt-1">
          FAIT
        </span>
      </div>
    </div>
  );
}
