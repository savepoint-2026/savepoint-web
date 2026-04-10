<template>
  <div class="goal-chart box-default" v-if="!loading && !userStore.loading">
    <div class="goal-box" v-if="Object.keys(goal.data).length">
      <div class="title-box">
        <img :src="GoalIcon" width="20px" height="20px" />
        <h2 class="section-title fw-bold text-black-1">"{{ goal.data.itemName }}" 구매까지...</h2>
      </div>

      <div class="track-box">
        <div
          class="percentage bg-black-1 fw-bold justify-align"
          :style="{ left: `calc(${goal.data.progressRate}% - 22px)` }"
        >
          {{ goal.data.progressRate }}%
        </div>
        <div class="track-icon" :style="{ left: `calc(${goal.data.progressRate}% - 14px)` }">
          {{ userStore.userData.profileImg }}
        </div>
        <div class="bar-track">
          <div
            class="bar-fill"
            :class="goal.data.achieved ? 'bar-achieved' : 'bar-progress'"
            :style="{ width: `${goal.data.progressRate}%` }"
          />
        </div>
      </div>
      <div class="goal-footer">
        <div v-if="goal.data.achieved" class="celebrate">
          <span class="fw-bold text-achieved">목표 달성!</span>
        </div>
        <span class="goal-amount fw-semibold text-black-2" v-else>
          {{ formatAmount(netProfit) }} ₩
        </span>
        <span class="goal-amount fw-semibold text-black-1">
          {{ formatAmount(goal.data.targetAmount) }} ₩
        </span>
      </div>
    </div>
    <div v-else class="empty-state">
      <p class="empty-msg text-black-1 fw-semibold">아직 등록된 목표가 없어요.</p>
      <router-link to="/profile"><AddAlertButton :label="'목표'" /></router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import axios from 'axios'
import { useTransactionStore } from '@/stores/useTransactionStore'
import { useAuthStore } from '@/stores/useAuthStore'
import dayjs from 'dayjs'
import GoalIcon from '@/assets/icons/main-page/main-goal-green.png'
import { useUserStore } from '@/stores/useUserStore'
import AddAlertButton from '../profile/AddAlertButton.vue'

const authStore = useAuthStore()
const userStore = useUserStore()
const transactionStore = useTransactionStore()
const goal = reactive({ data: {} })
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

    if (goalsRes.data.length) {
      const data = goalsRes.data[0]
      const rate = Math.min((netProfit.value / data.targetAmount) * 100, 100)
      goal.data = {
        ...data,
        progressRate: Math.max(Math.round(rate), 0),
        achieved: netProfit.value >= data.targetAmount,
      }
    }
  } finally {
    userStore.loadUserData(authStore.currentUserId)
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

function formatAmount(amount) {
  return `${amount.toLocaleString('ko-KR')}`
}
</script>

<style scoped>
.goal-chart {
  width: 100%;
  height: 100%;
  padding: 28px 32px;

  box-sizing: border-box;
}

.goal-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title-box {
  width: fit-content;
  height: fit-content;
  align-items: center;

  display: flex;
  gap: 16px;
}

.section-title {
  margin: 0;
  font-size: 18px;
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
  gap: 12px;
  padding: 24px 0;
}

.empty-msg {
  margin: 0;
  font-size: 18px;
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

.goal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
.track-box {
  width: 100%;
  height: fit-content;
  padding-top: 24px;
  box-sizing: border-box;

  position: relative;
}

.bar-track {
  width: 100%;
  height: 16px;
  background-color: var(--black-3);
  border-radius: 999px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease;
}

.percentage {
  width: 40px;
  height: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  color: white;
  font-size: 10px;

  position: absolute;
  top: -8px;
}

.track-icon {
  position: absolute;
  top: 18px;
  font-size: 22px;
}

.bar-progress {
  background-color: var(--green-2);
}

.bar-achieved {
  background-color: var(--green-1);
}

/* celebrate */
.celebrate {
  display: flex;
  align-items: center;
  gap: 6px;
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
