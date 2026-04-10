<template>
  <div
    class="limit-alert box-default"
    :class="limitIndex == 1 ? `bg-${colors[limitIndex]}-2` : `bg-${colors[limitIndex]}-3`"
    v-if="limitIndex >= 0"
  >
    <span
      class="icon-box justify-align"
      :class="limitIndex == 1 ? `bg-${colors[limitIndex]}-1` : `bg-${colors[limitIndex]}-2`"
      >{{ icons[limitIndex] }}</span
    >
    <div class="content-box">
      <span class="title text-black-1 fw-bold">{{ titles[limitIndex] }}</span>
      <span class="content text-black-1 fw-regular">
        {{ `이번 달 한도의 ${limitRate}%를 사용했어요.` }}<br />
        {{ contents[limitIndex] }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { useTransactionStore } from '@/stores/useTransactionStore'
import { useUserStore } from '@/stores/useUserStore'
import { ref, onMounted, computed, watch } from 'vue'

const colors = ['green', 'yellow', 'red']
const icons = ['✅️', '🤔', '🚨']
const titles = ['이러다 절약왕 되겠는걸?', '조금만 방심하면 파산...', '위험! 거지 되기 직전!']
const contents = [
  '아주 멋진 소비 습관이에요!',
  '이제부터 열심히 절약해 봅시다!',
  '소비 습관을 점검해 볼까요?',
]

const authStore = useAuthStore()
const userStore = useUserStore()
const transactionStore = useTransactionStore()

const limitRate = ref(0)
const limitIndex = ref(-1)

onMounted(async () => {
  try {
    userStore.loadUserData(authStore.currentUserId)
  } catch {}
})

const expense = computed(() => {
  return transactionStore.transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)
})

watch(
  () => userStore.userData,
  (newValue) => {
    if (userStore.userData.expenseLimit) {
      const rate = (expense.value / newValue.expenseLimit) * 100

      if (rate > 70) limitIndex.value = 2
      else if (rate > 30) limitIndex.value = 1
      else limitIndex.value = 0

      limitRate.value = Math.max(Math.round(rate), 0)
    }
  },
)
</script>

<style scoped>
.limit-alert {
  width: 100%;
  height: 100%;
  min-height: 128px;

  padding: 36px 32px;
  box-sizing: border-box;

  display: flex;
  gap: 16px;
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 20px;
  font-size: 20px;
}

.content-box {
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 4px;
  box-sizing: border-box;
}

.title {
  font-size: 16px;
}

.content {
  font-size: 12px;
}
</style>
