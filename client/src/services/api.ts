import axios from 'axios'
import type { HFModel, SearchFilters } from '../types'

const api = axios.create({
  baseURL: '/api',
  timeout: 20000,
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.error || err.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

export const modelsApi = {
  list: async (filters: Partial<SearchFilters>): Promise<HFModel[]> => {
    const params: Record<string, unknown> = {}
    if (filters.search) params.search = filters.search
    if (filters.task) params.filter = filters.task
    if (filters.library) params.library = filters.library
    if (filters.language) params.language = filters.language
    if (filters.license) params.license = filters.license
    if (filters.sort) params.sort = filters.sort
    if (filters.direction !== undefined) params.direction = filters.direction
    if (filters.limit) params.limit = filters.limit
    if (filters.page) params.page = filters.page
    params.full = true

    const { data } = await api.get<HFModel[]>('/models', { params })
    return data
  },

  getById: async (id: string): Promise<HFModel> => {
    const encoded = encodeURIComponent(id).replace('%2F', '/')
    const { data } = await api.get<HFModel>(`/models/${encoded}`)
    return data
  },

  getTrending: async (limit = 12): Promise<HFModel[]> => {
    const { data } = await api.get<HFModel[]>('/models/trending', { params: { limit } })
    return data
  },

  getByTask: async (task: string, limit = 20, sort = 'downloads'): Promise<HFModel[]> => {
    const { data } = await api.get<HFModel[]>(`/models/task/${encodeURIComponent(task)}`, {
      params: { limit, sort },
    })
    return data
  },

  compare: async (ids: string[]): Promise<HFModel[]> => {
    const { data } = await api.get<HFModel[]>('/models/compare', {
      params: { ids: ids.join(',') },
    })
    return data
  },

  getReadme: async (id: string): Promise<string | null> => {
    try {
      const encoded = encodeURIComponent(id).replace('%2F', '/')
      const { data } = await api.get<{ content: string }>(`/models/${encoded}/readme`)
      return data.content
    } catch {
      return null
    }
  },
}

export default api
