<template>
  <button class="justify-align" :class="id ? 'delete bg-red-2' : 'logout bg-black-3'">
    <img :src="id ? Delete : Logout" width="20" height="20" />
    <span class="text-black-1 fw-bold"">{{
      id ? '탈퇴' : '로그아웃'
    }}</span>
  </button>
</template>

<script setup>
import Logout from '@/assets/icons/group/group-mypage-out.png'
import Delete from '@/assets/icons/mypage/mypage-delete.png'

const { id } = defineProps({
  id: Number,
})
</script>

<style scoped>
button {
  width: 136px;
  height: 56px;
  border-radius: 18px;
  border: 0;

  display: flex;
  gap: 8px;
}

.logout:hover {
  background-color: var(--black-2);
}

.delete:hover {
  background-color: var(--red-1);
}

span {
  font-size: 14px;
}
</style>
