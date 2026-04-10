<template>
  <div class="recent-transactions box-default">
    <div class="header">
      <div class="header-left">
        <img :src="iconHistory" class="header-icon" alt="최근 거래" width="24" height="24" />
        <h2 class="section-title fw-black text-black-1">최근 거래 내역</h2>
      </div>
      <router-link to="/transactions" class="more-link fw-bold text-yellow-1">
        전체 보기
      </router-link>
    </div>

    <div v-if="transactionStore.loading" class="skeleton-wrap">
      <div v-for="n in 5" :key="n" class="skeleton-row">
        <div class="skeleton skeleton-icon" />
        <div class="skeleton-info">
          <div class="skeleton skeleton-memo" />
          <div class="skeleton skeleton-date" />
        </div>
        <div class="skeleton skeleton-amount" />
      </div>
    </div>

    <div v-else-if="recentTransactions.length === 0" class="empty-msg text-black-2">
      이번 달 거래 내역이 없습니다.
    </div>

    <ul v-else class="tx-list">
      <li v-for="tx in recentTransactions" :key="tx.id" class="tx-item">
        <div class="tx-icon-wrap">
          <img
            v-if="getCategoryInfo(tx.categoryId).icon"
            :src="getCategoryInfo(tx.categoryId).icon"
            :alt="getCategoryInfo(tx.categoryId).name"
            class="category-icon"
            width="20"
            height="20"
          />
        </div>
        <div class="tx-info">
          <span class="tx-memo fw-semibold text-black-1">{{ tx.memo ?? '-' }}</span>
          <span class="tx-date fw-regular text-black-2">{{ formatDate(tx.date) }}</span>
        </div>
        <span
          class="tx-amount fw-bold"
          :class="tx.type === 'income' ? 'text-income' : 'text-expense'"
        >
          {{ formatAmount(tx.type, tx.amount) }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useTransactionStore } from '@/stores/useTransactionStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { getCategoryInfo } from '@/constants/categories'
import dayjs from 'dayjs'
import iconHistory from '@/assets/icons/main-page/main-history-purple.png'

const RECENT_COUNT = 5

const authStore = useAuthStore()
const transactionStore = useTransactionStore()

onMounted(async () => {
  const now = dayjs()
  await transactionStore.fetchMonthlyTransactions(
    authStore.currentUserId,
    now.year(),
    now.month() + 1,
  )
})

const recentTransactions = computed(() => {
  return [...transactionStore.transactions]
    .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
    .slice(0, RECENT_COUNT)
})

function formatDate(date) {
  return dayjs(date).format('YYYY. MM. DD')
}

function formatAmount(type, amount) {
  const sign = type === 'income' ? '+' : '-'
  return `${sign}${amount.toLocaleString('ko-KR')}`
}
</script>

<style scoped>
.recent-transactions {
  grid-row: 2;
  grid-column: 1;
  width: 100%;
  height: fit-content;
  padding: 36px;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 52px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title {
  margin: 0;
  font-size: 20px;
}

.more-link {
  font-size: 14px;
  text-decoration: none;
  cursor: pointer;
}

.more-link:hover {
  color: var(--black-1);
}

/* skeleton */
.skeleton-wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skeleton-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.skeleton-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skeleton {
  border-radius: 6px;
  background: linear-gradient(90deg, var(--black-3) 25%, var(--black-4) 50%, var(--black-3) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-memo {
  width: 60%;
  height: 14px;
}

.skeleton-date {
  width: 40%;
  height: 12px;
}

.skeleton-amount {
  width: 60px;
  height: 14px;
  flex-shrink: 0;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* empty */
.empty-msg {
  font-size: 14px;
  text-align: center;
  padding: 24px 0;
}

/* tx list */
.tx-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.tx-item {
  display: flex;
  align-items: center;
  gap: 30px;
}

.tx-icon-wrap {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.category-icon {
  width: 24px;
  height: 24px;
  opacity: 0.6;
}

.tx-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tx-memo {
  font-size: 18px;
}

.tx-date {
  font-size: 14px;
}

.tx-amount {
  font-size: 20px;
  flex-shrink: 0;
}

.text-income {
  color: #1a7a6e;
}

.text-expense {
  color: var(--red-1);
}
</style>
