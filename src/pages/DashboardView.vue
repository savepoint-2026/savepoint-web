<template>
  <div class="dashboard">
    <SummaryCards />
    <RecentTransactions />
    <GoalLimitBox />
  </div>
</template>

<script setup>
import SummaryCards from '@/components/dashboard/SummaryCards.vue'
import RecentTransactions from '@/components/dashboard/RecentTransactions.vue'
import GoalLimitBox from '@/components/dashboard/GoalLimitBox.vue'
</script>

// row min을 최근 거래 내역 다섯 개 들어갔을 때 값으로 변경
<style scoped>
.dashboard {
  width: 100%;
  height: fit-content;
  display: grid;
  grid-template-columns: 3fr 2fr;
  grid-template-rows: 180px minmax(480px, 1fr);
  row-gap: 40px;
  column-gap: 40px;
}

@media (max-width: 768px) {
  .dashboard {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}
</style>
