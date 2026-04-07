import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { GitCompare, Plus, Share2, Copy, Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCompareModels } from '../hooks/useModels'
import { useCompareStore } from '../stores/useCompareStore'
import CompareView from '../components/CompareView/CompareView'
import { ModelDetailSkeleton } from '../components/UI/Skeleton'
import { buildShareUrl } from '../utils/helpers'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -12 },
}

export default function Compare() {
  const { selectedModels } = useCompareStore()
  const [searchParams] = useSearchParams()
  const [copied, setCopied] = useState(false)

  // Support share URL
  const urlIds = searchParams.get('ids')?.split(',').filter(Boolean) || []
  const ids = urlIds.length >= 2 ? urlIds : selectedModels.map(m => m.id)

  const { data: models, isLoading, error } = useCompareModels(ids)

  const shareUrl = buildShareUrl(ids)
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (ids.length < 2) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
        className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(37,99,235,0.2))', border: '1px solid rgba(124,58,237,0.3)' }}>
          <GitCompare className="w-10 h-10 text-purple-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Compare Models</h1>
        <p className="text-muted mb-8">Select at least 2 models from the explorer to start comparing them side-by-side.</p>
        <Link to="/" className="btn-primary inline-flex">
          <Plus className="w-4 h-4" />
          Browse Models
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="border-b border-white/5 px-4 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white mb-0.5">Model Comparison</h1>
            <p className="text-xs text-muted">Comparing {ids.length} models side-by-side</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="btn-ghost text-xs">
              <Plus className="w-3.5 h-3.5" />
              Add Model
            </Link>
            <button onClick={handleCopy} className="btn-ghost text-xs">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Share'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 overflow-x-auto">
        {isLoading ? (
          <ModelDetailSkeleton />
        ) : error ? (
          <div className="text-center py-12 text-muted">
            <p>Failed to load model data. Please try again.</p>
          </div>
        ) : models && models.length >= 2 ? (
          <CompareView models={models} />
        ) : (
          <div className="text-center py-12 text-muted">
            <p>Could not load comparison data.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
