<template>
  <div class="box-default container">
    <div class="title-box">
      <p class="title fw-black text-black-1">로그인</p>
      <p class="subtitle fw-regular text-black-2">우리 함께 $AVE POINT 해 볼까요?</p>
    </div>
    <div class="input-box">
      <InputBox :label="'ID'" :label-width="20" :type="'text'" />
      <InputBox :label="'PW'" :label-width="20" :type="'password'" />
    </div>
    <button class="orange-btn">
      <img :src="Check" width="18" height="18" />
      <span class="fw-black">로그인</span>
    </button>
  </div>
</template>

<script setup>
import Check from '@/assets/icons/check.png'
import InputBox from './InputBox.vue'
</script>

<style scoped>
.container {
  width: 404px;
  height: 351px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 32px;
  justify-content: space-between;
}

.title-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.title {
  font-size: 20px;
}

.subtitle {
  font-size: 14px;
}

button {
  align-self: center;
  display: flex;
  gap: 14px;
  justify-content: center;
  align-items: center;
}

span {
  font-size: 14px;
}

.input-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
