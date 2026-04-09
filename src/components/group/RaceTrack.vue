<template>
  <section class="race-track-wrap">
    <header class="race-header">
      <h2 class="fw-black text-black-1 header-title">👑 이달의 절약왕: {{}} 👑</h2>

      <div class="goal-box">
        <p class="fw-bold text-black-2 goal-label">그룹 코드 {{}}</p>
        <p class="fw-black text-red-1 goal-amount">{{}}</p>
      </div>
    </header>

    <article class="track-card box-default">
      <div class="track-top">
        <div class="brand-row">
          <div class="brand-dot bg-yellow-2 justify-align">↗</div>
          <span class="fw-black text-black-1 brand-text">$AVE POINT</span>
        </div>
      </div>

      <div class="lane-wrap">
        <div class="lane bg-black-3"></div>

        <!-- TODO : runner.position (runner-amount)/(max - min) 퍼센티지로 변경 -->
        <div
          v-for="runner in runners"
          :key="runner.id"
          class="runner"
          :style="{ left: `${runner.position}%` }"
        >
          <span class="fw-bold value-chip" :class="runner.danger ? 'chip-danger' : 'chip-normal'">
            {{ toWon(runner.amount) }}
          </span>
          <div class="avartar-wrap">
            <div class="avatar">{{ runner.avatar }}</div>
            <img class="status-icon" :src="runner.amount > limit ? SkullIcon : SmileIcon" alt="" />
          </div>
          <p class="fw-bold text-black-1 runner-name" :class="{ 'text-red-1': runner.danger }">
            {{ runner.name }}
          </p>
        </div>

        <div class="limit-line" :style="{ left: `${limitPosition}%` }"></div>
        <span class="fw-bold text-black-4 limit-pill" :style="{ left: `${limitPosition}%` }">
          LIMIT: 700k
        </span>
      </div>

      <div class="scale-row">
        <span class="fw-bold text-black-2">0 원</span>
        <span class="fw-bold text-black-2">{{ max }}</span>
      </div>

      <div class="legend bg-yellow-2">
        <div class="legend-item">
          <img :src="SmileIcon" width="15" height="15" alt="safe" />
          <span class="fw-medium text-black-1">안전 구역 (절약왕 후보)</span>
        </div>
        <div class="legend-item">
          <img :src="SkullIcon" width="15" height="15" alt="danger" />
          <span class="fw-medium text-black-1">파산 구역 (과소비 경고)</span>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup>
import SkullIcon from '@/assets/icons/group/group-skull.png'
import SmileIcon from '@/assets/icons/group/group-smile.png'

const limitPosition = 70
const limit = 700000

//TODO: runners 변경
const runners = [
  { id: 1, name: '이유주', amount: 300000, position: 30, avatar: '👩🏻', danger: false },
  { id: 2, name: '하성민', amount: 400000, position: 45, avatar: '🧑🏻', danger: false },
  { id: 3, name: '여강휘', amount: 500000, position: 58, avatar: '👩🏻', danger: false },
  { id: 4, name: '김민서', amount: 720000, position: 73, avatar: '🧑🏻', danger: true },
  { id: 5, name: '김지연', amount: 850000, position: 87, avatar: '👩🏻', danger: true },
]

const toWon = (value) => `${value.toLocaleString('ko-KR')} 원`
</script>

<style scoped>
.race-track-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.race-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.avatar-wrap {
  position: relative;
  width: fit-content;
}
.status-icon {
  position: absolute;
  right: 0px;
  bottom: 16px;
  width: 16px;
  height: 16px;
}

.header-title {
  margin: 0;
  font-size: 28px;
  line-height: 1.1;
}

.goal-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.goal-label {
  margin: 0;
  font-size: 13px;
}

.goal-amount {
  margin: 0;
  font-size: 28px;
  line-height: 1;
}

.track-card {
  padding: 26px 34px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.track-top {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
}

.brand-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.brand-dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-size: 14px;
  color: var(--yellow-1);
}

.brand-text {
  font-size: 24px;
}

.bubble-row {
  display: flex;
  gap: 8px;
}

.bubble {
  font-size: 11px;
  background-color: var(--black-1);
  border-radius: 999px;
  padding: 5px 10px;
}

.lane-wrap {
  position: relative;
  padding-top: 32px;
  padding-bottom: 34px;
}

.lane {
  width: 100%;
  height: 46px;
  border-radius: 999px;
}

.runner {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.value-chip {
  font-size: 10px;
  border-radius: 999px;
  padding: 4px 9px;
  line-height: 1;
}

.chip-normal {
  color: var(--black-4);
  background-color: var(--black-1);
}

.chip-danger {
  color: var(--black-4);
  background-color: var(--red-1);
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background-color: var(--black-3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.runner-name {
  margin: 0;
  font-size: 12px;
}

.limit-line {
  position: absolute;
  top: 20px;
  bottom: 18px;
  width: 3px;
  background-color: var(--red-1);
  border-radius: 999px;
  transform: translateX(-50%);
}

.limit-pill {
  position: absolute;
  bottom: 0;
  transform: translateX(-50%);
  background-color: var(--red-1);
  color: var(--black-4);
  border-radius: 999px;
  padding: 4px 9px;
  font-size: 10px;
}

.scale-row {
  display: flex;
  justify-content: space-between;
}

.scale-row span {
  font-size: 12px;
}

.legend {
  border-radius: 20px;
  height: 62px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 60px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-item span {
  font-size: 13px;
}

/* @media (max-width: 1440px) {
  .header-title {
    font-size: 28px;
  }

  .goal-amount {
    font-size: 32px;
  }

  .brand-text {
    font-size: 26px;
  }
} */

@media (max-width: 1080px) {
  .race-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .goal-box {
    align-items: flex-start;
  }

  .track-top {
    flex-direction: column;
    align-items: flex-start;
  }

  .legend {
    flex-direction: column;
    height: auto;
    padding: 14px;
    gap: 8px;
    align-items: flex-start;
  }
}
</style>
