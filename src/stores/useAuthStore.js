import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => {
    const userId = localStorage.getItem('userId')

    return {
      isLogged: !!userId, // 로그인 여부 표시, true가 로그인 된 상태
      currentUserId: userId, // 현재 로그인 된 user의 id
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

    async deleteUser(userId) {
      const API = '/api'

      try {
        if (!userId) {
          throw new Error('userId 없음')
        }

        const { data: user } = await axios.get(`${API}/users/${userId}`)
        if (!user || user.id !== userId) {
          throw new Error('유저 없음')
        }

        const { data: transactions } = await axios.get(`${API}/transactions?userId=${userId}`)

        for (const t of transactions) {
          await axios.delete(`${API}/transactions/${t.id}`)
        }

        const { data: goals } = await axios.get(`${API}/goals?userId=${userId}`)

        for (const g of goals) {
          await axios.delete(`${API}/goals/${g.id}`)
        }

        if (user.groupId) {
          const { data: group } = await axios.get(`${API}/groups/${user.groupId}`)

          if (group && group.memberIds.includes(userId)) {
            const updatedMembers = group.memberIds.filter((id) => id !== userId)

            if (updatedMembers.length === 0) {
              await axios.delete(`${API}/groups/${group.id}`)
            } else {
              await axios.patch(`${API}/groups/${group.id}`, {
                memberIds: updatedMembers,
              })
            }
          }
        }

        await axios.delete(`${API}/users/${userId}`)

        console.log('탈퇴 완료:', userId)

        localStorage.removeItem('userId')

        this.isLogged = false
        this.currentUserId = null
      } catch (error) {
        console.error('탈퇴 실패:', error.message)
      }
    },
  },
})
