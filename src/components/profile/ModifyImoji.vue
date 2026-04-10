<template>
  <div class="bg-yellow-1 justify-align" @click="emit('open-picker')">
    <img :src="Modify" width="20" height="20" />
  </div>
</template>

<script setup>
import Modify from '@/assets/icons/mypage/mypage-modify-profile.png'

const emit = defineEmits(['open-picker'])
</script>

<style scoped>
div {
  width: 44px;
  height: 44px;
  border-radius: 100%;

  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);

  position: absolute;
  top: 128px;
  left: 128px;
}
</style>
