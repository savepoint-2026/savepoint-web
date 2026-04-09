<template>
  <div class="goal-item">
    <div class="label-box">
      <img :src="Goal" width="18" height="18" />
      <span class="text-black-2 fw-bold">나의 절약 목표</span>
    </div>
    <div class="goal-content bg-black-4 text-black-1 fw-black">
      300,000 &#8361의 지갑을 나에게 선물하겠다!
    </div>
  </div>
</template>

<script setup>
import Goal from '@/assets/icons/mypage/mypage-goal.png'
</script>

<style scoped>
.goal-item {
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

span {
  font-size: 14px;
}

.goal-content {
  width: 100%;
  height: 88px;
  border-radius: 32px;
  padding-left: 32px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  border: 1px solid var(--black-3);
  font-size: 20px;
}
</style>
