<template>
  <div class="goal-item">
    <div class="label-box">
      <img :src="Goal" width="18" height="18" />
      <span class="text-black-2 fw-bold">나의 절약 목표</span>
    </div>
    <div class="goal-content bg-black-4">
      <GoalModify v-if="userStore.isModifying" />
      <AddAlertButton :label="'목표'" v-else-if="Object.keys(userStore.goalData).length === 0" />
      <span class="text-black-1 fw-black" v-else>
        {{
          `${Number(userStore.goalData.targetAmount).toLocaleString()} &#8361의 ${userStore.goalData.itemName}을(를) 나에게 선물하겠다!`
        }}
      </span>
    </div>
  </div>
</template>

<script setup>
import Goal from '@/assets/icons/mypage/mypage-goal.png'

import { useUserStore } from '@/stores/useUserStore'
import GoalModify from './GoalModify.vue'
import AddAlertButton from './AddAlertButton.vue'

const userStore = useUserStore()
</script>

<style scoped>
.goal-item {
  width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: column;
  gap: 12px;
}

.label-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label-box span {
  font-size: 14px;
}

.goal-content {
  width: 100%;
  height: fit-content;
  min-height: 88px;
  border-radius: 32px;
  padding: 20px 32px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  border: 1px solid var(--black-3);
}

.goal-content span {
  font-size: 20px;
}
</style>
