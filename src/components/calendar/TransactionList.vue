<template>
  <div class="transaction-list box-default">
    <div class="summary-badges">
      <div class="badge badge-income">
        <span class="badge-label fw-medium">수입</span>
        <span class="badge-amount fw-bold">+{{ totalIncome.toLocaleString('ko-KR') }}</span>
      </div>
      <div class="badge badge-expense">
        <span class="badge-label fw-medium">지출</span>
        <span class="badge-amount fw-bold">-{{ totalExpense.toLocaleString('ko-KR') }}</span>
      </div>
    </div>
    <div class="list-header">
      <div class="header-left">
        <img :src="iconHistory" class="header-icon" alt="거래 상세" />
        <span class="header-title fw-medium text-black-2">거래 상세</span>
      </div>
      <span class="header-count fw-regular text-black-2"
        >총 {{ displayedTransactions.length }}건</span
      >
    </div>

    <div v-if="transactionStore.loading" class="empty-msg text-black-2">불러오는 중...</div>

    <div v-else-if="displayedTransactions.length === 0" class="empty-msg text-black-2">
      거래 내역이 없습니다.
    </div>

    <div v-else class="tx-list">
      <div v-for="tx in displayedTransactions" :key="tx.id" class="tx-item-wrapper">
        <div class="tx-item" @click="toggleSelected(tx.id)">
          <div class="tx-icon-wrap">
            <img
              v-if="getCategoryInfo(tx.categoryId).icon"
              :src="getCategoryInfo(tx.categoryId).icon"
              class="category-icon"
              :alt="getCategoryInfo(tx.categoryId).name"
            />
          </div>
          <div class="tx-info">
            <span class="tx-memo fw-semibold text-black-1">{{ tx.memo || getCategoryInfo(tx.categoryId).name }}</span>
            <span class="tx-date fw-regular text-black-2">{{ formatDate(tx.date) }}</span>
          </div>
          <span
            class="tx-amount fw-bold"
            :class="tx.type === 'income' ? 'text-green-1' : 'text-red-1'"
          >
            {{ formatAmount(tx.type, tx.amount) }}
          </span>
        </div>

        <div v-if="selectedId === tx.id && editingId !== tx.id" class="action-buttons">
          <button class="action-btn edit-btn fw-medium" @click.stop="startEdit(tx)">수정</button>
          <button class="action-btn delete-btn fw-medium" @click.stop="deleteTransaction(tx.id)">
            삭제
          </button>
        </div>

        <div v-if="editingId === tx.id" class="edit-form">
          <div class="edit-row">
            <label class="edit-label fw-medium text-black-2">날짜</label>
            <input v-model="editForm.date" type="date" class="edit-input fw-regular" />
          </div>
          <div class="edit-row">
            <label class="edit-label fw-medium text-black-2">타입</label>
            <div class="edit-type-toggle">
              <button
                class="type-btn fw-medium"
                :class="editForm.type === 'income' ? 'type-active-income' : 'type-inactive'"
                @click.stop="handleEditTypeChange('income')"
              >수입</button>
              <button
                class="type-btn fw-medium"
                :class="editForm.type === 'expense' ? 'type-active-expense' : 'type-inactive'"
                @click.stop="handleEditTypeChange('expense')"
              >지출</button>
            </div>
          </div>
          <div class="edit-row">
            <label class="edit-label fw-medium text-black-2">카테고리</label>
            <select v-model="editForm.categoryId" class="edit-select fw-regular">
              <option v-for="cat in filteredCategories(editForm.type)" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div class="edit-row">
            <label class="edit-label fw-medium text-black-2">메모</label>
            <input v-model="editForm.memo" class="edit-input fw-regular" placeholder="메모" />
          </div>
          <div class="edit-row">
            <label class="edit-label fw-medium text-black-2">금액</label>
            <input
              v-model.number="editForm.amount"
              type="number"
              class="edit-input fw-regular"
              placeholder="금액"
            />
          </div>
          <div class="edit-actions">
            <button class="action-btn cancel-btn fw-medium" @click.stop="cancelEdit">취소</button>
            <button class="action-btn save-btn fw-medium" @click.stop="submitEdit(tx.id)">
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTransactionStore } from '@/stores/useTransactionStore'
import { useUserStore } from '@/stores/useUserStore'
import dayjs from 'dayjs'
import iconHistory from '@/assets/icons/category/category-history.png'
import { getCategoryInfo, getCategoriesByType } from '@/constants/categories'

function filteredCategories(type) {
  return getCategoriesByType(type)
}

const transactionStore = useTransactionStore()
const userStore = useUserStore()

const selectedId = ref(null)
const editingId = ref(null)
const editForm = ref({ date: '', type: 'expense', memo: '', amount: 0, categoryId: '' })

onMounted(async () => {
  const now = dayjs()
  const currentUserId = userStore.id

  await transactionStore.fetchMonthlyTransactions(currentUserId, now.year(), now.month() + 1)
})

const displayedTransactions = computed(() => {
  return [...transactionStore.dailyTransactions].sort(
    (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf(),
  )
})

const totalIncome = computed(() =>
  displayedTransactions.value
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0),
)

const totalExpense = computed(() =>
  displayedTransactions.value
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0),
)

function toggleSelected(id) {
  editingId.value = null
  selectedId.value = selectedId.value === id ? null : id
}

function startEdit(tx) {
  editingId.value = tx.id
  editForm.value = {
    date: tx.date,
    type: tx.type,
    memo: tx.memo ?? '',
    amount: tx.amount,
    categoryId: tx.categoryId,
  }
}

function handleEditTypeChange(newType) {
  editForm.value.type = newType
  editForm.value.categoryId = newType === 'income' ? 'c1' : 'c3'
}

function cancelEdit() {
  editingId.value = null
}

async function submitEdit(id) {
  await transactionStore.updateTransaction(id, {
    date: editForm.value.date,
    type: editForm.value.type,
    memo: editForm.value.memo,
    amount: editForm.value.amount,
    categoryId: editForm.value.categoryId,
  })
  editingId.value = null
  selectedId.value = null
}

async function deleteTransaction(id) {
  await transactionStore.deleteTransaction(id)
  selectedId.value = null
}

function formatDate(date) {
  return dayjs(date).format('YYYY. MM. DD')
}

function formatAmount(type, amount) {
  const sign = type === 'income' ? '+' : '-'
  return `${sign}${amount.toLocaleString('ko-KR')}`
}
</script>

<style scoped>
.transaction-list {
  padding: 24px 20px;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}

.summary-badges {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.badge {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  border-radius: 12px;
  gap: 2px;
}

.badge-label {
  font-size: 12px;
}

.badge-amount {
  font-size: 16px;
}

.badge-income {
  background-color: var(--green-3);
  color: #1a7a6e;
}

.badge-expense {
  background-color: var(--yellow-2);
  color: #b87333;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.header-icon {
  width: 16px;
  height: 16px;
}

.header-title {
  font-size: 13px;
}

.header-count {
  font-size: 13px;
}

.empty-msg {
  font-size: 14px;
  text-align: center;
  padding: 24px 0;
}

.tx-list {
  display: flex;
  flex-direction: column;
}

.tx-item-wrapper {
  border-top: 1px solid var(--black-3);
}

.tx-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 4px;
  cursor: pointer;
}

.tx-item:hover {
  background-color: var(--black-4);
}

.tx-icon-wrap {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.category-icon {
  width: 24px;
  height: 24px;
}

.tx-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.tx-memo {
  font-size: 15px;
}

.tx-date {
  font-size: 12px;
}

.tx-amount {
  font-size: 15px;
  flex-shrink: 0;
}

.action-buttons {
  display: flex;
  gap: 8px;
  padding: 8px 4px 12px;
}

.action-btn {
  flex: 1;
  padding: 12px 0;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
}

.edit-btn {
  background-color: var(--green-2);
  color: #1a7a6e;
}

.delete-btn {
  background-color: var(--red-2);
  color: var(--red-1);
}

.save-btn {
  background-color: var(--green-2);
  color: #1a7a6e;
}

.cancel-btn {
  background-color: var(--black-3);
  color: var(--black-2);
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 8px;
  background-color: var(--black-4);
  border-radius: 12px;
  margin: 4px 0 12px;
}

.edit-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.edit-label {
  font-size: 13px;
  width: 52px;
  flex-shrink: 0;
}

.edit-input,
.edit-select {
  flex: 1;
  border: 1px solid var(--black-3);
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13px;
  outline: none;
  background-color: white;
}

.edit-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.edit-type-toggle {
  display: flex;
  flex: 1;
  gap: 6px;
}

.type-btn {
  flex: 1;
  padding: 8px 0;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
}

.type-active-income {
  background-color: var(--green-2);
  color: #1a7a6e;
}

.type-active-expense {
  background-color: var(--red-2);
  color: var(--red-1);
}

.type-inactive {
  background-color: var(--black-3);
  color: var(--black-2);
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .transaction-list {
    padding: 16px 12px;
    height: auto;
    overflow-y: visible;
  }

  .tx-item {
    padding: 10px 4px;
  }

  .tx-memo {
    font-size: 14px;
  }

  .tx-amount {
    font-size: 14px;
  }

  .badge-amount {
    font-size: 14px;
  }
}
</style>
