<template>
  <section class="manager-wrap">
    <div class="stage">
      <div class="entry-card box-default">
        <div class="title-box">
          <p class="title fw-black text-black-1">소비 레이스</p>
          <p class="subtitle fw-medium text-black-2">친구들과 함께 돈을 절약해 봐요!</p>
        </div>

        <div class="btn-group">
          <button class="orange-btn" type="button" @click="openPanel('join')">그룹 참여</button>
          <button class="orange-btn" type="button" @click="openPanel('create')">그룹 생성</button>
        </div>
      </div>

      <transition name="fade-up">
        <div v-if="activePanel" class="overlay" @click.self="closePanel">
          <article class="form-card box-default popup">
            <div class="card-head">
              <div>
                <p class="card-title fw-black text-black-1">
                  {{ activePanel === 'join' ? '그룹 참여' : '그룹 생성' }}
                </p>
                <p class="card-subtitle fw-medium text-black-2">
                  {{
                    activePanel === 'join'
                      ? '초대코드를 입력해 주세요.'
                      : '그룹 이름과 그룹 한도를 설정해 주세요'
                  }}
                </p>
              </div>
              <button class="close-btn" type="button" @click="closePanel">
                <img :src="CloseIcon" alt="닫기" width="14" height="14" />
              </button>
            </div>

            <div v-if="activePanel === 'join'" class="form-body">
              <input
                v-model.trim="joinCode"
                class="bg-black-3 text-black-1 fw-medium input-field"
                type="text"
                maxlength="6"
                placeholder=""
              />

              <button class="orange-btn action-btn" type="button" @click="onClickJoin">
                <img :src="CheckIcon" alt="" width="16" height="16" />
                <span class="fw-black">참여</span>
              </button>
            </div>

            <div v-else class="form-body">
              <div class="labeled-row">
                <span class="fw-black text-black-1 label">이름</span>
                <input
                  v-model.trim="groupName"
                  class="bg-black-3 text-black-1 fw-medium input-field"
                />
              </div>

              <div class="labeled-row">
                <span class="fw-black text-black-1 label">한도</span>
                <input
                  v-model.number="targetAmount"
                  class="bg-black-3 text-black-1 fw-medium input-field"
                  type="number"
                  min="10000"
                />
              </div>

              <button class="orange-btn action-btn" type="button" @click="onClickCreate">
                <img :src="CheckIcon" alt="" width="16" height="16" />
                <span class="fw-black">생성</span>
              </button>
            </div>
          </article>
        </div>
      </transition>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import CheckIcon from '@/assets/icons/check.png'
import CloseIcon from '@/assets/icons/x-black.png'
import { useUserStore } from '@/stores/useUserStore'
import { useGroupStore } from '@/stores/useGroupStore'
import { useAuthStore } from '@/stores/useAuthStore'

const groupStore = useGroupStore()
const userStore = useUserStore()
const AuthStore = useAuthStore()

const activePanel = ref('')
const joinCode = ref('')
const groupName = ref('')
const targetAmount = ref('')

onMounted(async () => {
  userStore.loadUserData(userStore.currentUserId)
})

const userId = AuthStore.currentUserId

const openPanel = (panelType) => {
  activePanel.value = panelType
}

const closePanel = () => {
  activePanel.value = ''
}

const onClickJoin = async () => {
  if (!joinCode.value || typeof groupStore.joinGroup !== 'function') return
  await groupStore.joinGroup(userId, joinCode.value)
  const groupId = groupStore.currentGroup.id
  await userStore.updateGroupId(userId, groupId)
  await groupStore.loadGroup(groupId)
  closePanel()
}

const onClickCreate = async () => {
  if (!groupName.value || typeof groupStore.addGroup !== 'function') return
  await groupStore.addGroup(userId, groupName.value, targetAmount.value)
  const groupId = groupStore.currentGroup.id
  await userStore.updateGroupId(userId, groupId)
  await groupStore.loadGroup(groupId)
  closePanel()
}
</script>

<style scoped>
.manager-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
  box-sizing: border-box;
}

.stage {
  width: 100%;
  max-width: 980px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.entry-card {
  width: 100%;
  max-width: 430px;
  min-height: 300px;
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 52px;
}

.title-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title {
  font-size: 28px;
  line-height: 1.15;
}

.subtitle {
  font-size: 16px;
}

.btn-group {
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 100%;
  align-items: center;
  justify-content: flex-end;
  margin-top: auto;
}

.btn-group .orange-btn {
  min-width: 148px;
}

.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 320px;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(23, 25, 28, 0.18);
  padding: 24px;
  box-sizing: border-box;
}

.popup {
  transform: translateY(-8px);
  width: 100%;
}

.form-card {
  width: calc(100% - 48px);
  max-width: 460px;
  padding: 28px 28px 32px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.card-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.card-title {
  font-size: 28px;
  line-height: 1.1;
  margin-bottom: 8px;
}

.card-subtitle {
  font-size: 15px;
}

.close-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.input-field {
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 22px;
  padding: 0 18px;
  box-sizing: border-box;
  font-size: 15px;
}

.input-field:focus {
  border: 1px solid var(--black-2);
}

.action-btn {
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-width: 148px;
}

.labeled-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.label {
  width: 34px;
  font-size: 16px;
  flex-shrink: 0;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
}

.fade-up-enter-from .popup,
.fade-up-leave-to .popup {
  transform: translateY(8px);
}

@media (max-width: 720px) {
  .manager-wrap {
    align-items: stretch;
    padding: 12px 0 16px;
  }

  .stage {
    align-items: stretch;
  }

  .entry-card {
    max-width: none;
    min-height: 260px;
    padding: 32px 24px;
    gap: 36px;
  }

  .card-title {
    font-size: 24px;
  }

  .form-card {
    width: calc(100% - 24px);
    padding: 24px 20px 26px;
  }

  .btn-group {
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    margin-top: 28px;
  }

  .btn-group .orange-btn,
  .action-btn {
    width: 100%;
    min-width: 0;
  }

  .overlay {
    left: 0;
    padding: 16px;
    align-items: flex-end;
    background-color: rgba(23, 25, 28, 0.28);
  }

  .popup {
    transform: translateY(0);
  }

  .form-card {
    max-width: none;
    border-radius: 28px 28px 22px 22px;
  }

  .card-head {
    align-items: flex-start;
  }

  .card-subtitle {
    font-size: 14px;
    line-height: 1.45;
  }

  .input-field {
    height: 52px;
    border-radius: 18px;
    font-size: 16px;
  }

  .labeled-row {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .label {
    width: auto;
    font-size: 14px;
  }
}

@media (max-width: 420px) {
  .manager-wrap {
    padding-top: 8px;
  }

  .entry-card {
    min-height: 240px;
    padding: 28px 18px;
    gap: 28px;
  }

  .title {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
    line-height: 1.5;
  }

  .overlay {
    padding: 10px;
  }

  .form-card {
    width: 100%;
    padding: 20px 16px 22px;
    gap: 18px;
  }

  .close-btn {
    width: 24px;
    height: 24px;
  }
}
</style>
