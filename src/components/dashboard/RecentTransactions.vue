<template>
  <div class="recent-transactions box-default">
    <div class="header">
      <div class="header-left">
        <img :src="iconHistory" class="header-icon" alt="최근 거래" />
        <h2 class="section-title fw-bold text-black-1">최근 거래 내역</h2>
      </div>
      <router-link to="/transactions" class="more-link fw-medium text-black-2">
        더보기 &gt;
      </router-link>
    </div>

    <div v-if="transactionStore.loading" class="skeleton-wrap">
      <div v-for="n in 5" :key="n" class="skeleton-row">
        <div class="skeleton skeleton-icon" />
        <div class="skeleton-info">
          <div class="skeleton skeleton-memo" />
          <div class="skeleton skeleton-date" />
        </div>
        <div class="skeleton skeleton-amount" />
      </div>
    </div>

    <div v-else-if="recentTransactions.length === 0" class="empty-msg text-black-2">
      이번 달 거래 내역이 없습니다.
    </div>

    <ul v-else class="tx-list">
      <li v-for="tx in recentTransactions" :key="tx.id" class="tx-item">
        <div class="tx-icon-wrap">
          <img
            v-if="getCategoryInfo(tx.categoryId).icon"
            :src="getCategoryInfo(tx.categoryId).icon"
            :alt="getCategoryInfo(tx.categoryId).name"
            class="category-icon"
          />
        </div>
        <div class="tx-info">
          <span class="tx-memo fw-semibold text-black-1">{{ tx.memo ?? "-" }}</span>
          <span class="tx-date fw-regular text-black-2">{{ formatDate(tx.date) }}</span>
        </div>
        <span class="tx-amount fw-bold" :class="tx.type === 'income' ? 'text-income' : 'text-expense'">
          {{ formatAmount(tx.type, tx.amount) }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { getCategoryInfo } from "@/constants/categories";
import dayjs from "dayjs";
import iconHistory from "@/assets/icons/category/category-history.png";

const RECENT_COUNT = 5;

const authStore = useAuthStore();
const transactionStore = useTransactionStore();

onMounted(async () => {
  const now = dayjs();
  await transactionStore.fetchMonthlyTransactions(
    authStore.currentUserId,
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
  return dayjs(date).format("YYYY. MM. DD");
}

function formatAmount(type, amount) {
  const sign = type === "income" ? "+" : "-";
  return `${sign}${amount.toLocaleString("ko-KR")}`;
}
</script>

<style scoped>
.recent-transactions {
  padding: 28px 32px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  width: 18px;
  height: 18px;
  opacity: 0.5;
}

.section-title {
  margin: 0;
  font-size: 16px;
}

.more-link {
  font-size: 13px;
  text-decoration: none;
}

.more-link:hover {
  color: var(--black-1);
}

/* skeleton */
.skeleton-wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skeleton-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.skeleton-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skeleton {
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    var(--black-3) 25%,
    var(--black-4) 50%,
    var(--black-3) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-memo {
  width: 60%;
  height: 14px;
}

.skeleton-date {
  width: 40%;
  height: 12px;
}

.skeleton-amount {
  width: 60px;
  height: 14px;
  flex-shrink: 0;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* empty */
.empty-msg {
  font-size: 14px;
  text-align: center;
  padding: 24px 0;
}

/* tx list */
.tx-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tx-item {
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
}

.tx-item:hover .tx-memo {
  opacity: 0.7;
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
  opacity: 0.6;
}

.tx-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
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

.text-income {
  color: #1a7a6e;
}

.text-expense {
  color: var(--red-1);
}
</style>
