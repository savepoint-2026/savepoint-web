<template>
  <button>
    <img :src="LogoImage" width="15" height="15" />
    <span class="text-blue-1 fw-bold">내역 추가하기</span>
  </button>
</template>

<script setup>
import LogoImage from '@/assets/icons/plus-blue.png'
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
  background-color: var(--blue-1);
}

button:hover span {
  color: white;
}

span {
  font-size: 14px;
}
</style>
