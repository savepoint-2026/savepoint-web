<template>
  <div class="profile-card bg-yellow-2 border-yellow-1 justify-align">
    <div class="profile-image bg-red-3 justify-align">🦊</div>
    <p class="fw-black name text-black-1">김ㅇㅇ 님,</p>
    <p class="hello fw-medium text-black-2">
      오늘도 <span class="text-blue-1 fw-bold">$AVE</span> 하세요! ✨
    </p>
  </div>
</template>

<script setup></script>

<style scoped>
.profile-card {
  width: 255px;
  height: 218px;
  border-radius: 32px;
  border: 1px solid #ffdab91a;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
}

.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 100%;
  font-size: 52px;
  margin-bottom: 12px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.07);
}

p {
  margin: 0;
}

.name {
  font-size: 20px;
}

.hello {
  font-size: 16px;
}
</style>
