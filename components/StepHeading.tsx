export function StepHeading({ n, id, title, hint }: { n: number; id: string; title: string; hint?: string }) {
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-forest text-xs font-semibold text-paper"
      >
        {n}
      </span>
      <div>
        <h2 id={id} className="text-base font-semibold leading-6 tracking-tight">
          {title}
        </h2>
        {hint && <p className="text-sm text-muted">{hint}</p>}
      </div>
    </div>
  )
}
