<template>
  <div class="goal-chart box-default">
    <h2 class="section-title fw-bold text-black-1">목표 달성</h2>

    <div v-if="loading" class="skeleton-wrap">
      <div class="skeleton skeleton-title" />
      <div class="skeleton skeleton-bar" />
    </div>

    <div v-else-if="goals.length === 0" class="empty-state">
      <p class="empty-msg text-black-2">아직 등록된 목표가 없어요.</p>
      <p class="empty-sub text-black-2">프로필에서 목표를 설정해보세요!</p>
    </div>

    <ul v-else class="goal-list">
      <li v-for="goal in goalsWithProgress" :key="goal.id" class="goal-item">
        <div class="goal-header">
          <span class="goal-name fw-medium text-black-1">{{ goal.itemName }}</span>
          <span
            class="goal-amount fw-semibold"
            :class="goal.achieved ? 'text-achieved' : 'text-black-2'"
          >
            {{
              goal.achieved
                ? '달성 완료!'
                : `${formatAmount(netProfit)} / ${formatAmount(goal.targetAmount)}`
            }}
          </span>
        </div>

        <div class="bar-track">
          <div
            class="bar-fill"
            :class="goal.achieved ? 'bar-achieved' : 'bar-progress'"
            :style="{ width: `${goal.progressRate}%` }"
          />
        </div>

        <div v-if="goal.achieved" class="celebrate">
          <img :src="smileIcon" alt="달성 축하" class="celebrate-img" />
          <span class="fw-bold text-achieved">목표 달성!</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useTransactionStore } from '@/stores/useTransactionStore'
import { useAuthStore } from '@/stores/useAuthStore'
import dayjs from 'dayjs'
import smileIcon from '@/assets/icons/group/group-smile.png'

const authStore = useAuthStore()
const transactionStore = useTransactionStore()
const goals = ref([])
const loading = ref(false)

onMounted(async () => {
  const now = dayjs()
  loading.value = true
  try {
    const [goalsRes] = await Promise.all([
      axios.get('/api/goals', {
        params: { userId: authStore.currentUserId },
      }),
      transactionStore.fetchMonthlyTransactions(
        authStore.currentUserId,
        now.year(),
        now.month() + 1,
      ),
    ])
    goals.value = goalsRes.data
  } finally {
    loading.value = false
  }
})

const netProfit = computed(() => {
  const income = transactionStore.transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)
  const expense = transactionStore.transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)
  return income - expense
})

const goalsWithProgress = computed(() =>
  goals.value.map((goal) => {
    const rate = Math.min((netProfit.value / goal.targetAmount) * 100, 100)
    return {
      ...goal,
      progressRate: Math.max(rate, 0),
      achieved: netProfit.value >= goal.targetAmount,
    }
  }),
)

function formatAmount(amount) {
  return `${amount.toLocaleString('ko-KR')}원`
}
</script>

<style scoped>
.goal-chart {
  width: 100%;
  flex: 1;
  padding: 28px 32px;

  box-sizing: border-box;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 16px;
}

/* skeleton */
.skeleton-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton {
  border-radius: 6px;
  background: linear-gradient(90deg, var(--black-3) 25%, var(--black-4) 50%, var(--black-3) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-title {
  width: 40%;
  height: 16px;
}

.skeleton-bar {
  width: 100%;
  height: 12px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 24px 0;
}

.empty-msg {
  margin: 0;
  font-size: 14px;
}

.empty-sub {
  margin: 0;
  font-size: 12px;
}

/* goal list */
.goal-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.goal-name {
  font-size: 14px;
}

.goal-amount {
  font-size: 13px;
}

.text-achieved {
  color: #1a7a6e;
}

/* progress bar */
.bar-track {
  width: 100%;
  height: 12px;
  background-color: var(--black-3);
  border-radius: 999px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease;
}

.bar-progress {
  background-color: var(--yellow-1);
}

.bar-achieved {
  background-color: var(--green-1);
}

/* celebrate */
.celebrate {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding: 8px 12px;
  background-color: var(--green-3);
  border-radius: 8px;
}

.celebrate-img {
  width: 18px;
  height: 18px;
}

.celebrate span {
  font-size: 13px;
}
</style>
