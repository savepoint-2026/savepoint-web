import axios from 'axios'
import { defineStore } from 'pinia'

const BASE_URL = 'http://localhost:3000/group'

export const useGroupStore = defineStore('group', {
  state: () => ({
    groupId: '',
    group: [],
  }),

  getters: {
    isGroup: () => {
      return state.groupId === '' ? false : true
    },
  },

  actions: {
    addGroup: async () => {}, //addGroup

    joinGroup: async () => {}, //joinGroup

    fetchGroupExpenses: async () => {
      const thisMonth = new Date().getMonth() + 1
      const response = await axios.get(TRANSACTION_URI)
    }, //fetchGroupExpenses

    fetchMyGroup: async (userId) => {
      //userId를 통해 state의 groupId 가져오기
    }, //fetchMyGroup
  },
})
