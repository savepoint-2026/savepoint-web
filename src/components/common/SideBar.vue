<template>
  <nav class="sidebar" v-if="!userStore.loading">
    <div class="profile-menu">
      <router-link to="/profile"><ProfileCard /></router-link>
      <MenuList />
    </div>
    <div class="add-logo">
      <router-link to="/add"><AddButton /></router-link>
      <img :src="LogoImage" width="209" height="40" />
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/useAuthStore'
import AddButton from './sidebar/AddButton.vue'
import MenuList from './sidebar/MenuList.vue'
import ProfileCard from './sidebar/ProfileCard.vue'
import LogoImage from '@/assets/icons/sidebar/sidebar-logo.png'

import { useUserStore } from '@/stores/useUserStore'
import { watch } from 'vue'

const authStore = useAuthStore()
const userStore = useUserStore()

watch(
  () => authStore.currentUserId,
  (newValue) => {
    if (newValue) userStore.loadUserData(newValue)
  },
)

userStore.loadUserData(authStore.currentUserId)
</script>

<style scoped>
.sidebar {
  width: 320px;
  height: 100%;
  background-color: white;
  padding: 72px 32px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  position: fixed;
  left: 0;
  top: 0;
}

.profile-menu {
  display: flex;
  flex-direction: column;
  gap: 42px;
  align-items: center;
}

.add-logo {
  display: flex;
  flex-direction: column;
  gap: 28px;
  align-items: center;
}
</style>
