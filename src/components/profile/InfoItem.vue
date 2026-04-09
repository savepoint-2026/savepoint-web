<template>
  <div class="info-item">
    <div class="label-box">
      <img :src="icons[id]" width="18" height="18" />
      <span class="text-black-2 fw-bold">{{ labels[id] }}</span>
    </div>
    <p class="text-black-1 fw-black">{{ contents[id] }} {{ id === 2 ? '&#8361' : '' }}</p>
    <hr class="bg-black-3" />
  </div>
</template>

<script setup>
import User from '@/assets/icons/mypage/mypage-user.png'
import Mail from '@/assets/icons/mypage/mypage-mail.png'
import Limit from '@/assets/icons/mypage/mypage-limit.png'

const { id } = defineProps({
  id: Number,
})

const icons = [User, Mail, Limit]
const labels = ['이름', '이메일 주소', '월간 지출 한도']
const contents = ['김ㅇㅇ', 'email@email.com', '700,000']
</script>

<style scoped>
.info-item {
  width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: column;
  gap: 12px;
}

.label-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

hr {
  width: 100%;
  height: 1px;
  margin: 0;
  border: 0;
}

span {
  font-size: 14px;
}

p {
  font-size: 20px;
}
</style>
