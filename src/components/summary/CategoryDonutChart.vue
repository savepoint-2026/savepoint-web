<script setup>
import { computed } from 'vue'

const emit = defineEmits(['hover-category', 'leave-category'])

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  monthLabel: {
    type: String,
    default: '',
  },
  activeCategoryId: {
    type: String,
    default: null,
  },
})

const totalAmount = computed(() =>
  props.items.reduce((sum, item) => sum + Number(item.amount || 0), 0),
)

const activeItem = computed(
  () =>
    props.items.find((item) => item.categoryId === props.activeCategoryId) ??
    props.items[0] ??
    null,
)

const activeShare = computed(() => {
  if (!activeItem.value || totalAmount.value === 0) return 0
  return Math.round((activeItem.value.amount / totalAmount.value) * 100)
})

const polarToCartesian = (cx, cy, radius, angle) => {
  const radian = ((angle - 90) * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(radian),
    y: cy + radius * Math.sin(radian),
  }
}

const createArcPath = (startAngle, endAngle, outerRadius, innerRadius) => {
  const outerStart = polarToCartesian(120, 120, outerRadius, startAngle)
  const outerEnd = polarToCartesian(120, 120, outerRadius, endAngle)
  const innerEnd = polarToCartesian(120, 120, innerRadius, endAngle)
  const innerStart = polarToCartesian(120, 120, innerRadius, startAngle)
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ')
}

const chartSegments = computed(() => {
  if (!props.items.length || totalAmount.value === 0) return []

  let startAngle = -90
  const totalSweep = 360
  const gap = 5

  return props.items.map((item) => {
    const rawSweep = (item.amount / totalAmount.value) * totalSweep
    const sweep = Math.max(rawSweep - gap, 10)
    const segmentStart = startAngle
    const segmentEnd = segmentStart + sweep
    startAngle += rawSweep

    return {
      ...item,
      path: createArcPath(segmentStart, segmentEnd, 86, 56),
      active: item.categoryId === props.activeCategoryId,
    }
  })
})

const formatMonthLabel = computed(() => {
  if (!props.monthLabel) return '-'
  const [year, month] = props.monthLabel.split('-')
  return `${year}.${month}`
})

const emitHoverCategory = (categoryId, event) => {
  emit('hover-category', {
    categoryId,
    clientX: event.clientX,
    clientY: event.clientY,
    source: 'chart',
  })
}
</script>

<template>
  <article class="donut-card" @mouseleave="emit('leave-category')">
    <div class="donut-card__header">
      <div>
        <h2 class="donut-card__title">어디에 많이 썼을까?</h2>
        <p class="donut-card__description">가장 큰 지출 항목을 마우스로 살펴보세요.</p>
      </div>
    </div>

    <div v-if="items.length" class="donut-card__body">
      <div class="category-donut-chart">
        <svg
          viewBox="0 0 240 240"
          class="category-donut-chart__svg"
          aria-label="지출 카테고리 분포"
          @mouseleave="emit('leave-category')"
        >
          <path
            v-for="segment in chartSegments"
            :key="segment.categoryId"
            :d="segment.path"
            :fill="segment.color"
            class="category-donut-chart__segment"
            :class="{ 'category-donut-chart__segment--active': segment.active }"
            @mouseenter="emitHoverCategory(segment.categoryId, $event)"
            @mousemove="emitHoverCategory(segment.categoryId, $event)"
          />
        </svg>

        <div class="category-donut-chart__center">
          <p class="category-donut-chart__month">{{ formatMonthLabel }}</p>
          <strong class="category-donut-chart__share">{{ activeShare }}%</strong>
        </div>
      </div>

      <ul class="donut-card__legend">
        <li
          v-for="item in items"
          :key="item.categoryId"
          class="donut-card__legend-item"
          :class="{ 'donut-card__legend-item--active': item.categoryId === activeCategoryId }"
        >
          <span class="donut-card__swatch" :style="{ backgroundColor: item.color }" />
          <span class="donut-card__legend-label">{{ item.name }}</span>
        </li>
      </ul>
    </div>

    <div v-else class="category-donut-chart category-donut-chart--empty">
      <p>해당 월의 지출 데이터가 없어요.</p>
    </div>
  </article>
</template>

<style scoped>
@import '@/assets/color.css';

.donut-card {
  position: relative;
  background: #ffffff;
  border: 1px solid rgba(23, 25, 28, 0.06);
  border-radius: 24px;
  padding: 18px;
  box-shadow: 0 14px 28px rgba(23, 25, 28, 0.06);
}

.donut-card__title {
  margin: 0;
  color: var(--black-1);
  font-size: 21px;
  font-weight: 800;
}

.donut-card__description {
  margin-top: 6px;
  color: var(--black-2);
  font-size: 13px;
}

.donut-card__body {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 20px;
  align-items: center;
  margin-top: 12px;
}

.category-donut-chart {
  position: relative;
  width: 240px;
  height: 240px;
  margin: 0 auto;
}

.category-donut-chart__svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.category-donut-chart__segment {
  cursor: pointer;
  opacity: 0.82;
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
  transform-origin: 120px 120px;
}

.category-donut-chart__segment:hover,
.category-donut-chart__segment--active {
  opacity: 1;
  transform: scale(1.03);
}

.category-donut-chart__center {
  position: absolute;
  inset: 62px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: inset 0 0 0 1px rgba(23, 25, 28, 0.04);
  pointer-events: none;
}

.category-donut-chart__month {
  color: var(--black-2);
  font-size: 13px;
  font-weight: 700;
}

.category-donut-chart__share {
  margin-top: 8px;
  color: var(--black-1);
  font-size: 34px;
  font-weight: 900;
  line-height: 1;
}

.category-donut-chart--empty {
  min-height: 240px;
  color: var(--black-2);
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.donut-card__legend {
  list-style: none;
  display: grid;
  gap: 12px;
  padding: 0;
  margin: 0;
}

.donut-card__legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 28px;
  padding: 0;
  border-radius: 0;
  background: transparent;
  transition: transform 0.18s ease;
}

.donut-card__legend-item--active {
  transform: translateY(-1px);
}

.donut-card__swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.donut-card__legend-label {
  color: var(--black-2);
  font-size: 13px;
  font-weight: 700;
}

@media (max-width: 640px) {
  .donut-card {
    padding: 18px 16px;
  }

  .donut-card__body {
    grid-template-columns: 1fr;
  }
}
</style>
