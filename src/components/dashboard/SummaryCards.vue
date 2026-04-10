<template>
  <div class="summary-cards">
    <div class="card box-default" v-for="card in cards" :key="card.label">
      <div class="card-icon justify-align" :class="card.bgClass">
        <img :src="card.icon" :alt="card.label" />
      </div>
      <div class="card-content">
        <p class="card-label fw-medium text-black-2">{{ card.label }}</p>
        <div v-if="transactionStore.loading" class="skeleton" />
        <p v-else class="card-amount fw-bold" :class="card.amountClass">
          {{ formatAmount(card.value) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useTransactionStore } from '@/stores/useTransactionStore'
import { useAuthStore } from '@/stores/useAuthStore'
import dayjs from 'dayjs'
import mainIncome from '@/assets/icons/main-page/main-income.png'
import mainExpense from '@/assets/icons/main-page/main-expense.png'
import mainProfit from '@/assets/icons/main-page/main-profit.png'

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

const totalIncome = computed(() =>
  transactionStore.transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0),
)

const totalExpense = computed(() =>
  transactionStore.transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0),
)

const netProfit = computed(() => totalIncome.value - totalExpense.value)

const cards = computed(() => [
  {
    label: '총 수입',
    value: totalIncome.value,
    bgClass: 'bg-green-2',
    icon: mainIncome,
    amountClass: 'text-income',
  },
  {
    label: '총 지출',
    value: totalExpense.value,
    bgClass: 'bg-red-2',
    icon: mainExpense,
    amountClass: 'text-expense',
  },
  {
    label: '순수익',
    value: netProfit.value,
    bgClass: 'bg-blue-1',
    icon: mainProfit,
    amountClass: netProfit.value >= 0 ? 'text-income' : 'text-expense',
  },
])

function formatAmount(amount) {
  const sign = amount < 0 ? '-' : ''
  return `${sign}${Math.abs(amount).toLocaleString('ko-KR')}원`
}
</script>

<style scoped>
.summary-cards {
  grid-row: 1;
  grid-column: 1 / 3;
  display: flex;
  gap: 32px;
}

.card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 28px;
}

.card-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  flex-shrink: 0;
}

.card-icon img {
  width: 24px;
  height: 24px;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-label {
  margin: 0;
  font-size: 13px;
}

.card-amount {
  margin: 0;
  font-size: 20px;
}

.text-income {
  color: #1a7a6e;
}

.text-expense {
  color: var(--red-1);
}

.skeleton {
  width: 100px;
  height: 24px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--black-3) 25%, var(--black-4) 50%, var(--black-3) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 768px) {
  .summary-cards {
    overflow-x: scroll;
  }
}
</style>
