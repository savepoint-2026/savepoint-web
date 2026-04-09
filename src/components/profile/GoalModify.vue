<template>
  <div class="goal-modify">
    <GoalInput
      v-for="type in ['itemName', 'targetAmount']"
      :type="type"
      :data="userStore.goalModifyData[type]"
      @value-change="(data) => userStore.updateGoalData(type, data)"
    />
  </div>
</template>

<script setup>
import GoalInput from './GoalInput.vue'

import { useUserStore } from '@/stores/useUserStore'

const userStore = useUserStore()
</script>

<style>
.goal-modify {
  width: 100%;
  height: 100%;

  display: flex;
  gap: 36px;
}
</style>
