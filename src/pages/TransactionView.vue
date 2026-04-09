<template>
  <div class="transaction-view">
    <div class="left-panel">
      <FilterBar />

      <CalendarGrid />
    </div>
    <div class="right-panel">
      <TransactionList />
    </div>
  </div>
</template>

<script setup>
import FilterBar from '@/components/calendar/FilterBar.vue'
import CalendarGrid from '@/components/calendar/CalendarGrid.vue'
import TransactionList from '@/components/calendar/TransactionList.vue'
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
  height: 80px;
  font-size: 14px;
}

.calendar-placeholder {
  flex: 1;
  font-size: 14px;
}
</style>
