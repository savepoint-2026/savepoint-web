import { defineStore } from 'pinia'
import axios from 'axios'
import dayjs from 'dayjs'

const BASE_URL = 'http://localhost:3000/transactions'

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [], // 전체 데이터
    selectedDate: dayjs().format('YYYY-MM-DD'), // 달력에서 클릭한 날짜 (기본값: 오늘)
    loading: false,
    filterType: 'all',
    filterCategory: 'all',
  }),

  getters: {
    // 1. 선택된 날짜 필터링
    dailyTransactions: (state) => {
      return state.transactions.filter(
        (tx) => dayjs(tx.date).format('YYYY-MM-DD') === state.selectedDate,
      )
    },

    // 2. 날짜별 합계 데이터 (달력 날짜칸에 수입/지출 표시)
    // 결과: { "2026-04-08": {income: 50000, expense: 12000}, ...}
    aggregatedByDate: (state) => {
      return state.transactions.reduce((acc, tx) => {
        const dateKey = dayjs(tx.date).format('YYYY-MM-DD')

        if (!acc[dateKey]) {
          acc[dateKey] = { income: 0, expense: 0 }
        }

        // 총량
        if (tx.type === 'income') acc[dateKey].income += tx.amount
        else acc[dateKey].expense += tx.amount

        return acc
      }, {})
    },
  },

  actions: {
    // 월별 조회
    async fetchMonthlyTransactions(userId, year, month) {
      this.loading = true
      const start = dayjs(`${year}-${month}-01`).startOf('month').format('YYYY-MM-DD')
      const end = dayjs(`${year}-${month}-01`).endOf('month').format('YYYY-MM-DD')

      try {
        const res = await axios.get(BASE_URL, {
          params: {
            'userId:eq': userId,
            'date:gte': start,
            'date:lte': end,
          },
        })
        this.transactions = res.data
      } finally {
        this.loading = false
      }
    },

    // 거래 추가
    async addTransaction(pureRecord) {
      try {
        const res = await axios.post(BASE_URL, pureRecord)
        this.transactions.push(res.data)
      } catch (err) {
        console.error('등록 실패: ', err)
      }
    },

    // 거래 수정
    async updateTransaction(id, payload) {
      try {
        const res = await axios.patch(`${BASE_URL}/${id}`, payload)
        const index = this.transactions.findIndex((tx) => tx.id === id)
        if (index !== -1) this.transactions[index] = res.data
      } catch (err) {
        console.error('수정 실패: ', err)
      }
    },

    // 거래 삭제
    async deleteTransaction(id) {
      try {
        await axios.delete(`${BASE_URL}/${id}`)
        this.transactions = this.transactions.filter((tx) => tx.id !== id)
      } catch (err) {
        console.error('삭제 실패: ', err)
      }
    },

    setSelectedDate(date) {
      this.selectedDate = date
    },
  },
})
