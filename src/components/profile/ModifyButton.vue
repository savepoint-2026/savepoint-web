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

import { useUserStore } from '@/stores/useUserStore'

const userStore = useUserStore()

const { id } = defineProps({
  id: Number,
})

const onModifyClick = () => {
  if (userStore.isModifying) {
    console.log('modifying')
  } else {
    userStore.changeModifyMode(true)
  }
}

const onCancelClick = () => {
  userStore.changeModifyMode(false)
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
