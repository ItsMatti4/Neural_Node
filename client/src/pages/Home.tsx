import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, GridIcon, List, TrendingUp, Zap } from 'lucide-react'
import { useModels, useTrendingModels } from '../hooks/useModels'
import { useModelStore } from '../stores/useModelStore'
import ModelCard from '../components/ModelCard/ModelCard'
import SearchBar from '../components/Search/SearchBar'
import FilterSidebar from '../components/Search/FilterSidebar'
import { ModelCardSkeleton } from '../components/UI/Skeleton'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
}

export default function Home() {
  const { filters, setFilters, viewMode, setViewMode } = useModelStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Sync URL search param
  useEffect(() => {
    const s = searchParams.get('search')
    if (s && s !== filters.search) setFilters({ search: s })
  }, [searchParams])

  const { data: models, isLoading, isFetching } = useModels(filters)
  const { data: trending, isLoading: trendingLoading } = useTrendingModels(6)

  const showTrending = !filters.search && !filters.task && !filters.library && !filters.language && !filters.license

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* Hero */}
      <div className="relative overflow-hidden py-12 px-4 border-b border-white/5">
        <div className="absolute inset-0 bg-mesh pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20 blur-[80px]" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.6) 0%, rgba(37,99,235,0.4) 60%, transparent 100%)' }} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full mb-4 font-medium" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}>
              <Zap className="w-3 h-3" />
              Powered by Hugging Face API
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="gradient-text">Neural Node</span>
              <br />
              <span className="text-white/70 text-3xl md:text-4xl font-semibold">AI Model Analytics</span>
            </h1>
            <p className="text-base text-muted max-w-2xl mx-auto mb-8">
              Explore, compare and analyze hundreds of thousands of Hugging Face models by downloads, likes, parameters, and more.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex justify-center">
            <SearchBar fullWidth />
          </motion.div>
        </div>
      </div>

      {/* Trending section */}
      {showTrending && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-semibold text-white/70">Trending Now</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {trendingLoading
              ? [...Array(6)].map((_, i) => <ModelCardSkeleton key={i} />)
              : trending?.map((m, i) => <ModelCard key={m.id || m.modelId} model={m} index={i} />)
            }
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <FilterSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn-ghost text-xs md:hidden"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>

            <div className="flex-1" />

            {isFetching && !isLoading && (
              <span className="text-xs text-muted animate-pulse">Updating…</span>
            )}

            {models && (
              <span className="text-xs text-muted">{models.length} models</span>
            )}

            <div className="flex gap-1 p-1 rounded-lg bg-white/5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
              >
                <GridIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Grid / List */}
          {isLoading ? (
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {[...Array(12)].map((_, i) => <ModelCardSkeleton key={i} />)}
            </div>
          ) : models && models.length > 0 ? (
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {models.map((m, i) => (
                <ModelCard key={m.id || m.modelId || i} model={m} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-muted">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-medium text-white/50">No models found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}

          {/* Load more */}
          {models && models.length >= filters.limit && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setFilters({ page: filters.page + 1 })}
                className="btn-ghost text-sm"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
