import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SearchFilters } from '../types'

interface ModelStore {
  filters: SearchFilters
  setFilters: (filters: Partial<SearchFilters>) => void
  resetFilters: () => void
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void
}

const defaultFilters: SearchFilters = {
  search: '',
  task: '',
  library: '',
  language: '',
  license: '',
  sort: 'downloads',
  direction: -1,
  limit: 24,
  page: 0,
}

export const useModelStore = create<ModelStore>()(
  persist(
    (set) => ({
      filters: defaultFilters,
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters, page: newFilters.page ?? 0 },
        })),
      resetFilters: () => set({ filters: defaultFilters }),
      viewMode: 'grid',
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: 'hf-comparator-filters',
      partialize: (state) => ({ viewMode: state.viewMode }),
    }
  )
)
