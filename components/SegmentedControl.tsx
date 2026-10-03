"use client"

type Option<T extends string> = { value: T; label: string }

/** A native radio group styled as a segmented control, so arrow keys and focus behave as expected. */
export function SegmentedControl<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
}: {
  name: string
  legend: string
  options: readonly Option<T>[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">{legend}</legend>
      <div className="inline-flex rounded-full border border-line bg-paper p-1">
        {options.map((o) => (
          <label
            key={o.value}
            className={[
              "relative flex min-h-9 cursor-pointer items-center rounded-full px-4 text-sm font-medium transition-colors",
              "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-forest",
              o.value === value ? "bg-forest text-paper" : "text-ink hover:bg-chartreuse-soft",
            ].join(" ")}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={o.value === value}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
