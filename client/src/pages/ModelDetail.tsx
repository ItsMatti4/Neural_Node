import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Download, Heart, ExternalLink, GitCompare, FileText,
  Calendar, Clock, Tag, Shield, Code2, Database, Check, Box
} from 'lucide-react'
import { useModel, useModelReadme } from '../hooks/useModels'
import { useCompareStore } from '../stores/useCompareStore'
import {
  formatNumber, formatBytes, formatDate, timeAgo,
  getTotalModelSize, getModelParameters, formatParameters,
  getLicense, getModelAuthor, getModelName, getPipelineColor
} from '../utils/helpers'
import { PipelineBadge, LibraryBadge } from '../components/UI/Badge'
import { StatCard, ProgressBar } from '../components/UI/StatCard'
import { ModelDetailSkeleton } from '../components/UI/Skeleton'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -12 },
}

export default function ModelDetail() {
  const params = useParams()
  const id = params.owner ? `${params.owner}/${params.name}` : (params.id || '')
  const decodedId = decodeURIComponent(id)

  const { data: model, isLoading, error } = useModel(decodedId)
  const { data: readme } = useModelReadme(decodedId)
  const { addModel, removeModel, isSelected } = useCompareStore()

  const selected = isSelected(decodedId)

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <ModelDetailSkeleton />
      </div>
    )
  }

  if (error || !model) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-xl font-semibold text-white/70 mb-2">Model not found</h2>
        <p className="text-muted mb-6">{decodedId}</p>
        <Link to="/" className="btn-primary inline-flex">Back to Explore</Link>
      </div>
    )
  }

  const author = getModelAuthor(model)
  const name = getModelName(model)
  const totalSize = getTotalModelSize(model)
  const params2 = getModelParameters(model)
  const license = getLicense(model)
  const pipelineColor = getPipelineColor(model.pipeline_tag)

  // Parse eval results
  const evalResults = model.cardData?.['model-index']?.[0]?.results || []

  // Safetensors files
  const safetensorFiles = model.siblings?.filter(s => s.rfilename.endsWith('.safetensors')) || []
  const ggufFiles = model.siblings?.filter(s => s.rfilename.endsWith('.gguf')) || []

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* Header */}
      <div className="border-b border-white/5" style={{ background: 'linear-gradient(180deg, rgba(124,58,237,0.06) 0%, transparent 100%)' }}>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Link to="/" className="text-xs text-muted hover:text-white/60 transition-colors">Models</Link>
                <span className="text-white/20">/</span>
                <span className="text-xs text-muted">{author}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{name}</h1>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-sm text-muted">by <span className="text-white/60">{author}</span></span>
                <PipelineBadge tag={model.pipeline_tag} />
                {model.library_name && <LibraryBadge lib={model.library_name} />}
                {license !== 'Unknown' && (
                  <span className="badge text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Shield className="w-2.5 h-2.5 inline mr-1" />{license}
                  </span>
                )}
                {model.gated && (
                  <span className="badge text-[10px] px-2 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                    Gated
                  </span>
                )}
              </div>
              {model.tags && (
                <div className="flex flex-wrap gap-1.5">
                  {model.tags.filter(t => !t.includes(':') && t !== model.pipeline_tag && t !== model.library_name).slice(0, 8).map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/40 border border-white/8">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => selected ? removeModel(decodedId) : addModel({ id: decodedId, name: decodedId })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  selected
                    ? 'border-purple-500/50 bg-purple-500/15 text-purple-300'
                    : 'border-white/10 bg-white/5 text-white/60 hover:border-purple-500/40 hover:text-purple-300'
                }`}
              >
                {selected ? <Check className="w-4 h-4" /> : <GitCompare className="w-4 h-4" />}
                {selected ? 'Added' : 'Compare'}
              </button>
              <a
                href={`https://huggingface.co/${decodedId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                HF Page
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="All-time Downloads" value={model.downloadsAllTime ?? model.downloads} icon={<Download className="w-5 h-5" />} color="#2563eb" />
          <StatCard label="Monthly Downloads" value={model.downloads} icon={<Download className="w-5 h-5" />} color="#7c3aed" />
          <StatCard label="Likes" value={model.likes} icon={<Heart className="w-5 h-5" />} color="#db2777" />
          <StatCard label="Files" value={model.siblings?.length ?? 0} icon={<FileText className="w-5 h-5" />} color="#06b6d4" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: details */}
          <div className="md:col-span-2 space-y-5">
            {/* Technical details */}
            <div className="card">
              <h2 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                Technical Details
              </h2>
              <div className="space-y-3">
                {params2 && (
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-muted">Parameters</span>
                    <span className="text-sm font-bold text-purple-300">{formatParameters(params2)}</span>
                  </div>
                )}
                {totalSize > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-muted">Total Size</span>
                    <span className="text-sm text-white/70">{formatBytes(totalSize)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-xs text-muted">Library</span>
                  <span className="text-sm text-white/70">{model.library_name || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-xs text-muted">Pipeline</span>
                  <span className="text-sm font-medium" style={{ color: pipelineColor }}>{model.pipeline_tag || 'N/A'}</span>
                </div>
                {safetensorFiles.length > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-muted">Safetensors</span>
                    <span className="text-sm text-emerald-400">{safetensorFiles.length} files</span>
                  </div>
                )}
                {ggufFiles.length > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-muted">GGUF</span>
                    <span className="text-sm text-yellow-400">{ggufFiles.length} files</span>
                  </div>
                )}
                {model.cardData?.language && model.cardData.language.length > 0 && (
                  <div className="py-2 border-b border-white/5">
                    <span className="text-xs text-muted block mb-1.5">Languages</span>
                    <div className="flex flex-wrap gap-1">
                      {model.cardData.language.slice(0, 10).map(l => (
                        <span key={l} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/50 border border-white/8">{l}</span>
                      ))}
                    </div>
                  </div>
                )}
                {model.cardData?.datasets && model.cardData.datasets.length > 0 && (
                  <div className="py-2">
                    <span className="text-xs text-muted block mb-1.5">Trained on</span>
                    <div className="flex flex-wrap gap-1">
                      {model.cardData.datasets.slice(0, 5).map(d => (
                        <span key={d} className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">{d}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Evaluation results */}
            {evalResults.length > 0 && (
              <div className="card">
                <h2 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-400" />
                  Evaluation Results
                </h2>
                <div className="space-y-4">
                  {evalResults.map((result, ri) => (
                    <div key={ri}>
                      {result.dataset && (
                        <p className="text-xs text-muted mb-2">
                          <Database className="w-3 h-3 inline mr-1" />
                          {result.dataset.name || result.dataset.type}
                          {result.dataset.split && <span className="text-white/30"> ({result.dataset.split})</span>}
                        </p>
                      )}
                      {result.metrics?.map((metric) => {
                        const val = typeof metric.value === 'number' ? metric.value : parseFloat(String(metric.value))
                        const isPercent = val <= 1 && val >= 0
                        const displayVal = isPercent ? (val * 100).toFixed(2) + '%' : val.toFixed(4)
                        const progressVal = isPercent ? val * 100 : Math.min(100, val)
                        return (
                          <div key={metric.type} className="mb-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted capitalize">{metric.name || metric.type}</span>
                              <span className="text-white/70 font-medium">{displayVal}</span>
                            </div>
                            <ProgressBar value={progressVal} max={100} showValue={false} color="#7c3aed" />
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Files list */}
            {model.siblings && model.siblings.length > 0 && (
              <div className="card">
                <h2 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
                  <Box className="w-4 h-4 text-cyan-400" />
                  Repository Files ({model.siblings.length})
                </h2>
                <div className="space-y-1 max-h-60 overflow-y-auto no-scrollbar">
                  {model.siblings.map((s) => (
                    <div key={s.rfilename} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-white/3 transition-colors group">
                      <span className="text-xs text-white/60 font-mono truncate">{s.rfilename}</span>
                      <span className="text-[10px] text-muted shrink-0 ml-2">{formatBytes(s.lfs?.size || s.size)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: meta */}
          <div className="space-y-4">
            <div className="card">
              <h2 className="text-sm font-semibold text-white/80 mb-4">Model Info</h2>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2">
                  <Calendar className="w-3.5 h-3.5 text-muted mt-0.5 shrink-0" />
                  <div>
                    <p className="text-muted">Created</p>
                    <p className="text-white/70">{formatDate(model.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-muted mt-0.5 shrink-0" />
                  <div>
                    <p className="text-muted">Updated</p>
                    <p className="text-white/70">{timeAgo(model.lastModified)}</p>
                  </div>
                </div>
                {model.sha && (
                  <div className="flex items-start gap-2">
                    <Code2 className="w-3.5 h-3.5 text-muted mt-0.5 shrink-0" />
                    <div>
                      <p className="text-muted">Commit SHA</p>
                      <p className="text-white/50 font-mono text-[10px]">{model.sha.slice(0, 12)}…</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Popularity bars */}
            <div className="card">
              <h2 className="text-sm font-semibold text-white/80 mb-4">Popularity</h2>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted">Downloads</span>
                    <span className="text-white/60">{formatNumber(model.downloads)}</span>
                  </div>
                  <ProgressBar value={Math.min(model.downloads || 0, 10_000_000)} max={10_000_000} showValue={false} color="#2563eb" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted">Likes</span>
                    <span className="text-white/60">{formatNumber(model.likes)}</span>
                  </div>
                  <ProgressBar value={Math.min(model.likes || 0, 100_000)} max={100_000} showValue={false} color="#db2777" />
                </div>
              </div>
            </div>

            {/* Spaces */}
            {model.spaces && model.spaces.length > 0 && (
              <div className="card">
                <h2 className="text-sm font-semibold text-white/80 mb-3">Used in Spaces</h2>
                <div className="flex flex-wrap gap-1.5">
                  {model.spaces.slice(0, 5).map(s => (
                    <a
                      key={s}
                      href={`https://huggingface.co/spaces/${s}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                    >
                      {s}
                    </a>
                  ))}
                  {model.spaces.length > 5 && (
                    <span className="text-[10px] text-muted">+{model.spaces.length - 5} more</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
