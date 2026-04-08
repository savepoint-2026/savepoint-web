<template>
  <div class="dashboard">
    <SummaryCards />
  </div>
</template>

<script setup>
import SummaryCards from "@/components/dashboard/SummaryCards.vue";
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
