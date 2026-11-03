interface CourseProgressCircleProps {
  percentage: number;
}

export function CourseProgressCircle({ percentage }: CourseProgressCircleProps) {
  return (
    <div
      aria-label={`Progression globale : ${percentage}%`}
      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-surface border-2 border-ink shadow-brutal-xs flex flex-col items-center justify-center text-center shrink-0 select-none"
    >
      <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink leading-none">
        {percentage}%
      </span>
      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink/75 mt-0.5">
        FAIT
      </span>
    </div>
  );
}
