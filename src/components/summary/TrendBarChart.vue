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
  all: '최근 3개월의 수입, 지출, 순이익 흐름을 한 번에 볼 수 있어요.',
  income: '최근 3개월 수입 흐름만 집중해서 볼 수 있어요.',
  expense: '최근 3개월 지출 흐름만 집중해서 볼 수 있어요.',
  net: '최근 3개월 순이익 변화를 확인할 수 있어요.',
}

const seriesMeta = [
  { key: 'income', label: '수입', color: 'var(--orange-1)' },
  { key: 'expense', label: '지출', color: 'var(--black-2)' },
  { key: 'net', label: '순이익', color: 'var(--green-1)' },
]

const visibleSeries = computed(() =>
  props.selectedMetric === 'all'
    ? seriesMeta
    : seriesMeta.filter((series) => series.key === props.selectedMetric),
)

const maxAbsValue = computed(() => {
  const values = props.monthlyData.flatMap((item) =>
    visibleSeries.value.map((series) => item[series.key] ?? 0),
  )
  return Math.max(...values.map((value) => Math.abs(value)), 1)
})

const baselineRatio = computed(() => {
  const hasNegative = props.monthlyData.some((item) =>
    visibleSeries.value.some((series) => (item[series.key] ?? 0) < 0),
  )
  return hasNegative ? 50 : 100
})

const getBarStyle = (value, color) => {
  const ratio = (Math.abs(value) / maxAbsValue.value) * baselineRatio.value

  if (baselineRatio.value === 100) {
    return {
      height: `${Math.max(ratio, 6)}%`,
      background: color,
      alignSelf: 'end',
    }
  }

  return value >= 0
    ? {
        height: `${Math.max(ratio, 6)}%`,
        background: color,
        alignSelf: 'end',
      }
    : {
        height: `${Math.max(ratio, 6)}%`,
        background: color,
        opacity: 0.82,
        alignSelf: 'start',
      }
}

const formatCurrency = (value) => `${Number(value ?? 0).toLocaleString('ko-KR')}원`
</script>

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
      <div v-if="baselineRatio === 50" class="trend-chart__baseline" />

      <div v-for="item in monthlyData" :key="item.monthKey" class="trend-chart__group">
        <div
          class="trend-chart__bars"
          :class="{ 'trend-chart__bars--single': visibleSeries.length === 1 }"
        >
          <div
            v-for="series in visibleSeries"
            :key="series.key"
            class="trend-chart__bar-wrap"
            :title="`${item.label} ${series.label} ${formatCurrency(item[series.key])}`"
          >
            <div class="trend-chart__bar" :style="getBarStyle(item[series.key], series.color)" />
          </div>
        </div>
        <div class="trend-chart__label">{{ item.label }}</div>
      </div>
    </div>

    <div v-else class="trend-card__empty">표시할 데이터가 없어요.</div>
  </article>
</template>

<style scoped>
@import '@/assets/color.css';

.trend-card {
  background: #ffffff;
  border: 1px solid rgba(23, 25, 28, 0.05);
  border-radius: 24px;
  padding: 18px 20px 14px;
  box-shadow: 0 10px 24px rgba(23, 25, 28, 0.05);
}

.trend-card__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 10px;
}

.trend-card__title {
  margin: 0;
  color: var(--black-1);
  font-size: 18px;
  font-weight: 800;
}

.trend-card__description {
  margin-top: 4px;
  color: var(--black-2);
  font-size: 11px;
}

.trend-card__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  align-self: flex-start;
}

.trend-card__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--black-2);
  font-size: 11px;
  font-weight: 700;
}

.trend-card__legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.trend-chart {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  min-height: 246px;
}

.trend-chart__baseline {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  border-top: 1px dashed rgba(23, 25, 28, 0.12);
}

.trend-chart__group {
  display: grid;
  gap: 8px;
  align-items: end;
}

.trend-chart__bars {
  min-height: 214px;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  gap: 6px;
  align-items: stretch;
  padding: 12px 24px 0;
  border-radius: 20px;
  background:
    linear-gradient(to top, rgba(23, 25, 28, 0.04) 1px, transparent 1px) 0 100% / 100% 25%,
    #fafafb;
}

.trend-chart__bars--single {
  display: flex;
  justify-content: center;
}

.trend-chart__bar-wrap {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 100%;
  align-items: center;
}

.trend-chart__bar {
  width: 22px;
  max-width: 100%;
  border-radius: 10px 10px 4px 4px;
  min-height: 6px;
  box-shadow: 0 8px 14px rgba(23, 25, 28, 0.08);
}

.trend-chart__label {
  text-align: center;
  color: var(--black-2);
  font-size: 11px;
  font-weight: 700;
}

.trend-card__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  color: var(--black-2);
  font-size: 14px;
}

@media (max-width: 640px) {
  .trend-card {
    padding: 14px 16px 10px;
  }

  .trend-card__header {
    flex-direction: column;
  }

  .trend-chart {
    gap: 10px;
  }
}
</style>
