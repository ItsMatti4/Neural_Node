import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts'
import type { HFModel } from '../../types'
import { formatNumber, getModelParameters } from '../../utils/helpers'

const COLORS = ['#7c3aed', '#2563eb', '#06b6d4', '#10b981']

interface RadarCompareChartProps {
  models: HFModel[]
}

export function RadarCompareChart({ models }: RadarCompareChartProps) {
  const maxDownloads = Math.max(...models.map(m => m.downloads || 0))
  const maxLikes = Math.max(...models.map(m => m.likes || 0))
  const maxParams = Math.max(...models.map(m => getModelParameters(m) || 0))
  const maxFiles = Math.max(...models.map(m => m.siblings?.length || 0))

  const normalize = (val: number, max: number) =>
    max > 0 ? Math.round((val / max) * 100) : 0

  const dimensions = ['Downloads', 'Likes', 'Parameters', 'Files']

  const data = dimensions.map((dim) => {
    const entry: Record<string, string | number> = { dim }
    models.forEach((m, i) => {
      const id = (m.id || m.modelId || '').split('/').pop() || `Model ${i + 1}`
      switch (dim) {
        case 'Downloads': entry[id] = normalize(m.downloads || 0, maxDownloads); break
        case 'Likes': entry[id] = normalize(m.likes || 0, maxLikes); break
        case 'Parameters': entry[id] = normalize(getModelParameters(m) || 0, maxParams); break
        case 'Files': entry[id] = normalize(m.siblings?.length || 0, maxFiles); break
      }
    })
    return entry
  })

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.08)" />
        <PolarAngleAxis dataKey="dim" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
        {models.map((m, i) => {
          const id = (m.id || m.modelId || '').split('/').pop() || `Model ${i + 1}`
          return (
            <Radar
              key={id}
              name={id}
              dataKey={id}
              stroke={COLORS[i]}
              fill={COLORS[i]}
              fillOpacity={0.12}
              strokeWidth={2}
            />
          )
        })}
        <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }} />
        <Tooltip
          contentStyle={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }}
          labelStyle={{ color: 'white' }}
          itemStyle={{ color: 'rgba(255,255,255,0.7)' }}
          formatter={(v: number) => `${v}%`}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

interface BarCompareChartProps {
  models: HFModel[]
  metric: 'downloads' | 'likes' | 'parameters' | 'files'
}

export function BarCompareChart({ models, metric }: BarCompareChartProps) {
  const data = models.map((m, i) => {
    const name = (m.id || m.modelId || '').split('/').pop() || `Model ${i + 1}`
    let value = 0
    switch (metric) {
      case 'downloads': value = m.downloads || 0; break
      case 'likes': value = m.likes || 0; break
      case 'parameters': value = getModelParameters(m) || 0; break
      case 'files': value = m.siblings?.length || 0; break
    }
    return { name, value, color: COLORS[i] }
  })

  const formatValue = (v: number) => {
    if (metric === 'parameters') {
      if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`
      if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`
    }
    return formatNumber(v)
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={36}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={formatValue} tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} width={50} />
        <Tooltip
          contentStyle={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }}
          labelStyle={{ color: 'white' }}
          formatter={(v: number) => [formatValue(v), metric]}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

interface PipelineDistChartProps {
  data: Array<{ name: string; count: number }>
}

export function PipelineDistChart({ data }: PipelineDistChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" barSize={14}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
        <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={formatNumber} />
        <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} axisLine={false} tickLine={false} width={120} />
        <Tooltip
          contentStyle={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }}
          formatter={(v: number) => [formatNumber(v), 'Models']}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.75} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
