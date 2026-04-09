import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    loading: true, // userData 사용하는 컴포넌트에 v-if="!loading"
    isModifying: false,
    userData: {}, // 유저 정보 저장
    goalData: {},
    userModifyData: {},
    goalModifyData: {},
  }),

  actions: {
    changeModifyMode(bool) {
      this.isModifying = bool
    },

    // userData에 현재 로그인된 유저 정보 저장
    loadUserData(userId) {
      this.loading = true
      const userUrl = `/api/users/${userId}`

      if (userId) {
        axios
          .get(userUrl, { timeout: 900 })
          .then((response) => {
            return response.data
          })
          .then((data) => {
            this.userData = data
            this.userModifyData = data
            this.loading = false
          })
          .catch((e) => {
            console.log(e)
          })
      } else {
        this.loading = false
      }
    },

    loadUserGoalData(userId) {
      this.loading = true
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
              let data = {}
              if (response.data.length) {
                data = {
                  id: response.data[0].id,
                  itemName: response.data[0].itemName,
                  targetAmount: response.data[0].targetAmount,
                }
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

    updateUserData(key, value) {
      if (key === 'expenseLimit') value = Number(value)
      this.userModifyData = { ...this.userModifyData, [key]: value }
    },

    updateGoalData(key, value) {
      if (key === 'targetAmount') value = Number(value)
      this.goalModifyData = { ...this.goalModifyData, [key]: value }
    },

    initModifyData() {
      this.userModifyData = this.userData
      this.goalModifyData = this.goalData
    },
  },
})
