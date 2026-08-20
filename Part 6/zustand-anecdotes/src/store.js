import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '',
  actions: {
    vote: async (id) => {
      const anecdote = useAnecdoteStore.getState().anecdotes.find(a => a.id === id)
      if (!anecdote) {
        throw new Error(`Anecdote with id ${id} not found`)
      }
      const updatedAnecdote = await anecdoteService.update(id, { ...anecdote, votes: anecdote.votes + 1 })
      set((state) => ({
        anecdotes: state.anecdotes.map(anecdote =>
          anecdote.id === id ? updatedAnecdote : anecdote
        )
      }))
    },
    addAnecdote: async (content) => {
      const newAnecdote = await anecdoteService.createNew({ content, votes: 0 })
      set((state) => ({
        anecdotes: [...state.anecdotes, newAnecdote]
      }))
    },
    removeAnecdote: async (id) => {
      await anecdoteService.remove(id)
      set((state) => ({
        anecdotes: state.anecdotes.filter(anecdote => anecdote.id !== id)
      }))
    },
    initializeAnecdotes: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
    },
    setFilter: (filter) => set((state) => ({
      filter: filter
    })),
  },
}))

let notificationTimeoutId = null

const useNotificationStore = create((set) => ({
  notification: null,
  actions: {
    clearNotification: () => {
      if (notificationTimeoutId) {
        clearTimeout(notificationTimeoutId)
      }
      set(() => ({ notification: null }))
    },
    setNotification: (message, duration = 5) => {
      if (notificationTimeoutId) {
        clearTimeout(notificationTimeoutId)
      }

      set(() => ({ notification: message }))
      notificationTimeoutId = setTimeout(() => {
        set(() => ({ notification: null }))
      }, duration * 1000)
    },
  },
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)
  return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase())).toSorted((a, b) => b.votes - a.votes)
}
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)

export const useNotification = () => useNotificationStore((state) => state.notification)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)

export default useAnecdoteStore