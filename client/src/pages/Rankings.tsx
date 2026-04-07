import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Trophy, Flame, Clock, Heart, Download } from 'lucide-react'
import { useModelsByTask } from '../hooks/useModels'
import { PIPELINE_TAGS } from '../types'
import ModelCard from '../components/ModelCard/ModelCard'
import { ModelCardSkeleton } from '../components/UI/Skeleton'
import { PipelineDistChart } from '../components/Charts/Charts'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -12 },
}

const SORT_OPTS = [
  { value: 'downloads', label: 'Downloads', icon: Download },
  { value: 'likes', label: 'Likes', icon: Heart },
  { value: 'lastModified', label: 'Recent', icon: Clock },
  { value: 'trending', label: 'Trending', icon: Flame },
]

const FEATURED_TASKS = PIPELINE_TAGS.slice(0, 10)

const distData = [
  { name: 'text-generation', count: 231840 },
  { name: 'fill-mask', count: 108920 },
  { name: 'text-classification', count: 89430 },
  { name: 'automatic-speech-recognition', count: 45210 },
  { name: 'object-detection', count: 38670 },
  { name: 'image-classification', count: 31290 },
  { name: 'text-to-image', count: 27840 },
  { name: 'translation', count: 21300 },
  { name: 'question-answering', count: 18920 },
  { name: 'summarization', count: 14560 },
]

export default function Rankings() {
  const [selectedTask, setSelectedTask] = useState(FEATURED_TASKS[0])
  const [sort, setSort] = useState('downloads')

  const { data: models, isLoading } = useModelsByTask(selectedTask, 12, sort)

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="border-b border-white/5 px-4 py-6" style={{ background: 'linear-gradient(180deg, rgba(124,58,237,0.05) 0%, transparent 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-bold text-white">Rankings & Analytics</h1>
          </div>
          <p className="text-sm text-muted">Top models by task category</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Rankings */}
          <div className="lg:col-span-2">
            {/* Task selector */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              {FEATURED_TASKS.map(task => (
                <button
                  key={task}
                  onClick={() => setSelectedTask(task)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all capitalize ${
                    selectedTask === task
                      ? 'border-purple-500/60 bg-purple-500/15 text-purple-300'
                      : 'border-white/8 text-white/40 hover:border-white/20 hover:text-white/60'
                  }`}
                >
                  {task.replace(/-/g, ' ')}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xs text-muted">Sort by:</span>
              {SORT_OPTS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setSort(value)}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    sort === value
                      ? 'border-purple-500/50 bg-purple-500/10 text-purple-300'
                      : 'border-white/8 text-white/40 hover:text-white/60'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>

            {/* Models grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {isLoading
                ? [...Array(8)].map((_, i) => <ModelCardSkeleton key={i} />)
                : models?.slice(0, 12).map((m, i) => (
                    <div key={m.id || m.modelId} className="relative">
                      {i < 3 && (
                        <div className="absolute -top-2 -left-2 z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : '#b45309' }}>
                          {i + 1}
                        </div>
                      )}
                      <ModelCard model={m} index={i} />
                    </div>
                  ))
              }
            </div>
          </div>

          {/* Distribution chart */}
          <div className="space-y-5">
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <h3 className="text-sm font-semibold text-white/80">Model Distribution by Task</h3>
              </div>
              <PipelineDistChart data={distData} />
              <p className="text-[10px] text-muted mt-2 text-center">Approximate counts from Hugging Face</p>
            </div>

            <div className="card">
              <h3 className="text-sm font-semibold text-white/80 mb-4">Quick Facts</h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Models', value: '900K+', color: '#7c3aed' },
                  { label: 'Text Generation', value: '231K+', color: '#2563eb' },
                  { label: 'Image Models', value: '150K+', color: '#06b6d4' },
                  { label: 'New This Month', value: '12K+', color: '#10b981' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-muted">{label}</span>
                    <span className="text-sm font-bold" style={{ color }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
