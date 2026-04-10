<template>
  <div class="info-box">
    <InfoItem v-for="id in [0, 1, 2]" :id="id" />
    <GoalItem />
  </div>
</template>

<script setup>
import GoalItem from './GoalItem.vue'
import InfoItem from './InfoItem.vue'
</script>

<style scoped>
.info-box {
  grid-row: 2;
  grid-column: 1 / 3;

  width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: column;
  gap: 32px;

  margin-top: 48px;
}
</style>
