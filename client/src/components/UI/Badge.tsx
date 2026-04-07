import { getPipelineColor } from '../../utils/helpers'

interface BadgeProps {
  label: string
  color?: string
  size?: 'sm' | 'md'
}

export function Badge({ label, color, size = 'sm' }: BadgeProps) {
  const bg = color || getPipelineColor(label)
  return (
    <span
      className={`badge ${size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'}`}
      style={{ backgroundColor: `${bg}20`, color: bg, border: `1px solid ${bg}30` }}
    >
      {label}
    </span>
  )
}

export function PipelineBadge({ tag }: { tag?: string }) {
  if (!tag) return null
  const color = getPipelineColor(tag)
  const label = tag.replace(/-/g, ' ')
  return (
    <span
      className="badge text-[10px] px-2 py-0.5 font-medium capitalize"
      style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}28` }}
    >
      {label}
    </span>
  )
}

export function LibraryBadge({ lib }: { lib?: string }) {
  if (!lib) return null
  return (
    <span className="badge text-[10px] px-2 py-0.5 bg-white/5 text-white/50 border border-white/10">
      {lib}
    </span>
  )
}
