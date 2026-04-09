import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => {
    const userId = localStorage.getItem('userId')

    return {
      isLogged: !!userId,
      currentUserId: userId,
    }
  },

  actions: {
    login(userId) {
      localStorage.setItem('userId', userId)

      this.isLogged = true
      this.currentUserId = userId
    },

    logout() {
      localStorage.removeItem('userId')

      this.isLogged = false
      this.currentUserId = null
    },
  },
})
