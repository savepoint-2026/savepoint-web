<script setup>
import { computed, onMounted, ref } from 'vue'
import TrendBarChart from '@/components/summary/TrendBarChart.vue'
import CategoryDonutChart from '@/components/summary/CategoryDonutChart.vue'
import ComparisonTooltip from '@/components/summary/ComparisonTooltip.vue'
import FoodIcon from '@/assets/icons/category/category-food-white.png'
import TransportIcon from '@/assets/icons/category/category-trans-white.png'
import ShopIcon from '@/assets/icons/category/category-shop-white.png'
import CultureIcon from '@/assets/icons/category/category-culture-white.png'

const FALLBACK_USER_ID = 'u1'
const TOOLTIP_WIDTH = 212
const TOOLTIP_HEIGHT = 60
const TOOLTIP_OFFSET = 16

const CATEGORY_STYLES = {
  c3: { color: '#FBD4AC', icon: FoodIcon, iconLabel: '식비' },
  c4: { color: '#AFC7F6', icon: TransportIcon, iconLabel: '교통' },
  c5: { color: '#D8C0E8', icon: ShopIcon, iconLabel: '쇼핑' },
  c6: { color: '#91DED1', icon: CultureIcon, iconLabel: '문화' },
}

const metricTypes = [
  { label: '전체', value: 'all' },
  { label: '수입', value: 'income' },
  { label: '지출', value: 'expense' },
  { label: '순이익', value: 'net' },
]

const categories = ref([])
const transactions = ref([])
const loading = ref(false)
const selectedMetric = ref('all')
const highlightedCategoryId = ref(null)
const tooltipCategoryId = ref(null)
const selectedMonthKey = ref('')
const tooltipPosition = ref({ x: 0, y: 0 })
const summaryViewRef = ref(null)

const parseMonthKey = (dateString) => String(dateString).slice(0, 7)
const parseDate = (dateString) => new Date(`${dateString}T00:00:00`)
const shortMonthLabel = (monthKey) => `${Number(monthKey.split('-')[1])}월`

const shiftMonthKey = (monthKey, diff) => {
  const [year, month] = monthKey.split('-').map(Number)
  const date = new Date(year, month - 1 + diff, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

const currentUserId = computed(() => window.localStorage.getItem('userId') || FALLBACK_USER_ID)

const getMonthlyAmountByType = (monthKey, type) =>
  transactions.value
    .filter((tx) => parseMonthKey(tx.date) === monthKey && tx.type === type)
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0)

const getCategoryExpense = (monthKey, categoryId) =>
  transactions.value
    .filter(
      (tx) =>
        parseMonthKey(tx.date) === monthKey &&
        tx.type === 'expense' &&
        tx.categoryId === categoryId,
    )
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0)

const recentThreeMonthStats = computed(() => {
  if (!selectedMonthKey.value) return []

  return [2, 1, 0].map((diff) => {
    const monthKey = shiftMonthKey(selectedMonthKey.value, -diff)
    const income = getMonthlyAmountByType(monthKey, 'income')
    const expense = getMonthlyAmountByType(monthKey, 'expense')

    return {
      monthKey,
      label: shortMonthLabel(monthKey),
      income,
      expense,
      net: income - expense,
    }
  })
})

const monthlySummaryCards = computed(() =>
  recentThreeMonthStats.value.map((item, index, array) => ({
    ...item,
    isLatest: index === array.length - 1,
  })),
)

const selectedMonthExpenseCategories = computed(() => {
  if (!selectedMonthKey.value) return []

  const prevMonthKey = shiftMonthKey(selectedMonthKey.value, -1)
  const expenseCategories = categories.value.filter((category) => category.type === 'expense')

  return expenseCategories
    .map((category) => {
      const amount = getCategoryExpense(selectedMonthKey.value, category.id)
      const previousAmount = getCategoryExpense(prevMonthKey, category.id)
      const style = CATEGORY_STYLES[category.id] ?? {
        color: '#D9DDE3',
        icon: null,
        iconLabel: category.name,
      }

      return {
        categoryId: category.id,
        name: category.name,
        amount,
        previousAmount,
        color: style.color,
        icon: style.icon,
        iconLabel: style.iconLabel,
      }
    })
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)
})

const hoveredComparison = computed(() => {
  if (!tooltipCategoryId.value) return null

  const category = selectedMonthExpenseCategories.value.find(
    (item) => item.categoryId === tooltipCategoryId.value,
  )
  if (!category) return null

  const currentAmount = category.amount
  const previousAmount = category.previousAmount
  const difference = Math.abs(currentAmount - previousAmount)

  let detail = '지난달과 비슷해요.'

  if (previousAmount === 0 && currentAmount > 0) {
    detail = `${difference.toLocaleString('ko-KR')}원 새로 썼어요.`
  } else if (currentAmount < previousAmount) {
    detail = `${difference.toLocaleString('ko-KR')}원 줄었어요.`
  } else if (currentAmount > previousAmount) {
    detail = `${difference.toLocaleString('ko-KR')}원 늘었어요.`
  }

  return {
    headline: `${category.name} 소비 비교`,
    detail,
    currentAmount,
  }
})

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('ko-KR')}원`

const updateTooltipPosition = (clientX, clientY) => {
  const containerRect = summaryViewRef.value?.getBoundingClientRect()
  if (!containerRect) return

  const maxX = Math.max(containerRect.width - TOOLTIP_WIDTH, 0)
  const maxY = Math.max(containerRect.height - TOOLTIP_HEIGHT, 0)

  tooltipPosition.value = {
    x: Math.min(Math.max(clientX - containerRect.left + TOOLTIP_OFFSET, 0), maxX),
    y: Math.min(Math.max(clientY - containerRect.top - TOOLTIP_HEIGHT - 4, 0), maxY),
  }
}

const handleMetricClick = (metric) => {
  selectedMetric.value = metric
}

const handleHoverCategory = (payload) => {
  if (!payload?.categoryId) return

  highlightedCategoryId.value = payload.categoryId
  tooltipCategoryId.value = payload.categoryId
  updateTooltipPosition(payload.clientX, payload.clientY)
}

const handleLeaveCategory = () => {
  highlightedCategoryId.value = null
  tooltipCategoryId.value = null
}

const handleHighlightCategory = (categoryId) => {
  highlightedCategoryId.value = categoryId
  tooltipCategoryId.value = categoryId
}

const handleLeaveHighlightCategory = () => {
  highlightedCategoryId.value = null
  tooltipCategoryId.value = null
}

const fetchSummaryData = async () => {
  loading.value = true

  try {
    const response = await fetch('/db.json')
    if (!response.ok) {
      throw new Error('db.json request failed')
    }

    const data = await response.json()

    categories.value = Array.isArray(data.categories) ? data.categories : []
    transactions.value = Array.isArray(data.transactions)
      ? data.transactions
          .filter((tx) => tx.userId === currentUserId.value)
          .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())
      : []

    if (transactions.value.length > 0) {
      selectedMonthKey.value = parseMonthKey(transactions.value[transactions.value.length - 1].date)
    }
  } catch (error) {
    console.error('summary data load failed', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchSummaryData)
</script>

<template>
  <section ref="summaryViewRef" class="summary-view">
    <ComparisonTooltip :comparison="hoveredComparison" :position="tooltipPosition" />

    <div class="summary-toolbar">
      <div class="metric-toggle" role="tablist" aria-label="지표 선택">
        <button
          v-for="type in metricTypes"
          :key="type.value"
          type="button"
          class="metric-toggle__button"
          :class="{ 'metric-toggle__button--active': selectedMetric === type.value }"
          @click="handleMetricClick(type.value)"
        >
          {{ type.label }}
        </button>
      </div>
    </div>

    <div class="summary-content">
      <section class="summary-content__left">
        <TrendBarChart :monthly-data="recentThreeMonthStats" :selected-metric="selectedMetric" />

        <div class="monthly-summary-list">
          <article
            v-for="item in monthlySummaryCards"
            :key="item.monthKey"
            class="monthly-summary-card"
            :class="{ 'monthly-summary-card--latest': item.isLatest }"
          >
            <div class="monthly-summary-card__month">{{ item.label.replace('월', '') }}월</div>
            <p class="monthly-summary-card__title">월간 요약</p>
            <div class="monthly-summary-card__metric">
              <span class="monthly-summary-card__label">INCOME</span>
              <strong class="monthly-summary-card__income">+{{ formatCurrency(item.income) }}</strong>
            </div>
            <div class="monthly-summary-card__metric">
              <span class="monthly-summary-card__label">EXPENSE</span>
              <strong class="monthly-summary-card__expense">-{{ formatCurrency(item.expense) }}</strong>
            </div>
          </article>
        </div>
      </section>

      <section class="summary-content__right">
        <CategoryDonutChart
          :items="selectedMonthExpenseCategories"
          :month-label="selectedMonthKey"
          :active-category-id="highlightedCategoryId"
          @hover-category="handleHoverCategory"
          @leave-category="handleLeaveCategory"
        />

        <article class="category-list-card">
          <div
            v-for="item in selectedMonthExpenseCategories"
            :key="item.categoryId"
            class="category-row"
            :class="{ 'category-row--active': highlightedCategoryId === item.categoryId }"
            @mouseenter="handleHighlightCategory(item.categoryId)"
            @mouseleave="handleLeaveHighlightCategory"
          >
            <div class="category-row__left">
              <span class="category-row__icon" :style="{ backgroundColor: item.color }">
                <img v-if="item.icon" :src="item.icon" :alt="item.iconLabel" />
                <span v-else>{{ item.name.slice(0, 1) }}</span>
              </span>
              <span class="category-row__name">{{ item.name }}</span>
            </div>
            <strong class="category-row__amount">-{{ formatCurrency(item.amount) }}</strong>
          </div>

          <p v-if="!selectedMonthExpenseCategories.length && !loading" class="category-list-card__empty">
            해당 월에 등록된 지출 내역이 없어요.
          </p>
          <p v-if="loading" class="category-list-card__empty">데이터를 불러오는 중입니다.</p>
        </article>
      </section>
    </div>
  </section>
</template>

<style scoped>
@import '@/assets/color.css';
@import '@/assets/font.css';

.summary-view {
  position: relative;
  height: 100%;
  overflow: visible;
  display: grid;
  gap: 10px;
  padding-right: 4px;
  padding-bottom: 8px;
}

.summary-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  min-height: 64px;
  padding-top: 2px;
}

.summary-content {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  gap: 18px;
}

.summary-content__left,
.summary-content__right {
  display: grid;
  gap: 10px;
  align-content: start;
}

.metric-toggle {
  display: inline-flex;
  gap: 4px;
  width: fit-content;
  padding: 4px;
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid rgba(23, 25, 28, 0.08);
  box-shadow: 0 8px 18px rgba(23, 25, 28, 0.05);
}

.metric-toggle__button {
  border: none;
  background: transparent;
  color: var(--black-2);
  border-radius: 14px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.metric-toggle__button--active {
  background: var(--yellow-2);
  color: var(--black-1);
}

.monthly-summary-list {
  display: grid;
  gap: 8px;
}

.monthly-summary-card,
.category-list-card {
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(23, 25, 28, 0.06);
  border-radius: 24px;
  box-shadow: 0 10px 22px rgba(23, 25, 28, 0.05);
}

.monthly-summary-card {
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr) 140px 140px;
  align-items: center;
  gap: 10px;
  padding: 12px 17px;
}

.monthly-summary-card--latest {
  background: linear-gradient(135deg, #fffaf6 0%, #ffffff 100%);
  border-color: rgba(251, 212, 172, 0.92);
  box-shadow: 0 14px 26px rgba(251, 212, 172, 0.24);
}

.monthly-summary-card__month {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--black-3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--black-1);
  font-size: 12px;
  font-weight: 800;
}

.monthly-summary-card__title {
  color: var(--black-1);
  font-size: 15px;
  font-weight: 800;
}

.monthly-summary-card__metric {
  text-align: right;
}

.monthly-summary-card__label {
  display: block;
  margin-bottom: 4px;
  color: #8e96a3;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.monthly-summary-card__income,
.monthly-summary-card__expense {
  font-size: 14px;
  font-weight: 800;
}

.monthly-summary-card__income {
  color: var(--black-1);
}

.monthly-summary-card__expense {
  color: var(--orange-1);
}

.category-list-card {
  padding: 10px;
}

.category-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 13px 12px;
  border-radius: 18px;
  background: #ffffff;
  transition: background-color 0.18s ease, transform 0.18s ease;
}

.category-row + .category-row {
  margin-top: 8px;
}

.category-row--active {
  background: #fff7f0;
  transform: translateY(-1px);
}

.category-row__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-row__icon {
  width: 40px;
  height: 40px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.category-row__icon img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.category-row__icon span {
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
}

.category-row__name {
  color: var(--black-1);
  font-size: 14px;
  font-weight: 800;
}

.category-row__amount {
  color: var(--black-1);
  font-size: 14px;
  font-weight: 800;
}

.category-list-card__empty {
  padding: 16px 8px 4px;
  color: var(--black-2);
  text-align: center;
}

@media (max-width: 1280px) {
  .summary-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .summary-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .summary-view {
    gap: 16px;
  }

  .monthly-summary-card {
    grid-template-columns: 58px 1fr;
  }
}
</style>
