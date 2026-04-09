<template>
  <button
    class="justify-align"
    :class="id ? 'modify' : 'cancel'"
    @click="id ? onModifyClick() : onCancelClick()"
  >
    <img :src="id ? Modify : Cancel" width="18" height="18" />
    <span class="fw-bold" :class="id ? 'text-blue-1' : 'text-black-2'">{{
      id ? '수정하기' : '취소하기'
    }}</span>
  </button>
</template>

<script setup>
import Cancel from '@/assets/icons/mypage/mypage-cancel.png'
import Modify from '@/assets/icons/mypage/mypage-modify.png'

import { useAuthStore } from '@/stores/useAuthStore'
import { useUserStore } from '@/stores/useUserStore'
import axios from 'axios'

const authStore = useAuthStore()
const userStore = useUserStore()

const { id } = defineProps({
  id: Number,
})

const onModifyClick = () => {
  if (userStore.isModifying) {
    const result = {}

    for (const key in userStore.userModifyData) {
      if (userStore.userData[key] !== userStore.userModifyData[key]) {
        result[key] = userStore.userModifyData[key]
      }
    }

    const userURI = `/api/users/${authStore.currentUserId}`
    const goalURI = `/api/goals/${userStore.goalData.id}`

    axios
      .patch(userURI, result)
      .then(() => {
        axios
          .patch(goalURI, userStore.goalModifyData)
          .then(() => {
            userStore.changeModifyMode(false)
            userStore.loadUserData(authStore.currentUserId)
          })
          .catch((e) => console.error(e))
      })
      .catch((e) => console.error(e))
  } else {
    userStore.changeModifyMode(true)
  }
}

const onCancelClick = () => {
  if (
    userStore.userData != userStore.userModifyData ||
    userStore.goalData != userStore.goalModifyData
  ) {
    if (confirm('수정 사항이 있습니다. 취소하시겠습니까?')) {
      userStore.initModifyData()
      userStore.changeModifyMode(false)
    }
  } else userStore.changeModifyMode(false)
}
</script>

<style scoped>
button {
  width: 120px;
  height: 44px;
  border-radius: 18px;
  background-color: white;

  display: flex;
  gap: 8px;
}

.cancel {
  border: 1px solid var(--black-2);
}

.cancel:hover {
  background-color: var(--black-3);
}

.modify {
  border: 1px solid var(--blue-1);
}

.modify:hover {
  background-color: #dde9ff;
}

span {
  font-size: 14px;
}
</style>
