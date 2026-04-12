<template>
  <article class="trend-card">
    <div class="trend-card__header">
      <div>
        <h2 class="trend-card__title">월별 소비 추이</h2>
        <p class="trend-card__description">
          {{ descriptionMap[props.selectedMetric] ?? descriptionMap.all }}
        </p>
      </div>

      <div class="trend-card__legend">
        <span v-for="series in visibleSeries" :key="series.key" class="trend-card__legend-item">
          <span class="trend-card__legend-dot" :style="{ backgroundColor: series.color }" />
          {{ series.label }}
        </span>
      </div>
    </div>

    <div v-if="monthlyData.length" class="trend-chart">
      <div v-for="item in monthlyData" :key="item.monthKey" class="trend-chart__group">
        <div
          class="trend-chart__bars"
          :class="{ 'trend-chart__bars--single': getRenderedSeries(item).length === 1 }"
        >
          <div
            v-for="series in getRenderedSeries(item)"
            :key="series.key"
            class="trend-chart__bar-wrap"
            :data-tooltip="`${item.label} ${series.label} ${formatCurrency(getSeriesValue(item, series.key))}`"
          >
            <div
              class="trend-chart__bar"
              :style="getBarStyle(getSeriesValue(item, series.key), series.color)"
            />
          </div>
        </div>
        <div class="trend-chart__label">{{ item.label }}</div>
      </div>
    </div>

    <div v-else class="trend-card__empty">표시할 데이터가 없어요.</div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  monthlyData: {
    type: Array,
    default: () => [],
  },
  selectedMetric: {
    type: String,
    default: 'all',
  },
})

const descriptionMap = {
  all: '최근 3개월의 수입, 지출, 순이익 흐름을 볼 수 있어요.',
  income: '최근 3개월 수입 흐름을 볼 수 있어요.',
  expense: '최근 3개월 지출 흐름을 볼 수 있어요.',
  net: '최근 3개월 순이익 변화를 볼 수 있어요.',
}

const seriesMeta = [
  { key: 'income', label: '수입', color: 'var(--orange-1)' },
  { key: 'expense', label: '지출', color: 'var(--black-2)' },
  { key: 'net', label: '순이익', color: 'var(--green-1)' },
  { key: 'loss', label: '적자', color: 'var(--yellow-1)' },
]

// 순이익이 음수인 달이 있으면 전체/순이익 탭에서 적자 범주를 노출
const visibleSeries = computed(() => {
  const hasLoss = props.monthlyData.some((item) => (item.net ?? 0) < 0)
  const hasPositiveNet = props.monthlyData.some((item) => (item.net ?? 0) >= 0)

  if (props.selectedMetric === 'all') {
    return seriesMeta.filter((series) => {
      if (series.key === 'net') return hasPositiveNet
      if (series.key === 'loss') return hasLoss
      return ['income', 'expense'].includes(series.key)
    })
  }

  if (props.selectedMetric === 'net') {
    return seriesMeta.filter((series) => {
      if (series.key === 'net') return hasPositiveNet
      if (series.key === 'loss') return hasLoss
      return false
    })
  }

  return seriesMeta.filter((series) => series.key === props.selectedMetric)
})

// 적자는 음수 순이익을 절댓값으로 변환해 별도 막대로 표현
const getSeriesValue = (item, seriesKey) => {
  if (seriesKey === 'loss') {
    return (item.net ?? 0) < 0 ? Math.abs(item.net ?? 0) : null
  }

  if (seriesKey === 'net') {
    return (item.net ?? 0) >= 0 ? (item.net ?? 0) : null
  }

  return item[seriesKey] ?? 0
}

const getRenderedSeries = (item) =>
  visibleSeries.value.filter((series) => getSeriesValue(item, series.key) !== null)

const maxAbsValue = computed(() => {
  const values = props.monthlyData.flatMap((item) =>
    getRenderedSeries(item).map((series) => getSeriesValue(item, series.key) ?? 0),
  )
  return Math.max(...values.map((value) => Math.abs(value)), 1)
})

// 값의 크기를 최대값 대비 비율로 계산
const getBarStyle = (value, color) => {
  const ratio = (Math.abs(value) / maxAbsValue.value) * 100

  return {
    height: `${Math.max(ratio, 6)}%`,
    background: color,
    alignSelf: 'end',
  }
}

const formatCurrency = (value) => `${Number(value ?? 0).toLocaleString('ko-KR')}원`
</script>

<style scoped>
@import '@/assets/color.css';

.trend-card {
  background: #ffffff;
  border: 1px solid rgba(23, 25, 28, 0.05);
  border-radius: 24px;
  min-height: 328px;
  padding: 22px 22px 18px;
  box-shadow: 0 10px 24px rgba(23, 25, 28, 0.05);
}

.trend-card__header {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 14px;
}

.trend-card__title {
  margin: 0;
  color: var(--black-1);
  font-size: 24px;
  font-weight: 800;
}

.trend-card__description {
  margin-top: 6px;
  color: var(--black-2);
  font-size: 13px;
}

.trend-card__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
  align-self: flex-start;
}

.trend-card__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--black-2);
  font-size: 13px;
  font-weight: 700;
}

.trend-card__legend-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}

.trend-chart {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  min-height: 254px;
}

.trend-chart__group {
  display: grid;
  gap: 10px;
  align-items: end;
}

.trend-chart__bars {
  min-height: 214px;
  display: flex;
  justify-content: center;
  gap: 16px;
  align-items: stretch;
  padding: 14px 20px 0;
  border-radius: 24px;
  background:
    linear-gradient(to top, rgba(23, 25, 28, 0.04) 1px, transparent 1px) 0 100% / 100% 25%,
    var(--black-4);
}

.trend-chart__bars--single {
  justify-content: center;
}

.trend-chart__bar-wrap {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 100%;
  align-items: center;
  position: relative;
}

.trend-chart__bar {
  width: 30px;
  max-width: 100%;
  border-radius: 10px 10px 4px 4px;
  min-height: 6px;
  box-shadow: 0 8px 14px rgba(23, 25, 28, 0.08);
  animation: trend-bar-grow 0.65s ease both;
  transform-origin: bottom;
}

.trend-chart__bar-wrap::after {
  content: attr(data-tooltip);
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  transform: translateX(-50%) translateY(3px);
  min-width: max-content;
  max-width: 168px;
  padding: 7px 10px;
  border-radius: 12px;
  background: rgba(23, 25, 28, 0.92);
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
  text-align: center;
  white-space: nowrap;
  box-shadow: 0 10px 18px rgba(23, 25, 28, 0.16);
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
  z-index: 2;
}

.trend-chart__bar-wrap::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: calc(100% + 2px);
  width: 10px;
  height: 10px;
  background: rgba(23, 25, 28, 0.92);
  transform: translateX(-50%) rotate(45deg) translateY(3px);
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
  z-index: 1;
}

.trend-chart__bar-wrap:hover::after {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.trend-chart__bar-wrap:hover::before {
  opacity: 1;
  transform: translateX(-50%) rotate(45deg) translateY(0);
}

.trend-chart__group:nth-child(1) .trend-chart__bar {
  animation-delay: 0.08s;
}

.trend-chart__group:nth-child(2) .trend-chart__bar {
  animation-delay: 0.16s;
}

.trend-chart__group:nth-child(3) .trend-chart__bar {
  animation-delay: 0.24s;
}

.trend-chart__label {
  text-align: center;
  color: var(--black-2);
  font-size: 13px;
  font-weight: 700;
}

.trend-card__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  color: var(--black-2);
  font-size: 14px;
}

/* 막대 차트 애니메이션  */
@keyframes trend-bar-grow {
  from {
    opacity: 0.35;
    transform: scaleY(0.12);
  }

  to {
    opacity: 1;
    transform: scaleY(1);
  }
}

@media (max-width: 640px) {
  .trend-card {
    min-height: auto;
    padding: 18px 18px 14px;
  }

  .trend-card__header {
    flex-direction: column;
  }

  .trend-chart {
    gap: 10px;
    min-height: 230px;
  }

  .trend-chart__bars {
    min-height: 188px;
    padding: 14px 16px 0;
  }

  .trend-chart__bar {
    width: 24px;
  }
}
</style>
