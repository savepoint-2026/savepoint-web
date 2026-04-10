<template>
  <div class="goal-chart box-default">
    <h2 class="section-title fw-bold text-black-1">목표 달성</h2>

    <div v-if="loading" class="empty-msg text-black-2">불러오는 중...</div>

    <div v-else-if="goals.length === 0" class="empty-msg text-black-2">
      등록된 목표가 없습니다.
    </div>

    <ul v-else class="goal-list">
      <li v-for="goal in goalsWithProgress" :key="goal.id" class="goal-item">
        <div class="goal-header">
          <span class="goal-name fw-medium text-black-1">{{ goal.itemName }}</span>
          <span class="goal-status fw-semibold" :class="goal.achieved ? 'text-green-1' : 'text-black-2'">
            {{ goal.achieved ? "달성" : `${formatAmount(netProfit)} / ${formatAmount(goal.targetAmount)}` }}
          </span>
        </div>

        <div class="bar-track">
          <div
            class="bar-fill"
            :class="goal.achieved ? 'bg-green-1' : 'bg-yellow-1'"
            :style="{ width: `${goal.progressRate}%` }"
          ></div>
        </div>

        <div v-if="goal.achieved" class="celebrate">
          <img :src="smileIcon" alt="달성 축하" class="celebrate-img" />
          <span class="fw-bold text-green-1">목표 달성!</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { useAuthStore } from "@/stores/useAuthStore";
import dayjs from "dayjs";
import smileIcon from "@/assets/icons/group/group-smile.png";

const authStore = useAuthStore();
const transactionStore = useTransactionStore();
const goals = ref([]);
const loading = ref(false);

onMounted(async () => {
  const now = dayjs();
  loading.value = true;
  try {
    const [goalsRes] = await Promise.all([
      axios.get("/api/goals", {
        params: { userId: authStore.currentUserId },
      }),
      transactionStore.fetchMonthlyTransactions(
        authStore.currentUserId,
        now.year(),
        now.month() + 1,
      ),
    ]);
    goals.value = goalsRes.data;
  } finally {
    loading.value = false;
  }
});

const netProfit = computed(() => {
  const income = transactionStore.transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const expense = transactionStore.transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);
  return income - expense;
});

const goalsWithProgress = computed(() =>
  goals.value.map((goal) => {
    const rate = Math.min((netProfit.value / goal.targetAmount) * 100, 100);
    return {
      ...goal,
      progressRate: Math.max(rate, 0),
      achieved: netProfit.value >= goal.targetAmount,
    };
  }),
);

function formatAmount(amount) {
  return `${amount.toLocaleString("ko-KR")}원`;
}
</script>

<style scoped>
.goal-chart {
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

.goal-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.goal-name {
  font-size: 14px;
}

.goal-status {
  font-size: 13px;
}

.bar-track {
  width: 100%;
  height: 10px;
  background-color: var(--black-3);
  border-radius: 999px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease;
}

.celebrate {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.celebrate-img {
  width: 20px;
  height: 20px;
}

.celebrate span {
  font-size: 13px;
}
</style>
