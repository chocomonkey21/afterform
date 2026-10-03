/** Two overlapping circles: the "before" outline and the "after" fill. */
export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="12.5" cy="16" r="7.5" fill="none" stroke="#1F4D3A" strokeWidth="2.5" />
      <circle cx="19.5" cy="16" r="7.5" fill="#D7E86B" fillOpacity="0.92" stroke="#1F4D3A" strokeWidth="2.5" />
    </svg>
  )
}
