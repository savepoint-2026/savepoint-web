<template>
  <button>
    <img :src="LogoImage" width="15" height="15" />
    <span class="text-blue-1 fw-bold">{{ isMobile ? '추가' : '내역 추가하기' }}</span>
  </button>
</template>

<script setup>
import LogoImage from '@/assets/icons/plus-blue.png'
import { inject } from 'vue'

const isMobile = inject('isMobile')
</script>

<style scoped>
button {
  width: 255px;
  height: 44px;
  display: flex;
  gap: 14px;
  background-color: white;
  justify-content: center;
  align-items: center;
  border-radius: 18px;
  border: 1px solid var(--blue-1);
  cursor: pointer;
}

button:hover {
  background-color: #dde9ff;
}

span {
  font-size: 14px;
}

@media (max-width: 768px) {
  button {
    width: 72px;
    height: 40px;
    gap: 8px;
    border-radius: 14px;
  }
}
</style>
