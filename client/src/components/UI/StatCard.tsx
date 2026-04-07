import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { formatNumber } from '../../utils/helpers'

interface StatCardProps {
  label: string
  value: number | string | null | undefined
  icon: React.ReactNode
  color?: string
  format?: 'number' | 'string' | 'bytes'
  suffix?: string
}

export function StatCard({ label, value, icon, color = '#7c3aed', format = 'number', suffix = '' }: StatCardProps) {
  const numValue = typeof value === 'number' ? value : null
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (numValue === null) return
    let start = 0
    const end = numValue
    const duration = 1200
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [numValue])

  const formatted = numValue !== null
    ? formatNumber(displayValue) + suffix
    : (typeof value === 'string' ? value : 'N/A')

  return (
    <div ref={ref} className="card flex items-center gap-4">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}18`, border: `1px solid ${color}28` }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p className="text-xl font-bold text-white">{formatted}</p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </div>
  )
}

interface ProgressBarProps {
  value: number
  max: number
  color?: string
  label?: string
  showValue?: boolean
}

export function ProgressBar({ value, max, color = '#7c3aed', label, showValue = true }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div>
      {(label || showValue) && (
        <div className="flex justify-between text-xs mb-1.5">
          {label && <span className="text-muted">{label}</span>}
          {showValue && <span className="text-white/60">{formatNumber(value)}</span>}
        </div>
      )}
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
        />
      </div>
    </div>
  )
}
