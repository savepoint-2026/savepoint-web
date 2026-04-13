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
  min-height: 100dvh;
  background-color: #f9fafa;
  padding: 0;
}

.container.mobile {
  flex-direction: column;
}

.router-container {
  width: calc(100% - 320px);
  height: 100%;
  margin-left: 320px;
  padding: 72px 48px;
  box-sizing: border-box;
  min-height: 100dvh;
}

.router-container.mobile {
  width: 100%;
  flex: 1;
  overflow-y: auto;
  margin-left: 0;
  padding: 16px;
  padding-top: 24px;
  padding-bottom: 76px;
}
</style>
