<template>
  <section class="race-track-wrap">
    <header class="race-header">
      <h2 class="fw-black text-black-1 header-title">
        👑 이달의 거지왕: {{ groupStore.maxRunner.name }} 👑
      </h2>

      <div class="goal-box">
        <p class="fw-bold text-black-2 goal-label">그룹 코드 {{ groupStore.currentGroup.id }}</p>
        <p class="fw-black text-red-1 goal-amount">
          {{ toWon(groupStore.currentGroup.targetAmount) }}
        </p>
      </div>
    </header>

    <article class="track-card box-default">
      <div class="track-top">
        <div class="brand-row">
          <div class="brand-dot bg-yellow-2 justify-align">↗</div>
          <span class="fw-black text-black-1 brand-text">{{ groupStore.currentGroup.name }}</span>
        </div>
        <button class="leave-btn fw-bold" type="button" @click="onClickLeaveGroup">
          그룹 나가기
        </button>
      </div>

      <div class="lane-wrap">
        <div class="lane bg-black-3"></div>
        <div
          v-for="runner in groupStore.runners"
          :key="runner.userId"
          class="runner"
          :style="{ left: `${runner.position}%` }"
        >
          <span class="fw-bold value-chip" :class="runner.danger ? 'chip-danger' : 'chip-normal'">
            {{ toWon(runner.amount) }}
          </span>
          <div class="profileImg-wrap">
            <div class="profileImg">{{ runner.profileImg }}</div>
            <img
              class="status-icon"
              :src="runner.amount > groupStore.currentGroup.targetAmount ? SkullIcon : SmileIcon"
              alt=""
            />
          </div>
          <p class="fw-bold text-black-1 runner-name" :class="{ 'text-red-1': runner.danger }">
            {{ runner.name }}
          </p>
        </div>

        <div class="limit-line" :style="{ left: `${groupStore.limitPosition}%` }"></div>
        <span
          class="fw-bold text-black-4 limit-pill"
          :style="{ left: `${groupStore.limitPosition}%` }"
        >
          LIMIT: {{ toWon(groupStore.currentGroup.targetAmount) }}
        </span>
      </div>

      <div class="scale-row">
        <span class="fw-bold text-black-2">{{ toWon(groupStore.displayMin) }}</span>
        <span class="fw-bold text-black-2">{{ toWon(groupStore.displayMax) }}</span>
      </div>

      <div class="legend bg-yellow-2">
        <div class="legend-item">
          <img :src="SmileIcon" width="15" height="15" alt="safe" />
          <span class="fw-medium text-black-1">안전 구역 (거지왕 후보)</span>
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
import { useAuthStore } from '@/stores/useAuthStore'
import { useGroupStore } from '@/stores/useGroupStore'
import { useUserStore } from '@/stores/useUserStore'

const authStore = useAuthStore()
const groupStore = useGroupStore()
const userStore = useUserStore()

// 금액을 원 단위로 포맷팅하는 method
const toWon = (value) => `${value.toLocaleString('ko-KR')} 원`

const onClickLeaveGroup = async () => {
  const userId = authStore.currentUserId
  const groupId = groupStore.currentGroup.id

  if (!userId || !groupId) return

  const isConfirmed = window.confirm('정말 그룹에서 나가시겠어요?')
  if (!isConfirmed) return

  await groupStore.leaveGroup(userId, groupId)
  await userStore.updateGroupId(userId, '')
}
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

.profileImg-wrap {
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

.leave-btn {
  border: 1px solid var(--black-2);
  background-color: transparent;
  color: var(--black-2);
  border-radius: 999px;
  padding: 10px 16px;
  font-size: 13px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.leave-btn:hover {
  background-color: var(--red-1);
  border-color: var(--red-1);
  color: var(--black-4);
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

.profileImg {
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
    align-items: center;
  }
}

@media (max-width: 768px) {
  .legend {
    align-items: flex-start;
    flex-direction: row;
    gap: 6px;
  }
}
</style>
