import { defineStore } from 'pinia'
import axios from 'axios'
import dayjs from 'dayjs'

const BASE_URL = 'http://localhost:3000/transactions'

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [], // 전체 데이터
    rangeTransactions: [], // 기간별 데이터
    selectedDate: dayjs().format('YYYY-MM-DD'), // 달력에서 클릭한 날짜 (기본값: 오늘)
    loading: false,
    rangeLoading: false,
    filterType: 'all',
    filterCategory: 'all',
    isMonthView: true,
    groupExpense: [
      {
        userid: '',
        expense: '',
      },
    ],
  }),

  getters: {
    // 필터링: 선택된 유형(수입/지출)과 카테고리에 맞게 데이터 걸러내기
    filteredTransactions: (state) => {
      return state.transactions.filter((tx) => {
        const isTypeMatch = state.filterType === 'all' || tx.type === state.filterType
        const isCategoryMatch =
          state.filterCategory === 'all' || tx.categoryId === state.filterCategory

        return isTypeMatch && isCategoryMatch
      })
    },

    // 날짜별 합계 데이터 (달력 날짜칸에 수입/지출 표시)
    // 결과: { "2026-04-08": {income: 50000, expense: 12000}, ...}
    aggregatedByDate(state) {
      return this.filteredTransactions.reduce((acc, tx) => {
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

    // 날짜 필터링
    dailyTransactions(state) {
      // 월 전체 조회
      if (state.isMonthView) {
        return this.filteredTransactions
      }

      return this.filteredTransactions.filter(
        (tx) => dayjs(tx.date).format('YYYY-MM-DD') === state.selectedDate,
      )
    },

    // 기간 데이터(rangeTransactions)를 월 단위로 집계
    monthlyAggregation(state) {
      const byMonth = new Map()

      state.rangeTransactions.forEach((tx) => {
        const monthKey = String(tx.date).slice(0, 7)
        const amount = Number(tx.amount || 0)

        if (!byMonth.has(monthKey)) {
          byMonth.set(monthKey, {
            income: 0,
            expense: 0,
            expenseByCategory: new Map(),
          })
        }

        const monthData = byMonth.get(monthKey)
        if (tx.type === 'income') {
          monthData.income += amount
          return
        }

        if (tx.type === 'expense') {
          monthData.expense += amount

          if (tx.categoryId) {
            const prevAmount = monthData.expenseByCategory.get(tx.categoryId) ?? 0
            monthData.expenseByCategory.set(tx.categoryId, prevAmount + amount)
          }
        }
      })

      return byMonth
    },

    // 기준 월(baseMonthKey) 기준 최근 3개월 통계
    getThreeMonthStats() {
      return (baseMonthKey) => {
        if (!baseMonthKey) return []

        return [2, 1, 0].map((diff) => {
          const targetDate = dayjs(`${baseMonthKey}-01`).subtract(diff, 'month')
          const monthKey = targetDate.format('YYYY-MM')
          const monthData = this.monthlyAggregation.get(monthKey)
          const income = monthData?.income ?? 0
          const expense = monthData?.expense ?? 0

          return {
            monthKey,
            label: `${targetDate.month() + 1}월`,
            income,
            expense,
            net: income - expense,
          }
        })
      }
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

    // 그룹원별 비용 계산
    async fetchGroupRunners(memberIds) {
      try {
        let runnersExpenses = []
        for (const userId of memberIds) {
          const totalAmount = await this.getCurrentMonthExpenseByUserId(userId)
          runnersExpenses.push({
            userId,
            amount: totalAmount,
          })
        }
        return runnersExpenses
      } catch (err) {
        console.error('그룹원별 비용 계산 실패: ', err)
      }
    },

    // 현재달 비용 계산
    async getCurrentMonthExpenseByUserId(userId) {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')

      const res = await axios.get(BASE_URL, {
        params: {
          userId,
          type: 'expense',
          date_gte: start,
          date_lte: end,
        },
      })

      return res.data.reduce((sum, tx) => sum + tx.amount, 0)
    },

    // 기간별 조회
    async fetchRangeTransactions(userId, startDate, endDate) {
      this.rangeLoading = true

      try {
        const res = await axios.get(BASE_URL, {
          params: {
            'userId:eq': userId,
            'date:gte': startDate,
            'date:lte': endDate,
          },
        })
        this.rangeTransactions = res.data
      } finally {
        this.rangeLoading = false
      }
    },

    // 거래 추가
    async addTransaction(pureRecord) {
      try {
        const res = await axios.post(BASE_URL, pureRecord)
        this.transactions.push(res.data)

        // 현재 기간 조회 범위에 포함되는 거래면 rangeTransactions에도 반영
        const summaryStart = dayjs().subtract(2, 'month').startOf('month')
        const summaryEnd = dayjs().endOf('month')
        const recordDate = dayjs(res.data.date)

        if (
          recordDate.isValid() &&
          (recordDate.isAfter(summaryStart, 'day') || recordDate.isSame(summaryStart, 'day')) &&
          (recordDate.isBefore(summaryEnd, 'day') || recordDate.isSame(summaryEnd, 'day'))
        ) {
          this.rangeTransactions.push(res.data)
        }
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

    setFilterType(type) {
      this.filterType = type
    },

    setFilterCategory(categoryId) {
      this.filterCategory = categoryId
    },
  },
})
