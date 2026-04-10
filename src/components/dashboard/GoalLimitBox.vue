<template>
  <section class="goal-limit">
    <LimitChart />
    <GoalChart />
    <LimitAlert />
  </section>
</template>

<script setup>
import GoalChart from './GoalChart.vue'
import LimitAlert from './LimitAlert.vue'
import LimitChart from './LimitChart.vue'
</script>

<style scoped>
.goal-limit {
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-rows: 9fr 9fr 7fr;
  gap: 36px;
}

@media (max-width: 768px) {
  .goal-limit {
    gap: 16px;
  }
}
</style>
