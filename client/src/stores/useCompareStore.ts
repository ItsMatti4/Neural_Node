import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CompareModel, ToastMessage } from '../types'

interface CompareStore {
  selectedModels: CompareModel[]
  addModel: (model: CompareModel) => void
  removeModel: (id: string) => void
  clearModels: () => void
  isSelected: (id: string) => boolean
  toasts: ToastMessage[]
  addToast: (toast: Omit<ToastMessage, 'id'>) => void
  removeToast: (id: string) => void
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      selectedModels: [],
      addModel: (model) => {
        const { selectedModels } = get()
        if (selectedModels.length >= 4) {
          get().addToast({ type: 'warning', message: 'Maximum 4 models can be compared' })
          return
        }
        if (selectedModels.some((m) => m.id === model.id)) {
          get().addToast({ type: 'info', message: 'Model already in compare list' })
          return
        }
        set({ selectedModels: [...selectedModels, model] })
        get().addToast({ type: 'success', message: `Added ${model.name} to compare` })
      },
      removeModel: (id) =>
        set((state) => ({
          selectedModels: state.selectedModels.filter((m) => m.id !== id),
        })),
      clearModels: () => set({ selectedModels: [] }),
      isSelected: (id) => get().selectedModels.some((m) => m.id === id),
      toasts: [],
      addToast: (toast) => {
        const id = Math.random().toString(36).slice(2)
        set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
        setTimeout(() => {
          set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
        }, 3500)
      },
      removeToast: (id) =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: 'hf-comparator-compare',
      partialize: (state) => ({ selectedModels: state.selectedModels }),
    }
  )
)
