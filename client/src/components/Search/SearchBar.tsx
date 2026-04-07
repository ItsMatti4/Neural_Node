import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { modelsApi } from '../../services/api'
import { useModelStore } from '../../stores/useModelStore'

interface SearchBarProps {
  fullWidth?: boolean
}

export default function SearchBar({ fullWidth = false }: SearchBarProps) {
  const { filters, setFilters } = useModelStore()
  const [input, setInput] = useState(filters.search)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const { data: suggestions, isFetching } = useQuery({
    queryKey: ['search-suggest', input],
    queryFn: () => modelsApi.list({ search: input, limit: 6 }),
    enabled: input.length >= 2 && open,
    staleTime: 1000 * 30,
  })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters({ search: input, page: 0 })
    }, 300)
    return () => clearTimeout(t)
  }, [input, setFilters])

  const handleSelect = (id: string) => {
    setOpen(false)
    navigate(`/models/${id}`)
  }

  return (
    <div ref={ref} className={`relative ${fullWidth ? 'w-full' : 'max-w-2xl w-full'}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setOpen(true) }}
          onFocus={() => input.length >= 2 && setOpen(true)}
          placeholder="Search models by name, author, or task…"
          className="input pl-12 pr-10 h-12 text-base w-full"
        />
        {isFetching && (
          <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 animate-spin" />
        )}
        {input && (
          <button
            onClick={() => { setInput(''); setFilters({ search: '', page: 0 }); setOpen(false) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete dropdown */}
      {open && suggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 z-50 glass rounded-xl overflow-hidden border border-white/10 shadow-xl">
          {suggestions.map((model) => {
            const id = model.id || model.modelId || ''
            return (
              <button
                key={id}
                onClick={() => handleSelect(id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
              >
                <Search className="w-3.5 h-3.5 text-white/25 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 truncate">{id}</p>
                  {model.pipeline_tag && (
                    <p className="text-[10px] text-muted">{model.pipeline_tag}</p>
                  )}
                </div>
                {model.downloads !== undefined && (
                  <span className="text-[10px] text-white/30">{(model.downloads / 1000).toFixed(0)}K dl</span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
