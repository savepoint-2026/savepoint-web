<template>
  <section class="ranking-wrap box-default">
    <div v-for="(row, idx) in safeRows" :key="row.id" class="rank-row">
      <div class="left">
        <span class="rank fw-black text-black-2">{{ idx === 0 ? '🏆' : row.rank }}</span>
        <div class="avatar">{{ row.avatar }}</div>
        <div class="user">
          <p class="name fw-bold text-black-1">{{ row.name }}</p>
          <p class="desc fw-medium text-black-2">현재 지출액</p>
        </div>
      </div>
      <p class="amount fw-black text-black-1">- {{ toWon(row.amount) }}</p>
    </div>

    <div class="bankrupt-line">
      <span class="bankrupt-badge fw-black">ⓘ 파산의 벽</span>
    </div>

    <div v-for="row in dangerRows" :key="row.id" class="rank-row">
      <div class="left">
        <span class="rank fw-black text-orange-1">{{ row.rank }}</span>
        <div class="avatar">{{ row.avatar }}</div>
        <div class="user">
          <p class="name fw-bold text-black-2">{{ row.name }}</p>
          <p class="desc fw-medium text-black-2">현재 지출액</p>
        </div>
      </div>
      <p class="amount fw-black text-red-1">- {{ toWon(row.amount) }}</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const bankruptLimit = 700000

const runners = [
  { id: 1, rank: 1, name: '이유주', amount: 300000, avatar: '👩🏻' },
  { id: 2, rank: 2, name: '하성민', amount: 400000, avatar: '🧑🏻' },
  { id: 3, rank: 3, name: '여강휘', amount: 500000, avatar: '👩🏻' },
  { id: 4, rank: 4, name: '김민서', amount: 720000, avatar: '🧑🏻' },
  { id: 5, rank: 5, name: '김지연', amount: 850000, avatar: '👩🏻' },
]

const safeRows = computed(() => runners.filter((runner) => runner.amount <= bankruptLimit))
const dangerRows = computed(() => runners.filter((runner) => runner.amount > bankruptLimit))
const toWon = (value) => `${value.toLocaleString('ko-KR')} ₩`
</script>

<style scoped>
.ranking-wrap {
  width: 100%;
  padding: 28px 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rank-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 62px;
}

.left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.rank {
  width: 30px;
  text-align: center;
  font-size: 22px;
  line-height: 1;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background-color: var(--black-3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 23px;
  flex-shrink: 0;
}

.user {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.name {
  margin: 0;
  font-size: 28px;
  line-height: 1;
}

.desc {
  margin: 0;
  font-size: 13px;
  line-height: 1;
}

.amount {
  margin: 0;
  font-size: 35px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.bankrupt-line {
  position: relative;
  margin: 4px 0 6px;
  height: 40px;
}

.bankrupt-line::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  border-top: 3px dashed var(--red-2);
}

.bankrupt-badge {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 38px;
  border-radius: 999px;
  background-color: var(--red-1);
  color: var(--black-4);
  padding: 0 22px;
  display: flex;
  align-items: center;
  font-size: 17px;
}

@media (max-width: 1440px) {
  .name {
    font-size: 22px;
  }

  .amount {
    font-size: 29px;
  }
}

@media (max-width: 1080px) {
  .ranking-wrap {
    padding: 20px 18px;
  }

  .rank-row {
    min-height: 52px;
  }

  .name {
    font-size: 18px;
  }

  .amount {
    font-size: 22px;
  }
}
</style>
