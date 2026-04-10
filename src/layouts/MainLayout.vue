<template>
  <div class="container" :class="{ mobile: isMobile }">
    <SideBar v-if="!isMobile" />
    <TopBar v-if="isMobile" />
    <section class="router-container" :class="{ mobile: isMobile }">
      <router-view></router-view>
    </section>
    <BottomBar v-if="isMobile" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, provide } from 'vue'

import SideBar from '@/components/common/SideBar.vue'
import TopBar from '@/components/common/TopBar.vue'
import BottomBar from '@/components/common/BottomBar.vue'

const isMobile = ref(false)

const mediaQuery = window.matchMedia('(max-width: 768px)')

const check = (e) => {
  isMobile.value = e.matches
}

onMounted(() => {
  isMobile.value = mediaQuery.matches
  mediaQuery.addEventListener('change', check)
})

onUnmounted(() => {
  mediaQuery.removeEventListener('change', check)
})

provide('isMobile', isMobile)
</script>

<style scoped>
.container {
  width: 100%;
  height: 100dvh;
  background-color: #f9fafa;
  padding: 0;

  display: flex;
}

.container.mobile {
  height: 100%;
  min-height: 100dvh;
  flex-direction: column;
}

.router-container {
  width: calc(100% - 320px);
  height: 100%;
  padding: 72px 48px;
  box-sizing: border-box;
}

.router-container.mobile {
  width: 100%;
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-top: 24px;
  padding-bottom: 76px;
}
</style>
