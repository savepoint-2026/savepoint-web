<template>
  <div class="filter-bar box-default">
    <div class="month-nav">
      <button class="icon-btn bg-black-4 box-shadow-sm justify-align" @click="prevMonth">
        <img src="@/assets/icons/arrow-left.png" alt="이전 달" class="nav-icon" />
      </button>

      <span class="current-month fw-black text-black-1">{{ currentMonthText }}</span>

      <button class="icon-btn bg-black-4 box-shadow-sm justify-align" @click="nextMonth">
        <img src="@/assets/icons/arrow-right.png" alt="다음 달" class="nav-icon" />
      </button>
    </div>

    <button class="month-all-btn box-shadow-sm" @click="handleMonthView">월 거래 내역 조회</button>

    <div class="filter-group">
      <div class="filter-icon-box bg-black-4 justify-align box-shadow-sm">
        <img src="@/assets/icons/filter.png" alt="필터" class="filter-icon" />
      </div>

      <select
        v-model="store.filterType"
        class="custom-select fw-bold text-black-2 bg-black-4 box-shadow-sm"
        @change="handleTypeChange"
      >
        <option value="all">유형 전체</option>
        <option value="income">수입</option>
        <option value="expense">지출</option>
      </select>

      <select
        v-model="store.filterCategory"
        class="custom-select fw-bold text-black-2 bg-black-4 box-shadow-sm"
      >
        <option value="all">카테고리 전체</option>
        <option v-for="cat in availableCategories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTransactionStore } from '@/stores/useTransactionStore'
import axios from 'axios'
import dayjs from 'dayjs'

const store = useTransactionStore()

// 1. 월 이동
const currentMonthText = computed(() => dayjs(store.selectedDate).format('YYYY년 M월'))

const prevMonth = () =>
  updateMonth(
    dayjs(store.selectedDate).subtract(1, 'month').startOf('month'),
    (store.isMonthView = true),
  )

const nextMonth = () =>
  updateMonth(
    dayjs(store.selectedDate).add(1, 'month').startOf('month'),
    (store.isMonthView = true),
  )

const updateMonth = (newDateObj) => {
  const newDateStr = newDateObj.format('YYYY-MM-DD')
  store.setSelectedDate(newDateStr)
  store.fetchMonthlyTransactions('u1', newDateObj.year(), newDateObj.month() + 1)
}

const handleMonthView = () => {
  store.isMonthView = true
}

// 필터 로직
const allCategories = ref([]) // 서버에서 받아올 전체 카테고리

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/categories')
    allCategories.value = res.data
  } catch (error) {
    console.error('카테고리 로딩 실패:', error)
  }

  // 현재 월 데이터 가져오기
  const year = dayjs(store.selectedDate).year()
  const month = dayjs(store.selectedDate).month() + 1
  store.fetchMonthlyTransactions('u1', year, month)
})

// 유형(수입/지출/전체)에 따라 하위 카테고리 목록 동적 변경
const availableCategories = computed(() => {
  if (store.filterType === 'all') return allCategories.value
  return allCategories.value.filter((cat) => cat.type === store.filterType)
})

// 유형(Type)을 변경하면 세부 카테고리(Category)는 '전체'로 초기화
const handleTypeChange = () => {
  store.filterCategory = 'all'
}
</script>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 40px;
  height: 80px;
  box-sizing: border-box;
}

.month-nav {
  display: flex;
  align-items: center;
  gap: 16px;
}
.icon-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.icon-btn:hover {
  background-color: var(--black-3);
}
.nav-icon {
  width: 20px;
  height: 20px;
}
.current-month {
  font-size: 20px;
  width: 120px;
  text-align: center;
  white-space: nowrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 10px;
}
.filter-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 12px;
}
.filter-icon {
  width: 18px;
  height: 18px;
}

.custom-select {
  height: 40px;
  padding: 0 40px;
  border: 1px solid var(--black-4);
  border-radius: 12px;
  appearance: none;
  background-image: url(@/assets/icons/arrow-down.png);
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 10px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  text-align: center;
}
.custom-select:focus,
.custom-select:hover {
  border-color: var(--black-2);
}

.box-shadow-sm {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
}

.month-all-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 30px;
  margin-left: 8px;

  background-color: var(--yellow-1);
  color: var(--black-1);

  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;

  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.month-all-btn:hover {
  opacity: 0.8;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .filter-bar {
    padding: 16px;
    height: auto;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 16px;
  }

  .month-nav {
    order: 1;
    width: 100%;
    justify-content: center;
    gap: 16px;
  }

  .current-month {
    font-size: 16px;
    width: 80px;
  }

  .icon-btn {
    width: 36px;
    height: 36px;
  }

  .filter-group {
    order: 2;
    margin: 0;
  }

  .custom-select {
    height: 36px;
    padding: 0 24px 0 12px;
    font-size: 12px;
  }

  .filter-icon-box {
    width: 36px;
    height: 36px;
  }

  .month-all-btn {
    order: 3;
    margin: 0;
    height: 36px;
    padding: 0 12px;
    font-size: 12px;
  }
}
</style>
