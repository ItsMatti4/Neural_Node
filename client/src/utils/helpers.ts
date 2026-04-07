import type { HFModel } from '../types'

export const formatNumber = (n?: number): string => {
  if (!n && n !== 0) return 'N/A'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export const formatBytes = (bytes?: number): string => {
  if (!bytes) return 'N/A'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let i = 0
  let value = bytes
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024
    i++
  }
  return `${value.toFixed(1)} ${units[i]}`
}

export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export const timeAgo = (dateStr?: string): string => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(months / 12)

  if (years > 0) return `${years}y ago`
  if (months > 0) return `${months}mo ago`
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}

export const getTotalModelSize = (model: HFModel): number => {
  if (!model.siblings) return 0
  return model.siblings.reduce((acc, s) => acc + (s.lfs?.size || s.size || 0), 0)
}

export const getModelParameters = (model: HFModel): number | null => {
  if (model.safetensors?.total) return model.safetensors.total
  if (model.safetensors?.parameters) {
    return Object.values(model.safetensors.parameters).reduce((a, b) => a + b, 0)
  }
  return null
}

export const formatParameters = (params?: number | null): string => {
  if (!params) return 'N/A'
  if (params >= 1e12) return `${(params / 1e12).toFixed(1)}T`
  if (params >= 1e9) return `${(params / 1e9).toFixed(1)}B`
  if (params >= 1e6) return `${(params / 1e6).toFixed(1)}M`
  if (params >= 1e3) return `${(params / 1e3).toFixed(1)}K`
  return params.toString()
}

export const getLicense = (model: HFModel): string => {
  return model.cardData?.license || model.cardData?.license_name || 
    model.tags?.find(t => t.startsWith('license:'))?.replace('license:', '') || 'Unknown'
}

export const getPipelineColor = (tag?: string): string => {
  const colors: Record<string, string> = {
    'text-generation': '#7c3aed',
    'text2text-generation': '#6d28d9',
    'text-classification': '#2563eb',
    'token-classification': '#0891b2',
    'question-answering': '#0d9488',
    'summarization': '#16a34a',
    'translation': '#ca8a04',
    'fill-mask': '#ea580c',
    'feature-extraction': '#dc2626',
    'sentence-similarity': '#db2777',
    'image-classification': '#7c3aed',
    'image-segmentation': '#4f46e5',
    'object-detection': '#0284c7',
    'image-to-text': '#0891b2',
    'text-to-image': '#059669',
    'text-to-speech': '#d97706',
    'automatic-speech-recognition': '#b45309',
    'audio-classification': '#dc2626',
    'visual-question-answering': '#9333ea',
    'zero-shot-classification': '#6d28d9',
  }
  return colors[tag || ''] || '#6b7280'
}

export const getModelAuthor = (model: HFModel): string => {
  if (model.author) return model.author
  const id = model.id || model.modelId || ''
  return id.includes('/') ? id.split('/')[0] : id
}

export const getBaseModel = (model: HFModel): string | null => {
  if (!model.cardData?.base_model) return null
  const base = model.cardData.base_model
  if (Array.isArray(base)) return base[0] || null
  return base
}

export const getLanguageCount = (model: HFModel): number => {
  return model.cardData?.language?.length || 0
}

export const getDatasetCount = (model: HFModel): number => {
  return model.cardData?.datasets?.length || 0
}

export const getInferenceStatus = (model: HFModel): string => {
  if (model.disabled) return 'Disabled'
  if (model.private) return 'Private'
  return 'Available'
}

export const getModelName = (model: HFModel): string => {
  const id = model.id || model.modelId || ''
  return id.includes('/') ? id.split('/')[1] : id
}

export const buildShareUrl = (modelIds: string[]): string => {
  const params = new URLSearchParams({ ids: modelIds.join(',') })
  return `${window.location.origin}/compare?${params.toString()}`
}
