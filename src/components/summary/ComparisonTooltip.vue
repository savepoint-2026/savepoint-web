<template>
  <div
    class="comparison-tooltip"
    :class="{ 'comparison-tooltip--active': props.comparison }"
    :style="{ left: `${props.position.x}px`, top: `${props.position.y}px` }"
  >
    <div class="comparison-tooltip__icon">!</div>

    <div class="comparison-tooltip__content">
      <p class="comparison-tooltip__title">{{ title }}</p>
      <p class="comparison-tooltip__summary">{{ summary }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// 부모가 전달한 comparison 데이터와 좌표로 소비 비교 툴팁 표시
const props = defineProps({
  comparison: {
    type: Object,
    default: null,
  },
  position: {
    type: Object,
    default: () => ({ x: 0, y: 0 }),
  },
})

const formatAmount = (value) => `${Number(value ?? 0).toLocaleString('ko-KR')}원`

const title = computed(() => props.comparison?.headline ?? '')
const summary = computed(() => {
  if (!props.comparison) return ''
  return `${props.comparison.detail} 현재 ${formatAmount(props.comparison.currentAmount)}`
})
</script>

<style scoped>
@import '@/assets/color.css';

.comparison-tooltip {
  position: absolute;
  z-index: 20;
  width: 236px;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 10px 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f7f7fa 100%);
  border: 1px solid rgba(23, 25, 28, 0.06);
  border-radius: 20px;
  box-shadow: 0 10px 18px rgba(23, 25, 28, 0.05);
  opacity: 0;
  visibility: hidden;
  transform: translate3d(0, 4px, 0);
  transition:
    opacity 0.14s ease,
    transform 0.14s ease;
  pointer-events: none;
}

.comparison-tooltip--active {
  opacity: 1;
  visibility: visible;
  background: linear-gradient(135deg, var(--yellow-2) 0%, #ffffff 100%);
  transform: translate3d(0, 0, 0);
}

.comparison-tooltip__icon {
  width: 28px;
  height: 28px;
  border-radius: 12px;
  background: #fffdf4;
  border: 1px solid rgba(23, 25, 28, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f4b52d;
  font-size: 13px;
  font-weight: 800;
  flex-shrink: 0;
}

.comparison-tooltip__content {
  min-width: 0;
}

.comparison-tooltip__title,
.comparison-tooltip__summary {
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.35;
}

.comparison-tooltip__title {
  -webkit-line-clamp: 1;
  color: var(--black-1);
  font-size: 13px;
  font-weight: 800;
}

.comparison-tooltip__summary {
  -webkit-line-clamp: 2;
  margin-top: 4px;
  color: var(--black-2);
  font-size: 11px;
  font-weight: 600;
}
</style>
