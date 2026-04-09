<template>
  <div class="transaction-list box-default">
    <div class="list-header">
      <h2 class="section-title fw-bold text-black-1">
        {{ isFiltered ? selectedDateLabel : "전체 거래 내역" }}
      </h2>
      <button v-if="isFiltered" class="reset-btn fw-medium text-black-2" @click="resetFilter">
        전체 보기
      </button>
    </div>

    <div v-if="transactionStore.loading" class="empty-msg text-black-2">
      불러오는 중...
    </div>

    <div v-else-if="displayedTransactions.length === 0" class="empty-msg text-black-2">
      거래 내역이 없습니다.
    </div>

    <table v-else class="tx-table">
      <thead>
        <tr>
          <th class="fw-semibold text-black-2">날짜</th>
          <th class="fw-semibold text-black-2">카테고리</th>
          <th class="fw-semibold text-black-2">금액</th>
          <th class="fw-semibold text-black-2">메모</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="tx in displayedTransactions" :key="tx.id">
          <tr class="tx-row" @click="toggleSelected(tx.id)">
            <td class="fw-regular text-black-2">{{ formatDate(tx.date) }}</td>
            <td>
              <div class="category-cell">
                <img
                  v-if="getCategoryInfo(tx.categoryId).icon"
                  :src="getCategoryInfo(tx.categoryId).icon"
                  class="category-icon"
                  :alt="getCategoryInfo(tx.categoryId).name"
                />
                <span class="fw-regular text-black-2">{{ getCategoryInfo(tx.categoryId).name }}</span>
              </div>
            </td>
            <td class="fw-semibold" :class="tx.type === 'income' ? 'text-green-1' : 'text-red-1'">
              {{ formatAmount(tx.type, tx.amount) }}
            </td>
            <td class="fw-regular text-black-2">{{ tx.memo ?? "-" }}</td>
            <td>
              <img
                :src="arrowDown"
                class="arrow-icon"
                :class="{ rotated: selectedId === tx.id }"
                alt="펼치기"
              />
            </td>
          </tr>
          <tr v-if="selectedId === tx.id" class="action-row">
            <td colspan="5">
              <div class="action-buttons">
                <button class="action-btn edit-btn fw-medium" @click.stop="startEdit(tx)">
                  수정
                </button>
                <button class="action-btn delete-btn fw-medium" @click.stop="deleteTransaction(tx.id)">
                  삭제
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="editingId === tx.id" class="edit-row">
            <td colspan="5">
              <div class="edit-form">
                <input
                  v-model="editForm.memo"
                  class="edit-input fw-regular"
                  placeholder="메모"
                />
                <input
                  v-model.number="editForm.amount"
                  type="number"
                  class="edit-input fw-regular"
                  placeholder="금액"
                />
                <div class="edit-actions">
                  <button class="action-btn edit-btn fw-medium" @click.stop="submitEdit(tx.id)">
                    저장
                  </button>
                  <button class="action-btn fw-medium text-black-2" @click.stop="cancelEdit">
                    취소
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useTransactionStore } from "@/stores/useTransactionStore";
import dayjs from "dayjs";
import arrowDown from "@/assets/icons/arrow-down.png";
import iconFood from "@/assets/icons/category/category-food-black.png";
import iconTrans from "@/assets/icons/category/category-trans-black.png";
import iconShop from "@/assets/icons/category/category-shop-black.png";
import iconCulture from "@/assets/icons/category/category-culture-black.png";

const CATEGORY_MAP = {
  c1: { name: "급여", icon: null },
  c2: { name: "용돈", icon: null },
  c3: { name: "식비", icon: iconFood },
  c4: { name: "교통/통신", icon: iconTrans },
  c5: { name: "쇼핑", icon: iconShop },
  c6: { name: "문화/여가", icon: iconCulture },
};

function getCategoryInfo(categoryId) {
  return CATEGORY_MAP[categoryId] ?? { name: categoryId, icon: null };
}

// TODO: useUserStore 연결 후 실제 userId로 교체
const DUMMY_USER_ID = "u1";

const transactionStore = useTransactionStore();
const selectedId = ref(null);
const editingId = ref(null);
const editForm = ref({ memo: "", amount: 0 });

onMounted(async () => {
  const now = dayjs();
  await transactionStore.fetchMonthlyTransactions(
    DUMMY_USER_ID,
    now.year(),
    now.month() + 1,
  );
});

const isFiltered = computed(() => !!transactionStore.selectedDate);

const selectedDateLabel = computed(() =>
  dayjs(transactionStore.selectedDate).format("MM월 DD일"),
);

const displayedTransactions = computed(() => {
  const list = isFiltered.value
    ? transactionStore.dailyTransactions
    : transactionStore.transactions;
  return [...list].sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
});

function resetFilter() {
  transactionStore.setSelectedDate(null);
}

function toggleSelected(id) {
  editingId.value = null;
  selectedId.value = selectedId.value === id ? null : id;
}

function startEdit(tx) {
  editingId.value = tx.id;
  editForm.value = { memo: tx.memo ?? "", amount: tx.amount };
}

function cancelEdit() {
  editingId.value = null;
}

async function submitEdit(id) {
  await transactionStore.updateTransaction(id, {
    memo: editForm.value.memo,
    amount: editForm.value.amount,
  });
  editingId.value = null;
  selectedId.value = null;
}

async function deleteTransaction(id) {
  await transactionStore.deleteTransaction(id);
  selectedId.value = null;
}

function formatDate(date) {
  return dayjs(date).format("MM.DD");
}

function formatAmount(type, amount) {
  const sign = type === "income" ? "+" : "-";
  return `${sign}${amount.toLocaleString("ko-KR")}원`;
}
</script>

<style scoped>
.transaction-list {
  padding: 28px 32px;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  margin: 0;
  font-size: 16px;
}

.reset-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  padding: 0;
}

.empty-msg {
  font-size: 14px;
  text-align: center;
  padding: 24px 0;
}

.tx-table {
  width: 100%;
  border-collapse: collapse;
}

.tx-table th,
.tx-table td {
  padding: 12px 8px;
  font-size: 14px;
  text-align: left;
}

.tx-table th {
  font-size: 12px;
  border-bottom: 1px solid var(--black-3);
}

.tx-row {
  cursor: pointer;
  border-top: 1px solid var(--black-3);
}

.tx-row:hover {
  background-color: var(--black-4);
}

.arrow-icon {
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;
}

.arrow-icon.rotated {
  transform: rotate(180deg);
}

.action-row td,
.edit-row td {
  padding: 8px;
  background-color: var(--black-4);
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-btn {
  padding: 6px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 13px;
}

.edit-btn {
  background-color: var(--yellow-1);
}

.delete-btn {
  background-color: var(--red-2);
  color: var(--red-1);
}

.edit-form {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.edit-input {
  border: 1px solid var(--black-3);
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 13px;
  outline: none;
}

.edit-actions {
  display: flex;
  gap: 8px;
}

.category-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.category-icon {
  width: 18px;
  height: 18px;
}
</style>
