import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isModifying: false,
    userData: {},
    goalData: {},
    userModifyData: {},
    goalModifyData: {},
  }),

  actions: {
    changeModifyMode(bool) {
      this.isModifying = bool
    },
  },
})
