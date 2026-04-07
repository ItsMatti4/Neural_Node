import { motion } from 'framer-motion'
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react'
import { useModelStore } from '../../stores/useModelStore'
import { PIPELINE_TAGS, LIBRARIES, LICENSES, SORT_OPTIONS } from '../../types'

interface FilterSidebarProps {
  open: boolean
  onClose: () => void
}

const languages = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: 'Chinese' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'ru', label: 'Russian' },
  { code: 'ar', label: 'Arabic' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'it', label: 'Italian' },
  { code: 'multilingual', label: 'Multilingual' },
]

interface FilterSectionProps {
  title: string
  children: React.ReactNode
}

function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <div className="mb-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-2">{title}</p>
      {children}
    </div>
  )
}

interface ChipProps {
  label: string
  selected: boolean
  onClick: () => void
}

function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`text-[10px] px-2 py-1 rounded-lg border font-medium transition-all ${
        selected
          ? 'border-purple-500/60 bg-purple-500/15 text-purple-300'
          : 'border-white/8 bg-white/4 text-white/40 hover:border-white/20 hover:text-white/60'
      }`}
    >
      {label}
    </button>
  )
}

export default function FilterSidebar({ open, onClose }: FilterSidebarProps) {
  const { filters, setFilters, resetFilters } = useModelStore()

  const hasActiveFilters = filters.task || filters.library || filters.language || filters.license

  return (
    <>
      {/* Backdrop (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : (typeof window !== 'undefined' && window.innerWidth >= 768 ? 0 : '-100%') }}
        transition={{ type: 'tween', duration: 0.25 }}
        className="fixed top-16 left-0 bottom-0 z-40 w-64 glass border-r border-white/5 overflow-y-auto p-4 md:relative md:top-0 md:left-0 md:translate-x-0 md:flex-shrink-0"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-white/80">Filters</span>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
            <button onClick={onClose} className="md:hidden text-white/30 hover:text-white/60">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sort */}
        <FilterSection title="Sort By">
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ sort: e.target.value as typeof filters.sort })}
            className="input text-xs h-10 py-0 px-3 cursor-pointer appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%237c3aed%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px top 50%', backgroundSize: '10px auto' }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} style={{ background: '#13131f' }}>
                {o.label}
              </option>
            ))}
          </select>
        </FilterSection>

        {/* Task */}
        <FilterSection title="Task / Pipeline">
          <div className="flex flex-wrap gap-1.5">
            {PIPELINE_TAGS.slice(0, 16).map((tag) => (
              <Chip
                key={tag}
                label={tag.replace(/-/g, ' ')}
                selected={filters.task === tag}
                onClick={() => setFilters({ task: filters.task === tag ? '' : tag, page: 0 })}
              />
            ))}
          </div>
        </FilterSection>

        {/* Library */}
        <FilterSection title="Library">
          <div className="flex flex-wrap gap-1.5">
            {LIBRARIES.map((lib) => (
              <Chip
                key={lib}
                label={lib}
                selected={filters.library === lib}
                onClick={() => setFilters({ library: filters.library === lib ? '' : lib, page: 0 })}
              />
            ))}
          </div>
        </FilterSection>

        {/* Language */}
        <FilterSection title="Language">
          <div className="flex flex-wrap gap-1.5">
            {languages.map((l) => (
              <Chip
                key={l.code}
                label={l.label}
                selected={filters.language === l.code}
                onClick={() => setFilters({ language: filters.language === l.code ? '' : l.code, page: 0 })}
              />
            ))}
          </div>
        </FilterSection>

        {/* License */}
        <FilterSection title="License">
          <div className="flex flex-wrap gap-1.5">
            {LICENSES.slice(0, 8).map((lic) => (
              <Chip
                key={lic}
                label={lic}
                selected={filters.license === lic}
                onClick={() => setFilters({ license: filters.license === lic ? '' : lic, page: 0 })}
              />
            ))}
          </div>
        </FilterSection>
      </motion.aside>
    </>
  )
}
