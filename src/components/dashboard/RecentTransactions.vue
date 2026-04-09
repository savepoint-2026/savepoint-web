<template>
  <div class="recent-transactions box-default">
    <h2 class="section-title fw-bold text-black-1">최근 거래 내역</h2>

    <div v-if="transactionStore.loading" class="empty-msg text-black-2">
      불러오는 중...
    </div>

    <div v-else-if="recentTransactions.length === 0" class="empty-msg text-black-2">
      이번 달 거래 내역이 없습니다.
    </div>

    <table v-else class="tx-table">
      <thead>
        <tr>
          <th class="fw-semibold text-black-2">날짜</th>
          <th class="fw-semibold text-black-2">카테고리</th>
          <th class="fw-semibold text-black-2">금액</th>
          <th class="fw-semibold text-black-2">메모</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tx in recentTransactions" :key="tx.id">
          <td class="fw-regular text-black-2">{{ formatDate(tx.date) }}</td>
          <!-- TODO: categoryId → 카테고리명 변환 (카테고리 store/API 연동 후 교체) -->
          <td class="fw-regular text-black-2">{{ tx.categoryId }}</td>
          <td class="fw-semibold" :class="tx.type === 'income' ? 'text-green-1' : 'text-red-1'">
            {{ formatAmount(tx.type, tx.amount) }}
          </td>
          <td class="fw-regular text-black-2">{{ tx.memo ?? "-" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useTransactionStore } from "@/stores/useTransactionStore";
import dayjs from "dayjs";

// TODO: useUserStore 연결 후 실제 userId로 교체
const DUMMY_USER_ID = 1;
const RECENT_COUNT = 5;

const transactionStore = useTransactionStore();

onMounted(async () => {
  const now = dayjs();
  await transactionStore.fetchMonthlyTransactions(
    DUMMY_USER_ID,
    now.year(),
    now.month() + 1,
  );
});

const recentTransactions = computed(() => {
  return [...transactionStore.transactions]
    .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
    .slice(0, RECENT_COUNT);
});

function formatDate(date) {
  return dayjs(date).format("MM.DD");
}

function formatAmount(type, amount) {
  const sign = type === "income" ? "+" : "-";
  return `${sign}${amount.toLocaleString("ko-KR")}원`;
}
</script>

<style scoped>
.recent-transactions {
  padding: 28px 32px;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 16px;
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

.tx-table tbody tr + tr {
  border-top: 1px solid var(--black-3);
}
</style>
