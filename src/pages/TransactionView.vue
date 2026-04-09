<template>
  <div class="transaction-view">
    <div class="left-panel">
      <!-- TODO: 필터 기능 구현 후 연결 -->
      <!-- <FilterBar /> -->
      <div class="placeholder filter-placeholder box-default justify-align text-black-2 fw-medium">필터 영역</div>
      <!-- TODO: 달력 기능 구현 후 연결 -->
      <!-- <CalendarGrid /> -->
      <div class="placeholder calendar-placeholder box-default justify-align text-black-2 fw-medium">달력 영역</div>
    </div>
    <div class="right-panel">
      <TransactionList />
    </div>
  </div>
</template>

<script setup>
// import FilterBar from '@/components/calendar/FilterBar.vue'
// import CalendarGrid from '@/components/calendar/CalendarGrid.vue'
import TransactionList from "@/components/calendar/TransactionList.vue";
</script>

<style scoped>
.transaction-view {
  display: flex;
  gap: 24px;
  height: 100%;
}

.left-panel {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.right-panel {
  flex: 2;
}

.filter-placeholder {
  flex-shrink: 0;
  height: 60px;
  font-size: 14px;
}

.calendar-placeholder {
  flex: 1;
  font-size: 14px;
}
</style>
