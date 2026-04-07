export interface HFModel {
  id: string
  modelId?: string
  author?: string
  sha?: string
  lastModified?: string
  createdAt?: string
  private?: boolean
  gated?: boolean | string
  disabled?: boolean
  downloads?: number
  downloadsAllTime?: number
  likes?: number
  library_name?: string
  tags?: string[]
  pipeline_tag?: string
  mask_token?: string
  cardData?: ModelCardData
  siblings?: ModelSibling[]
  spaces?: string[]
  safetensors?: SafetensorsInfo
  config?: Record<string, unknown>
  transformersInfo?: { auto_model?: string; pipeline_tag?: string }
  widgetData?: unknown[]
  modelIndex?: EvalResult[]
}

export interface ModelCardData {
  license?: string
  license_name?: string
  datasets?: string[]
  metrics?: string[]
  language?: string[]
  tags?: string[]
  'model-index'?: ModelIndex[]
  base_model?: string | string[]
  pipeline_tag?: string
}

export interface ModelIndex {
  name?: string
  results?: EvalResult[]
}

export interface EvalResult {
  task?: { type: string; name?: string }
  dataset?: { type: string; name?: string; split?: string }
  metrics?: EvalMetric[]
}

export interface EvalMetric {
  type: string
  value: number | string
  name?: string
  verified?: boolean
}

export interface ModelSibling {
  rfilename: string
  size?: number
  blob_id?: string
  lfs?: { size?: number; sha256?: string }
}

export interface SafetensorsInfo {
  parameters?: Record<string, number>
  total?: number
}

export interface SearchFilters {
  search: string
  task: string
  library: string
  language: string
  license: string
  sort: 'downloads' | 'likes' | 'lastModified' | 'trending' | 'createdAt'
  direction: -1 | 1
  limit: number
  page: number
}

export interface CompareModel {
  id: string
  name: string
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}

export const PIPELINE_TAGS = [
  'text-generation',
  'text2text-generation',
  'text-classification',
  'token-classification',
  'question-answering',
  'summarization',
  'translation',
  'fill-mask',
  'feature-extraction',
  'sentence-similarity',
  'image-classification',
  'image-segmentation',
  'object-detection',
  'image-to-text',
  'text-to-image',
  'text-to-speech',
  'automatic-speech-recognition',
  'audio-classification',
  'visual-question-answering',
  'zero-shot-classification',
  'zero-shot-image-classification',
  'document-question-answering',
  'depth-estimation',
  'video-classification',
  'reinforcement-learning',
  'tabular-classification',
  'tabular-regression',
] as const

export const LIBRARIES = [
  'transformers',
  'diffusers',
  'sentence-transformers',
  'timm',
  'peft',
  'trl',
  'llama-cpp-python',
  'mlx',
  'gguf',
  'safetensors',
] as const

export const LICENSES = [
  'mit',
  'apache-2.0',
  'gpl-3.0',
  'lgpl-3.0',
  'cc-by-4.0',
  'cc-by-sa-4.0',
  'cc-by-nc-4.0',
  'cc0-1.0',
  'openrail',
  'llama2',
  'gemma',
  'other',
] as const

export const SORT_OPTIONS = [
  { value: 'downloads', label: 'Most Downloaded' },
  { value: 'likes', label: 'Most Liked' },
  { value: 'lastModified', label: 'Recently Updated' },
  { value: 'createdAt', label: 'Newest First' },
  { value: 'trending', label: 'Trending' },
] as const
