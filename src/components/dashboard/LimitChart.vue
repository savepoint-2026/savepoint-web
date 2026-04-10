<template>
  <div class="limit-chart box-default" v-if="!userStore.loading && authStore.currentUserId">
    <div class="limit-box" v-if="userStore.userData.expenseLimit">
      <div class="title-box">
        <img :src="LimitIcon" width="20px" height="20px" />
        <h2 class="section-title fw-bold text-black-1">한도 소진까지...</h2>
      </div>

      <div class="track-box">
        <div
          class="percentage bg-black-1 fw-bold justify-align"
          :style="{ left: `calc(${progressRate}% - 22px)` }"
        >
          {{ progressRate }}%
        </div>
        <div class="track-icon" :style="{ left: `calc(${progressRate}% - 14px)` }">
          {{ userStore.userData.profileImg }}
        </div>
        <div class="bar-track">
          <div
            class="bar-fill"
            :class="progressRate >= 100 ? 'bar-achieved' : 'bar-progress'"
            :style="{ width: `${progressRate}%` }"
          />
        </div>
      </div>
      <div class="limit-footer">
        <div v-if="progressRate >= 100" class="exhaust">
          <span class="fw-bold text-exhaust">한도 소진!</span>
        </div>
        <span class="limit-amount fw-semibold text-black-2" v-else>
          {{ formatAmount(expense) }} ₩
        </span>
        <span class="limit-amount fw-semibold text-black-1">
          {{ formatAmount(userStore.userData.expenseLimit) }} ₩
        </span>
      </div>
    </div>
    <div v-else class="empty-state">
      <p class="empty-msg text-black-1 fw-semibold">아직 등록된 한도가 없어요.</p>
      <router-link to="/profile"><AddAlertButton :label="'한도'" /></router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useTransactionStore } from '@/stores/useTransactionStore'
import { useAuthStore } from '@/stores/useAuthStore'
import LimitIcon from '@/assets/icons/main-page/main-limit-yellow.png'
import { useUserStore } from '@/stores/useUserStore'
import AddAlertButton from '../profile/AddAlertButton.vue'

const authStore = useAuthStore()
const userStore = useUserStore()
const transactionStore = useTransactionStore()

const progressRate = ref(0)

onMounted(async () => {
  try {
    userStore.loadUserData(authStore.currentUserId)
  } catch {}
})

watch(
  () => userStore.userData,
  (newValue) => {
    if (userStore.userData.expenseLimit) {
      const rate = Math.min((expense.value / newValue.expenseLimit) * 100, 100)

      progressRate.value = Math.max(Math.round(rate), 0)
    }
  },
)

const expense = computed(() => {
  return transactionStore.transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)
})

function formatAmount(amount) {
  return `${amount.toLocaleString('ko-KR')}`
}
</script>

<style scoped>
.limit-chart {
  width: 100%;
  height: 100%;
  padding: 28px 32px;

  box-sizing: border-box;
}

.limit-box {
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

.limit-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.limit-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.limit-name {
  font-size: 14px;
}

.limit-amount {
  font-size: 13px;
}

.text-exhaust {
  color: var(--red-1);
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
  background-color: var(--yellow-1);
}

.bar-achieved {
  background-color: var(--red-1);
}

.exhaust {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: var(--red-3);
  border-radius: 8px;
}

.exhaust-img {
  width: 18px;
  height: 18px;
}

.exhaust span {
  font-size: 13px;
}
</style>
