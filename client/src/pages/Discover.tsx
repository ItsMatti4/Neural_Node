import { useState } from 'react'
import { motion } from 'framer-motion'
import { Compass, Sparkles, TrendingUp, Clock } from 'lucide-react'
import { useModels, useTrendingModels } from '../hooks/useModels'
import { PIPELINE_TAGS } from '../types'
import ModelCard from '../components/ModelCard/ModelCard'
import { ModelCardSkeleton } from '../components/UI/Skeleton'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -12 },
}

export default function Discover() {
  const [activeTab, setActiveTab] = useState<'trending' | 'new' | 'growing'>('trending')

  const { data: trending, isLoading: trendLoading } = useTrendingModels(12)
  const { data: newest, isLoading: newLoading } = useModels({ sort: 'createdAt', direction: -1, limit: 12, full: true })
  const { data: growing, isLoading: growLoading } = useModels({ sort: 'likes', direction: -1, limit: 12, full: true })

  const tabs = [
    { key: 'trending', label: 'Trending', icon: TrendingUp },
    { key: 'new', label: 'New This Week', icon: Clock },
    { key: 'growing', label: 'Most Liked', icon: Sparkles },
  ] as const

  const activeData = activeTab === 'trending' ? trending : activeTab === 'new' ? newest : growing
  const isLoading = activeTab === 'trending' ? trendLoading : activeTab === 'new' ? newLoading : growLoading

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="border-b border-white/5 px-4 py-6" style={{ background: 'linear-gradient(180deg, rgba(6,182,212,0.05) 0%, transparent 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">Discover</h1>
          </div>
          <p className="text-sm text-muted">Find new and exciting AI models</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                activeTab === key
                  ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300'
                  : 'border-white/10 text-white/50 hover:text-white/70 hover:border-white/20'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Models grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading
            ? [...Array(12)].map((_, i) => <ModelCardSkeleton key={i} />)
            : activeData?.map((m, i) => <ModelCard key={m.id || m.modelId || i} model={m} index={i} />)
          }
        </div>

        {/* Task discovery */}
        <div className="mt-12">
          <h2 className="text-base font-semibold text-white/70 mb-4">Browse by Task</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {PIPELINE_TAGS.slice(0, 20).map((tag) => (
              <motion.a
                key={tag}
                href={`/?task=${encodeURIComponent(tag)}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="card text-center py-4 cursor-pointer hover:border-purple-500/30 transition-all"
              >
                <p className="text-xs font-medium text-white/60 capitalize">{tag.replace(/-/g, ' ')}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
