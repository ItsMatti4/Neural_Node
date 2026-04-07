import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Check, ExternalLink, Award, Download, Heart,
  FileCode2, Cpu, Globe2, Network, Shield, Trophy
} from 'lucide-react'
import type { HFModel } from '../../types'
import {
  formatNumber, formatBytes, getModelAuthor, getModelName,
  getTotalModelSize, getModelParameters, formatParameters, getLicense, timeAgo,
  getBaseModel, getLanguageCount, getDatasetCount, getInferenceStatus
} from '../../utils/helpers'
import { PipelineBadge } from '../UI/Badge'
import { RadarCompareChart, BarCompareChart } from '../Charts/Charts'
import { useCompareStore } from '../../stores/useCompareStore'

const COLORS = ['#7c3aed', '#2563eb', '#06b6d4', '#10b981']

interface CompareViewProps {
  models: HFModel[]
}

interface MetricRow {
  label: string
  icon: React.ReactNode
  getValue: (m: HFModel) => string | number | null
  higherIsBetter?: boolean
}

const metrics: MetricRow[] = [
  { label: 'Author', icon: <Award className="w-4 h-4" />, getValue: getModelAuthor },
  { label: 'Base Model', icon: <Network className="w-4 h-4" />, getValue: (m) => getBaseModel(m) || 'None / Original' },
  { label: 'Pipeline', icon: <Cpu className="w-4 h-4" />, getValue: (m) => m.pipeline_tag || 'N/A' },
  { label: 'Library', icon: <FileCode2 className="w-4 h-4" />, getValue: (m) => m.library_name || 'N/A' },
  { label: 'Downloads', icon: <Download className="w-4 h-4" />, getValue: (m) => m.downloads ?? null, higherIsBetter: true },
  { label: 'Likes', icon: <Heart className="w-4 h-4" />, getValue: (m) => m.likes ?? null, higherIsBetter: true },
  { label: 'Parameters', icon: <Cpu className="w-4 h-4" />, getValue: (m) => getModelParameters(m) ?? null, higherIsBetter: true },
  { label: 'File Size', icon: <FileCode2 className="w-4 h-4" />, getValue: (m) => getTotalModelSize(m) },
  { label: 'Datasets', icon: <Network className="w-4 h-4" />, getValue: (m) => getDatasetCount(m), higherIsBetter: true },
  { label: 'Languages', icon: <Globe2 className="w-4 h-4" />, getValue: (m) => getLanguageCount(m), higherIsBetter: true },
  { label: 'Inference', icon: <Cpu className="w-4 h-4" />, getValue: getInferenceStatus },
  { label: 'License', icon: <Shield className="w-4 h-4" />, getValue: getLicense },
  { label: 'Last Updated', icon: <Award className="w-4 h-4" />, getValue: (m) => timeAgo(m.lastModified) },
]

function formatMetricValue(metric: MetricRow, m: HFModel): string {
  const val = metric.getValue(m)
  if (val === null || val === undefined) return 'N/A'
  if (metric.label === 'Downloads' || metric.label === 'Likes') return formatNumber(val as number)
  if (metric.label === 'Parameters') return formatParameters(val as number)
  if (metric.label === 'File Size') return formatBytes(val as number)
  return String(val)
}

function getBestIndex(metric: MetricRow, models: HFModel[]): number {
  if (!metric.higherIsBetter) return -1
  let bestIdx = -1
  let bestVal = -Infinity
  models.forEach((m, i) => {
    const val = metric.getValue(m)
    if (typeof val === 'number' && val > bestVal) { bestVal = val; bestIdx = i }
  })
  return bestIdx
}

export default function CompareView({ models }: CompareViewProps) {
  const { removeModel } = useCompareStore()
  const [activeChart, setActiveChart] = useState<'radar' | 'downloads' | 'likes' | 'parameters'>('radar')

  return (
    <div className="space-y-8">
      {/* Model giant header cards */}
      <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${models.length}, 1fr)` }}>
        {models.map((m, i) => {
          const id = m.id || m.modelId || ''
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative overflow-hidden rounded-3xl p-6 group"
              style={{
                background: `linear-gradient(145deg, rgba(19,19,31,0.95), rgba(19,19,31,0.8))`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.5), inset 0 1px 1px ${COLORS[i]}40`,
                border: `1px solid ${COLORS[i]}30`
              }}
            >
              {/* Background Glow */}
              <div
                className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[60px] opacity-20 pointer-events-none transition-opacity group-hover:opacity-40"
                style={{ background: COLORS[i] }}
              />
              
              <button
                onClick={() => removeModel(id)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white/40 hover:text-white/90 hover:bg-black/40 transition-all z-10"
              >
                <span className="text-sm">✕</span>
              </button>

              <div
                className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center text-2xl font-bold shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${COLORS[i]}30, ${COLORS[i]}10)`,
                  border: `1px solid ${COLORS[i]}50`,
                  color: COLORS[i]
                }}
              >
                {getModelName(m)[0]?.toUpperCase()}
              </div>

              <div className="space-y-1 z-10 relative">
                <p className="text-xs font-semibold tracking-wider text-white/40 uppercase">{getModelAuthor(m)}</p>
                <h3 className="font-bold text-xl text-white truncate group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300" style={{ backgroundImage: `linear-gradient(to right, #fff, ${COLORS[i]})` }} title={id}>
                  {getModelName(m)}
                </h3>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <PipelineBadge tag={m.pipeline_tag} />
              </div>

              <div className="flex items-center gap-2 mt-6 pt-6 border-t border-white/5">
                <Link
                  to={`/models/${encodeURIComponent(id)}`}
                  className="flex-1 flex items-center justify-center py-2.5 rounded-xl text-xs font-bold transition-all"
                  style={{ background: `${COLORS[i]}20`, color: COLORS[i], border: `1px solid ${COLORS[i]}30` }}
                >
                  Deep Dive
                </Link>
                <a
                  href={`https://huggingface.co/${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Advanced Premium Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative glass"
      >
        <div className="grid" style={{ gridTemplateColumns: `240px repeat(${models.length}, 1fr)` }}>
          <div className="px-6 py-4 bg-white/5 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-widest text-white/30">Metric Comparison</span>
          </div>
          {models.map((m, i) => (
            <div
              key={m.id || m.modelId}
              className="px-6 py-4 border-b border-white/10 text-center relative overflow-hidden"
              style={{ background: `linear-gradient(to bottom, ${COLORS[i]}15, transparent)` }}
            >
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: COLORS[i] }} />
              <span className="text-sm font-semibold text-white/90 truncate block">{getModelName(m)}</span>
            </div>
          ))}

          {metrics.map((metric, rowIdx) => {
            const bestIdx = getBestIndex(metric, models)
            const isLatestRow = rowIdx === metrics.length - 1
            return [
              <div key={`label-${metric.label}`} className={`px-6 py-4 flex items-center gap-3 bg-white/[0.02] border-r border-white/5 ${!isLatestRow ? 'border-b border-white/5' : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 border border-white/10 shadow-inner">
                  {metric.icon}
                </div>
                <span className="text-sm font-medium text-white/70">{metric.label}</span>
              </div>,
              ...models.map((m, i) => {
                const id = m.id || m.modelId || ''
                const isBest = bestIdx === i
                return (
                  <div
                    key={`${id}-${metric.label}`}
                    className={`px-6 py-4 text-center group transition-colors flex flex-col items-center justify-center ${!isLatestRow ? 'border-b border-white/5' : ''} ${isBest ? 'bg-white/5' : 'hover:bg-white/[0.03]'}`}
                  >
                    {isBest && metric.higherIsBetter && (
                      <Trophy className="w-4 h-4 mx-auto mb-1 opacity-80" style={{ color: COLORS[i] }} />
                    )}
                    <span className={`text-sm tracking-wide ${isBest ? 'font-bold text-white' : 'font-medium text-white/50'}`}>
                      {formatMetricValue(metric, m)}
                    </span>
                  </div>
                )
              }),
            ]
          })}
        </div>
      </motion.div>

      {/* Charts Box */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-3xl border border-white/10 overflow-hidden shadow-2xl glass p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-bold text-white">Visual Analytics</h3>
            <p className="text-sm text-white/40">Multi-dimensional comparison of metrics</p>
          </div>
          <div className="flex flex-wrap gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10">
            {(['radar', 'downloads', 'likes', 'parameters'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setActiveChart(c)}
                className={`text-sm px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                  activeChart === c
                    ? 'bg-purple-500/20 text-purple-300 shadow-glow-purple border border-purple-500/30'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent'
                }`}
              >
                {c === 'radar' ? 'Spider Graph' : c}
              </button>
            ))}
          </div>
        </div>
        
        <div className="pt-4 bg-black/20 rounded-2xl border border-white/5 p-4">
          {activeChart === 'radar' && <RadarCompareChart models={models} />}
          {activeChart !== 'radar' && <BarCompareChart models={models} metric={activeChart} />}
        </div>
      </motion.div>
    </div>
  )
}
