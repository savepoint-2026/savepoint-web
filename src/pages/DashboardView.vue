<template>
  <div class="dashboard">
    <SummaryCards />
    <RecentTransactions />
    <GoalChart />
  </div>
</template>

<script setup>
import SummaryCards from "@/components/dashboard/SummaryCards.vue";
import RecentTransactions from "@/components/dashboard/RecentTransactions.vue";
import GoalChart from "@/components/dashboard/GoalChart.vue";
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
