<template>
  <div class="calendar-grid box-default">
    <div class="weekday-header">
      <div
        v-for="(day, index) in weekDays"
        :key="index"
        :class="['weekday-cell fw-bold', getWeekdayColor(index)]"
      >
        {{ day }}
      </div>
    </div>

    <div class="days-grid">
      <div
        v-for="day in calendarDays"
        :key="day.fullDate"
        :class="[
          'day-cell',
          { 'not-current-month': !day.isCurrentMonth },
          { 'selected-day': day.fullDate === store.selectedDate && !store.isMonthView },
        ]"
        @click="selectDate(day.fullDate)"
      >
        <div :class="['date-num fw-bold', { today: day.isToday }]">
          {{ day.dateNum }}
        </div>

        <div class="day-records" v-if="aggregated[day.fullDate]">
          <p
            v-if="aggregated[day.fullDate].income > 0"
            class="record-income fw-semibold text-green-1"
          >
            +{{ aggregated[day.fullDate].income.toLocaleString() }}
          </p>
          <p
            v-if="aggregated[day.fullDate].expense > 0"
            class="record-expense fw-semibold text-red-1"
          >
            -{{ aggregated[day.fullDate].expense.toLocaleString() }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTransactionStore } from '@/stores/useTransactionStore'
import { useUserStore } from '@/stores/useUserStore'
import dayjs from 'dayjs'

const store = useTransactionStore()
const userStore = useUserStore()

// 요일 배열 및 색상 지정 (일요일 빨강, 토요일 파랑)
const weekDays = ['일', '월', '화', '수', '목', '금', '토']
const getWeekdayColor = (index) => {
  if (index === 0) return 'text-red-1'
  if (index === 6) return 'text-blue-2'
  return 'text-black-2'
}

// 스토어에서 계산된 날짜별 수입/지출 합계 가져오기
const aggregated = computed(() => store.aggregatedByDate)

// 현재 스토어의 선택된 날짜(selectedDate)를 기준으로 달력 계산
const calendarDays = computed(() => {
  const currentViewDate = dayjs(store.selectedDate)
  const start = currentViewDate.startOf('month').startOf('week') // 시작점 - 일
  const end = currentViewDate.endOf('month').endOf('week') // 끝점 - 토

  const days = []
  let day = start

  while (day.isBefore(end) || day.isSame(end, 'day')) {
    days.push({
      fullDate: day.format('YYYY-MM-DD'),
      dateNum: day.date(),
      isCurrentMonth: day.month() === currentViewDate.month(),
      isToday: day.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD'),
    })
    day = day.add(1, 'day')
  }
  return days
})

const selectDate = (dateString) => {
  const oldMonth = dayjs(store.selectedDate).month()
  const newMonth = dayjs(dateString).month()

  store.setSelectedDate(dateString)
  store.isMonthView = false

  if (oldMonth !== newMonth) {
    const year = dayjs(dateString).year()
    const currentUserId = userStore.userData.id

    store.fetchMonthlyTransactions(currentUserId, year, newMonth + 1)
  }
}
</script>

<style scoped>
.calendar-grid {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  padding: 0;
  overflow: hidden;
}

.weekday-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  border-bottom: 1px solid var(--black-4);
}

.weekday-cell {
  padding: 16px 0;
  font-size: 14px;
}

.days-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr;
}

.day-cell {
  padding: 8px;
  border-right: 1px solid var(--black-4);
  border-bottom: 1px solid var(--black-4);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  transition: background-color 0.2s ease;
  display: flex;
  flex-direction: column;
}

.day-cell:nth-child(7n) {
  border-right: none;
}
.days-grid .day-cell:nth-last-child(-n + 7) {
  border-bottom: none;
}

.day-cell:hover {
  background-color: #f9fafb;
}

.selected-day {
  background-color: #fff7f0;
}

.not-current-month {
  opacity: 0.3;
}

.date-num {
  font-size: 14px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-bottom: 4px;
}

.today {
  background-color: var(--black-1);
  color: white;
}

.day-records {
  margin-top: auto;
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.record-income,
.record-expense {
  font-size: 14px;
  margin: 0;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .weekday-cell {
    padding: 10px 0;
    font-size: 12px;
  }

  .day-cell {
    padding: 4px;
    min-height: 60px;
  }

  .date-num {
    font-size: 12px;
    width: 20px;
    height: 20px;
  }

  .record-income,
  .record-expense {
    font-size: 10px;
  }
}
</style>
