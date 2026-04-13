<template>
  <section class="race-track-wrap">
    <header class="race-header">
      <h2 class="fw-black text-black-1 header-title">
        👑 이달의 거지왕: {{ groupStore.maxRunner.name }} 👑
      </h2>

      <div class="goal-box">
        <p class="fw-bold text-black-2 goal-label">그룹 코드 : {{ groupStore.currentGroup.id }}</p>
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
        <div class="lane bg-black-3">
          <div class="lane-start-flag" aria-hidden="true"></div>
          <div
            class="lane-limit"
            :class="{ 'lane-limit-overflow': isLimitOverflow }"
            :style="{ left: `${limitDisplayPosition}%` }"
          >
            <span class="fw-bold lane-limit-label">
              LIMIT: {{ toWon(groupStore.currentGroup.targetAmount) }}
            </span>
          </div>
        </div>
        <div
          v-for="group in groupedRunners"
          :key="group.key"
          class="runner"
          :style="{ left: `${group.position}%` }"
        >
          <template v-if="group.count === 1">
            <span
              class="fw-bold value-chip"
              :class="group.runner.danger ? 'chip-danger' : 'chip-normal'"
            >
              {{ toWon(group.runner.amount) }}
            </span>
            <div class="profileImg-wrap">
              <div
                class="profileImg"
                :style="{ backgroundColor: getRunnerTone(group.runner.amount) }"
              >
                {{ group.runner.profileImg }}
              </div>
            </div>
            <p
              class="fw-bold runner-name"
              :style="{ color: group.runner.danger ? 'var(--red-1)' : 'var(--black-1)' }"
            >
              {{ group.runner.name }}
            </p>
            <div class="status-icon-wrap">
              <img
                class="status-icon"
                :src="
                  group.runner.amount > groupStore.currentGroup.targetAmount ? SkullIcon : SmileIcon
                "
                alt=""
              />
            </div>
          </template>

          <template v-else>
            <div class="cluster-chip-row">
              <span
                v-for="member in group.runners"
                :key="`${member.userId}-chip`"
                class="fw-bold value-chip"
                :class="member.danger ? 'chip-danger' : 'chip-normal'"
              >
                {{ toWon(member.amount) }}
              </span>
            </div>

            <div class="cluster-stack">
              <div
                v-for="(member, idx) in group.runners.slice(0, 3)"
                :key="`${member.userId}-bubble`"
                class="cluster-orb"
                :style="getClusterOrbStyle(member.amount, idx, group.count)"
              >
                <div
                  class="cluster-orb-inner"
                  :style="{ backgroundColor: getRunnerTone(member.amount) }"
                >
                  {{ member.profileImg }}
                </div>
              </div>
            </div>

            <div class="cluster-names">
              <span
                v-for="member in group.runners"
                :key="`${member.userId}-name`"
                class="fw-bold cluster-name"
                :style="{ color: member.danger ? 'var(--red-1)' : 'var(--black-1)' }"
              >
                {{ member.name }}
              </span>
            </div>
          </template>
        </div>

        <span
          class="fw-bold text-black-4 limit-pill"
          :class="{ 'limit-pill-overflow': isLimitOverflow }"
          :style="{ left: `${limitDisplayPosition}%` }"
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
          <span class="fw-medium text-black-1">안전 뱃지 (거지왕 후보)</span>
        </div>
        <div class="legend-item">
          <img :src="SkullIcon" width="15" height="15" alt="danger" />
          <span class="fw-medium text-black-1">파산 뱃지 (과소비 경고)</span>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import SkullIcon from '@/assets/icons/group/group-skull.png'
import SmileIcon from '@/assets/icons/group/group-smile.png'
import { useAuthStore } from '@/stores/useAuthStore'
import { useGroupStore } from '@/stores/useGroupStore'
import { useUserStore } from '@/stores/useUserStore'

const authStore = useAuthStore()
const groupStore = useGroupStore()
const userStore = useUserStore()
const overlapThreshold = 8

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

const getRunnerTone = (amount) => {
  const min = groupStore.displayMin
  const limit = groupStore.currentGroup.targetAmount

  if (amount >= limit) return 'var(--orange-1)'

  const ratio = limit === min ? 0 : (amount - min) / (limit - min)
  if (ratio >= 0.75) return 'var(--yellow-1)'
  if (ratio >= 0.5) return 'var(--yellow-2)'
  return 'var(--green-2)'
}

const getClusterOrbStyle = (amount, index, count) => {
  const limitedCount = Math.min(count, 3)
  const offsets = limitedCount === 2 ? [-18, 18] : limitedCount === 3 ? [-24, 0, 24] : [0]

  return {
    backgroundColor: getRunnerTone(amount),
    transform: `translateX(${offsets[index] ?? 0}px)`,
    zIndex: index + 1,
  }
}

const isLimitOverflow = computed(
  () => groupStore.currentGroup.targetAmount > groupStore.displayMax && groupStore.displayMax > 0,
)

const limitDisplayPosition = computed(() => (isLimitOverflow.value ? 90 : groupStore.limitPosition))

const groupedRunners = computed(() => {
  const sortedRunners = [...groupStore.runners].sort((a, b) => a.position - b.position)
  const groups = []
  let currentGroup = []

  for (const runner of sortedRunners) {
    if (currentGroup.length === 0) {
      currentGroup.push(runner)
      continue
    }

    const lastRunner = currentGroup[currentGroup.length - 1]
    if (Math.abs(runner.position - lastRunner.position) < overlapThreshold) {
      currentGroup.push(runner)
    } else {
      groups.push(currentGroup)
      currentGroup = [runner]
    }
  }

  if (currentGroup.length) {
    groups.push(currentGroup)
  }

  return groups.map((group) => ({
    key: group.map((runner) => runner.userId).join('-'),
    count: group.length,
    position: group.reduce((sum, runner) => sum + runner.position, 0) / group.length,
    runners: group,
    runner: group[0],
  }))
})
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
  width: 16px;
  height: 16px;
}

.status-icon-wrap {
  position: absolute;
  width: 24px;
  height: 24px;
  bottom: 18px;
  left: 45px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
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
  position: relative;
  width: 100%;
  height: 46px;
  border-radius: 999px;
  overflow: hidden;
}

.lane-start-flag {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 22px;
  border-radius: 999px 0 0 999px;
  background-image:
    linear-gradient(
      45deg,
      var(--black-1) 25%,
      transparent 25%,
      transparent 75%,
      var(--black-1) 75%,
      var(--black-1)
    ),
    linear-gradient(
      45deg,
      var(--black-1) 25%,
      transparent 25%,
      transparent 75%,
      var(--black-1) 75%,
      var(--black-1)
    );
  background-position:
    0 0,
    6px 6px;
  background-size: 12px 12px;
  background-color: var(--black-4);
  opacity: 0.95;
  z-index: 1;
}

.runner {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.lane-limit {
  position: absolute;
  top: 4px;
  bottom: 4px;
  transform: translateX(-50%);
  border-left: 3px dashed var(--red-1);
  z-index: 1;
  pointer-events: none;
}

.lane-limit.lane-limit-overflow {
  display: none;
}

.lane-limit-label {
  position: absolute;
  left: 50%;
  bottom: -28px;
  transform: translateX(-50%);
  color: var(--red-1);
  font-size: 10px;
  line-height: 1;
  white-space: nowrap;
}

.limit-pill {
  position: absolute;
  bottom: -34px;
  transform: translateX(-50%);
  background-color: var(--red-1);
  color: var(--black-4);
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 10px;
  white-space: nowrap;
  z-index: 3;
}

.limit-pill::before {
  content: '';
  position: absolute;
  left: 50%;
  top: -9px;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  border-bottom: 9px solid var(--red-1);
}

.limit-pill.limit-pill-overflow::before {
  left: auto;
  right: -16px;
  top: 50%;
  transform: translateY(-50%);
  border-left: 13px solid var(--red-1);
  border-right: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
}

.cluster-chip-row {
  display: flex;
  justify-content: center;
  gap: 4px;
  flex-wrap: nowrap;
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
  width: 60px;
  height: 60px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.runner-name {
  margin: 0;
  font-size: 12px;
}

.cluster-stack {
  position: relative;
  width: 92px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cluster-orb {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px rgba(23, 25, 28, 0.08);
}

.cluster-orb-inner {
  width: 38px;
  height: 38px;
  background-color: white;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.cluster-names {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  max-width: 110px;
  text-align: center;
  line-height: 1.25;
}

.cluster-name {
  font-size: 12px;
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
