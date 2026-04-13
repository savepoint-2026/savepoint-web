<template>
  <section class="ranking-wrap box-default">
    <div v-for="(row, idx) in safeRows" :key="row.id" class="rank-row">
      <div class="left">
        <span class="rank fw-black text-black-2">{{ idx === 0 ? '🏆' : row.rank }}</span>
        <div class="avatar">{{ row.profileImg }}</div>
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
        <div class="avatar">{{ row.profileImg }}</div>
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
import { useGroupStore } from '@/stores/useGroupStore'
import { computed } from 'vue'

const groupStore = useGroupStore()

const rankedRunners = computed(() => {
  return [...groupStore.runners]
    .sort((a, b) => a.amount - b.amount)
    .map((runner, index) => ({
      ...runner,
      rank: index + 1,
    }))
})

const safeRows = computed(() => {
  return rankedRunners.value.filter((runner) => runner.danger === false)
})

const dangerRows = computed(() => {
  return rankedRunners.value.filter((runner) => runner.danger === true)
})
const toWon = (value) => `${value.toLocaleString('ko-KR')} 원`
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
  width: 22px;
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
  font-size: 24px;
  line-height: 1;
}

.desc {
  margin: 0;
  font-size: 13px;
  line-height: 1;
}

.amount {
  margin: 0;
  font-size: 24px;
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
    font-size: 22px;
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
    font-size: 18px;
  }
}
</style>
