<template>
  <button class="bg-green-2 text-black-1 fw-bold" @click="userStore.changeModifyMode(true)">
    {{ label }}를 설정하세요!
  </button>
</template>

<script setup>
import { useUserStore } from '@/stores/useUserStore'

const userStore = useUserStore()

const { label } = defineProps({
  label: String,
})
</script>

<style scoped>
button {
  width: 140px;
  height: 48px;
  border: 0;
  border-radius: 18px;
  font-size: 14;
}

button:hover {
  background-color: var(--green-1);
}
</style>
