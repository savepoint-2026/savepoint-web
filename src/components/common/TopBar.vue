<template>
  <header class="top-bar box-default">
    <div class="logo-button">
      <img :src="LogoImage" :width="isMobile ? 167 : 209" :height="isMobile ? 32 : 40" />
      <router-link to="/add"><AddButton /></router-link>
    </div>
    <router-link to="/profile"><ProfileCard /></router-link>
  </header>
</template>

<script setup>
import LogoImage from '@/assets/icons/sidebar/sidebar-logo.png'
import AddButton from './sidebar/AddButton.vue'
import { inject } from 'vue'
import ProfileCard from './sidebar/ProfileCard.vue'

const isMobile = inject('isMobile')
</script>

<style scoped>
.top-bar {
  width: 100%;
  height: fit-content;
  border-top-left-radius: 0;
  border-top-right-radius: 0;

  padding: 20px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 16px;
}

.logo-button {
  width: 100%;
  height: fit-content;

  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
