import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    loading: true,
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

    loadUserData(userId) {
      const userUrl = `/api/users/${userId}`
      const goalUrl = `/api/goals?userId=${userId}`

      axios
        .get(userUrl, { timeout: 900 })
        .then((response) => {
          return response.data
        })
        .then((data) => {
          this.userData = data
          this.userModifyData = data
        })
        .then(() => {
          axios
            .get(goalUrl, { timeout: 900 })
            .then((response) => {
              const data = {
                itemName: response.data[0].itemName,
                targetAmount: response.data[0].targetAmount,
              }
              this.goalData = data
              this.goalModifyData = data
              this.loading = false
            })
            .catch((e) => {
              console.log(e)
            })
        })
        .catch((e) => {
          console.log(e)
        })
    },
  },
})
