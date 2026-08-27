import { create } from 'zustand'

let notificationTimeoutId = null

const useNotificationStore = create((set) => ({
  notification: null,
  type: null,
  actions: {
    clearNotification: () => {
      if (notificationTimeoutId) {
        clearTimeout(notificationTimeoutId)
      }
      set(() => ({ notification: null }))
    },
    setNotification: (message, type = 'success', duration = 5) => {
      if (notificationTimeoutId) {
        clearTimeout(notificationTimeoutId)
      }
      set(() => ({ notification: message, type: type }))
      notificationTimeoutId = setTimeout(() => {
        set(() => ({ notification: null }))
        notificationTimeoutId = null
      }, duration * 1000)
    },
  },
}))

export const useNotification = () => {
  const notification = useNotificationStore((state) => state.notification)
  const type = useNotificationStore((state) => state.type)
  return { notification, type }
}
export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions)
export default useNotificationStore
