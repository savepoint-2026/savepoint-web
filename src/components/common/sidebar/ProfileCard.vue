<template>
  <div class="profile-card bg-yellow-2 border-yellow-1 justify-align" v-if="authStore.isLogged">
    <div class="profile-image bg-red-3 justify-align">{{ userStore.userData.profileImg }}</div>
    <p class="fw-black name text-black-1">{{ userStore.userData.name }} 님,</p>
    <p class="hello fw-medium text-black-2">
      오늘도 <span class="text-blue-1 fw-bold">$AVE</span> 하세요! ✨
    </p>
  </div>
  <div class="profile-card bg-yellow-2 border-yellow-1 justify-align" v-else>
    <p class="text-black-1 fw-black">로그인 후 이용 가능합니다</p>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { useUserStore } from '@/stores/useUserStore'

const authStore = useAuthStore()
const userStore = useUserStore()
</script>

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

@media (max-width: 768px) {
  .profile-card {
    width: 100%;
    height: 108px;
    display: grid;
    padding: 16px;
    box-sizing: border-box;

    grid-template-columns: 80px 1fr;
    grid-template-rows: 1fr 1fr;
    row-gap: 8px;
    column-gap: 12px;
  }

  .profile-image {
    width: 76px;
    height: 76px;
    margin-bottom: 0;
    font-size: 44px;

    grid-row: 1 / 3;
    grid-column: 1;
  }

  .name {
    font-size: 18px;
    align-self: end;
  }

  .hello {
    font-size: 14px;
    align-self: start;
  }
}
</style>
