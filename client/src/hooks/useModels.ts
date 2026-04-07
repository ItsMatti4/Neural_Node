import { useQuery } from '@tanstack/react-query'
import { modelsApi } from '../services/api'
import type { SearchFilters } from '../types'

export const useModels = (filters: Partial<SearchFilters>) =>
  useQuery({
    queryKey: ['models', filters],
    queryFn: () => modelsApi.list(filters),
    placeholderData: (prev) => prev,
  })

export const useModel = (id: string) =>
  useQuery({
    queryKey: ['model', id],
    queryFn: () => modelsApi.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 15,
  })

export const useTrendingModels = (limit = 12) =>
  useQuery({
    queryKey: ['trending', limit],
    queryFn: () => modelsApi.getTrending(limit),
    staleTime: 1000 * 60 * 10,
  })

export const useModelsByTask = (task: string, limit = 20, sort = 'downloads') =>
  useQuery({
    queryKey: ['task-models', task, limit, sort],
    queryFn: () => modelsApi.getByTask(task, limit, sort),
    enabled: !!task,
    staleTime: 1000 * 60 * 15,
  })

export const useCompareModels = (ids: string[]) =>
  useQuery({
    queryKey: ['compare', ids],
    queryFn: () => modelsApi.compare(ids),
    enabled: ids.length >= 2,
    staleTime: 1000 * 60 * 15,
  })

export const useModelReadme = (id: string) =>
  useQuery({
    queryKey: ['readme', id],
    queryFn: () => modelsApi.getReadme(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 30,
  })
