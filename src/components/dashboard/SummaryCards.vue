<template>
  <div class="summary-cards">
    <div class="card box-default" v-for="card in cards" :key="card.label">
      <div class="card-icon justify-align" :class="card.bgClass">
        <img :src="card.icon" :alt="card.label" />
      </div>
      <div class="card-content">
        <p class="card-label fw-medium text-black-2">{{ card.label }}</p>
        <p class="card-amount fw-bold text-black-1">{{ formatAmount(card.value) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useTransactionStore } from "@/stores/useTransactionStore";
import dayjs from "dayjs";
import mainIncome from "@/assets/icons/main-page/main-income.png";
import mainExpense from "@/assets/icons/main-page/main-expense.png";
import mainProfit from "@/assets/icons/main-page/main-profit.png";

// TODO: useUserStore 연결 후 실제 userId로 교체
const DUMMY_USER_ID = "u1";

const transactionStore = useTransactionStore();

onMounted(async () => {
  const now = dayjs();
  await transactionStore.fetchMonthlyTransactions(
    DUMMY_USER_ID,
    now.year(),
    now.month() + 1,
  );
});

const totalIncome = computed(() =>
  transactionStore.transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0),
);

const totalExpense = computed(() =>
  transactionStore.transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0),
);

const netProfit = computed(() => totalIncome.value - totalExpense.value);

const cards = computed(() => [
  {
    label: "총 수입",
    value: totalIncome.value,
    bgClass: "bg-green-2",
    icon: mainIncome,
  },
  {
    label: "총 지출",
    value: totalExpense.value,
    bgClass: "bg-red-2",
    icon: mainExpense,
  },
  {
    label: "순수익",
    value: netProfit.value,
    bgClass: "bg-blue-1",
    icon: mainProfit,
  },
]);

function formatAmount(amount) {
  const sign = amount < 0 ? "-" : "";
  return `${sign}${Math.abs(amount).toLocaleString("ko-KR")}원`;
}
</script>

<style scoped>
.summary-cards {
  display: flex;
  gap: 20px;
}

.card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 28px;
}

.card-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  flex-shrink: 0;
}

.card-icon img {
  width: 24px;
  height: 24px;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-label {
  margin: 0;
  font-size: 13px;
}

.card-amount {
  margin: 0;
  font-size: 20px;
}
</style>
