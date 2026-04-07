import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Download, Heart, Plus, Check, ExternalLink, GitCompare } from 'lucide-react'
import type { HFModel } from '../../types'
import { formatNumber, timeAgo, getModelAuthor, getModelName, getTotalModelSize, formatBytes, getModelParameters, formatParameters } from '../../utils/helpers'
import { PipelineBadge, LibraryBadge } from '../UI/Badge'
import { useCompareStore } from '../../stores/useCompareStore'

interface ModelCardProps {
  model: HFModel
  index?: number
}

export default function ModelCard({ model, index = 0 }: ModelCardProps) {
  const { addModel, removeModel, isSelected } = useCompareStore()
  const id = model.id || model.modelId || ''
  const author = getModelAuthor(model)
  const name = getModelName(model)
  const selected = isSelected(id)
  const totalSize = getTotalModelSize(model)
  const params = getModelParameters(model)

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (selected) removeModel(id)
    else addModel({ id, name: id })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="group relative"
    >
      {/* Glow effect on selected */}
      {selected && (
        <div className="absolute inset-0 rounded-xl opacity-30 pointer-events-none" style={{ boxShadow: '0 0 30px rgba(124,58,237,0.5)', border: '1px solid rgba(124,58,237,0.6)' }} />
      )}

      <div
        className={`card h-full flex flex-col transition-all duration-300 ${selected ? 'border-purple-500/40' : ''}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted mb-0.5 truncate">{author}</p>
            <h3 className="font-semibold text-sm text-white truncate group-hover:text-purple-300 transition-colors">
              {name}
            </h3>
          </div>
          <PipelineBadge tag={model.pipeline_tag} />
        </div>

        {/* Library */}
        {model.library_name && (
          <LibraryBadge lib={model.library_name} />
        )}

        {/* Tags */}
        {model.tags && model.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {model.tags.slice(0, 3).filter(t => !t.includes(':') && t !== model.pipeline_tag && t !== model.library_name).map(tag => (
              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 border border-white/8">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex-1" />

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-white/70 font-medium">{formatNumber(model.downloads)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Heart className="w-3.5 h-3.5 text-pink-400" />
            <span className="text-white/70 font-medium">{formatNumber(model.likes)}</span>
          </div>
          {params && (
            <div className="text-xs text-muted ml-auto">
              <span className="text-purple-300 font-medium">{formatParameters(params)}</span>
            </div>
          )}
          {!params && totalSize > 0 && (
            <div className="text-xs text-muted ml-auto">
              <span className="text-white/40">{formatBytes(totalSize)}</span>
            </div>
          )}
        </div>

        {/* Updated */}
        <p className="text-[10px] text-subtle mt-1.5">{timeAgo(model.lastModified || model.createdAt)}</p>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <Link
            to={`/models/${id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/8 hover:border-white/20"
          >
            View Details
          </Link>
          <button
            onClick={handleCompareToggle}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${
              selected
                ? 'border-purple-500/50 bg-purple-500/20 text-purple-300'
                : 'border-white/10 bg-white/5 text-white/40 hover:border-purple-500/40 hover:text-purple-400'
            }`}
            title={selected ? 'Remove from compare' : 'Add to compare'}
          >
            {selected ? <Check className="w-3.5 h-3.5" /> : <GitCompare className="w-3.5 h-3.5" />}
          </button>
          <a
            href={`https://huggingface.co/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 bg-white/5 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
            title="Open on HuggingFace"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}
