<template>
  <div class="add-view">
    <div class="header-area">
      <h2 class="page-title text-black-1 fw-black">새로운 지출/수입 기록 ✍️</h2>
    </div>

    <div class="form-container box-default">
      <div class="toggle-wrapper">
        <div class="toggle-group bg-black-3">
          <button
            :class="[
              'toggle-btn fw-bold',
              form.type === 'income' ? 'active-income' : 'text-black-2',
            ]"
            @click="changeType('income', 'c1')"
          >
            수입 (+)
          </button>
          <button
            :class="[
              'toggle-btn fw-bold',
              form.type === 'expense' ? 'active-expense' : 'text-black-2',
            ]"
            @click="changeType('expense', 'c3')"
          >
            지출 (-)
          </button>
        </div>
      </div>

      <div class="form-content">
        <div class="form-row">
          <span class="label fw-black text-black-1">날짜</span>

          <label class="input-box bg-black-3" style="cursor: pointer" @click="openDatePicker">
            <img src="@/assets/icons/add/add-calendar.png" alt="Calendar" class="icon" />
            <input
              type="date"
              ref="dateInput"
              v-model="form.date"
              class="hidden-input fw-bold text-black-1"
            />
          </label>
        </div>

        <div class="form-row">
          <span class="label fw-black text-black-1">금액</span>
          <div class="input-box bg-black-3 relative">
            <img src="@/assets/icons/add/add-cost.png" alt="Wallet" class="icon" />
            <input
              type="number"
              v-model.number="form.amount"
              class="hidden-input fw-black text-black-1"
              placeholder="0"
            />
            <span class="currency fw-black text-black-1">₩</span>
          </div>
        </div>

        <div class="hint-row" v-if="form.type === 'expense' && form.headcount > 1">
          <p class="hint-text fw-medium text-black-2">
            * 1인당
            <span class="highlight-amount fw-bold text-red-1"
              >{{ finalAmount.toLocaleString() }}원</span
            >으로 저장됩니다.
          </p>
        </div>

        <div class="form-row">
          <span class="label fw-black text-black-1">카테고리</span>
          <div class="input-box bg-black-3 relative">
            <img src="@/assets/icons/add/add-category.png" alt="Tag" class="icon" />
            <select v-model="form.categoryId" class="hidden-input fw-black text-black-1 select-box">
              <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-row" v-show="form.type === 'expense'">
          <span class="label fw-black text-black-1">이거 엔빵?</span>
          <div class="split-control bg-black-3">
            <button
              class="icon-btn bg-black-4 fw-black text-black-1 box-shadow-sm"
              @click="decreaseHeadcount"
            >
              -
            </button>
            <input
              type="number"
              name="headcount"
              class="hidden-input headcount fw-black text-black-1"
              v-model="form.headcount"
            />
            <button
              class="icon-btn bg-black-4 fw-black text-black-1 box-shadow-sm"
              @click="increaseHeadcount"
            >
              +
            </button>
          </div>
        </div>

        <div class="form-row textarea-row">
          <span class="label textarea-label fw-black text-black-1">메모</span>
          <div class="textarea-box bg-black-3">
            <img src="@/assets/icons/add/add-memo.png" alt="Message" class="icon top-icon" />
            <textarea
              v-model="form.memo"
              class="hidden-input fw-medium text-black-1"
              placeholder="무슨 일이 있었나요?"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="btn-group">
        <button
          class="cancel-btn bg-black-4 text-black-1 fw-black box-shadow-sm justify-align gap-8"
          @click="handleCancel"
        >
          <img src="@/assets/icons/x-black.png" alt="X" class="btn-icon" /> 취소
        </button>
        <button class="orange-btn justify-align gap-8" @click="handleSave">
          <img src="@/assets/icons/check.png" alt="Check" class="btn-icon" /> 저장하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactionStore } from '@/stores/useTransactionStore'
import axios from 'axios'
import dayjs from 'dayjs'

const router = useRouter()
const store = useTransactionStore()

const dateInput = ref(null)

const form = reactive({
  type: 'expense',
  date: dayjs().format('YYYY-MM-DD'),
  amount: null,
  categoryId: 'c3',
  memo: '',
  headcount: 1,
})

const categories = ref([])

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/categories')
    categories.value = response.data
  } catch (error) {
    console.error('카테고리 데이터를 불러오는데 실패했습니다:', error)
  }
})

const filteredCategories = computed(() => categories.value.filter((cat) => cat.type === form.type))

const changeType = (type, defaultCategory) => {
  form.type = type
  form.categoryId = defaultCategory
  if (type === 'income') form.headcount = 1
}

const increaseHeadcount = () => form.headcount++
const decreaseHeadcount = () => {
  if (form.headcount > 1) form.headcount--
}

const finalAmount = computed(() => {
  if (!form.amount) return 0
  return form.type === 'expense' && form.headcount > 1
    ? Math.floor(form.amount / form.headcount)
    : form.amount
})

const handleSave = async () => {
  if (!form.amount || form.amount <= 0) {
    alert('올바른 금액을 입력해주세요.')
    return
  }

  const pureRecord = {
    id: `t${Date.now()}`,
    userId: 'u1',
    categoryId: form.categoryId,
    date: form.date,
    type: form.type,
    amount: finalAmount.value,
    memo: form.memo,
  }

  await store.addTransaction(pureRecord)
  alert('성공적으로 저장되었습니다!')
  router.push('/transactions')
}

const handleCancel = () => {
  if (confirm('입력하신 내용을 모두 초기화하시겠습니까?')) {
    const currentType = form.type

    Object.assign(form, {
      type: currentType,
      date: dayjs().format('YYYY-MM-DD'),
      amount: null,
      memo: '',
      headcount: 1,
    })

    changeType(currentType, currentType === 'income' ? 'c1' : 'c3')
  }
}

const openDatePicker = () => {
  if (dateInput.value) {
    dateInput.value.showPicker()
  }
}
</script>

<style scoped>
.add-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

/* 헤더 영역 */
.header-area {
  width: 100%;
  max-width: 900px;
  margin-bottom: 24px;
  text-align: left;
}
.page-title {
  font-size: 22px;
  margin: 0;
}

.form-container {
  width: 100%;
  max-width: 900px;
  padding: 50px 36px;
  box-sizing: border-box;
}

/* 1. 토글 길이 축소 & 중앙 정렬 */
.toggle-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}
.toggle-group {
  display: flex;
  width: 500px;
  height: 52px;
  border-radius: 26px;
  padding: 4px;
  box-sizing: border-box;
}
.toggle-btn {
  flex: 1;
  border: none;
  background: transparent;
  border-radius: 22px;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.2s ease-in-out;
}
.active-income {
  background-color: var(--green-1);
  color: var(--black-4);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}
.active-expense {
  background-color: #ffb3b3;
  color: var(--black-4);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

/* 2. 폼 내부 요소 */
.form-content {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.label {
  width: 80px;
  font-size: 14px;
}

.input-box,
.textarea-box,
.split-control {
  flex: 1;
  border-radius: 20px;
  box-sizing: border-box;
}

.input-box {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 16px;
}

.hidden-input {
  border: none !important;
  background: transparent !important;
  outline: none !important;
  box-shadow: none !important;
  flex: 1;
  width: 100%;
}

.hidden-input::-webkit-outer-spin-button,
.hidden-input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  display: none !important;
  margin: 0 !important;
}
.hidden-input[type='number'] {
  -moz-appearance: textfield !important;
}

.icon {
  width: 18px;
  height: 18px;
  margin-right: 12px;
}

.relative {
  position: relative;
}
.currency {
  position: absolute;
  right: 20px;
}
.select-box {
  cursor: pointer;
}

/* 3. 엔빵 계산기 */
.split-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 160px;
  height: 56px;
  padding: 4px 6px;
}

.icon-btn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 20px;
}

.headcount {
  text-align: center !important;
  padding: 0 !important;
}

.box-shadow-sm {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
}

/* 엔빵 안내 문구 */
.hint-row {
  margin-top: -16px;
  padding-left: 92px;
}
.hint-text {
  font-size: 13px;
  margin: 0;
  padding-left: 8px;
}

/* 4. 메모 입력 */
.textarea-row {
  align-items: flex-start;
}
.textarea-label {
  padding-top: 18px;
}
.textarea-box {
  display: flex;
  height: 120px; /* 메모장 높이 늘림 */
  padding: 16px;
}
.top-icon {
  margin-top: 2px;
}

/* 5. 하단 버튼 */
.btn-group {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 48px;
}
.cancel-btn {
  width: 110px;
  height: 56px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}
.cancel-btn:hover {
  background-color: #ededef;
}
.gap-8 {
  gap: 8px;
}
.btn-icon {
  width: 16px;
  height: 16px;
}
</style>
