<template>
  <div class="box-default profile-box">
    <ProfileImoji />
    <ModifyBox />
    <InfoBox />
    <AuthBox v-if="!userStore.isModifying" />
  </div>
</template>

<script setup>
import AuthBox from './AuthBox.vue'
import InfoBox from './InfoBox.vue'
import ModifyBox from './ModifyBox.vue'
import ProfileImoji from './ProfileImoji.vue'

import { useUserStore } from '@/stores/useUserStore'

const userStore = useUserStore()
</script>

<style scoped>
.profile-box {
  width: 100%;
  height: fit-content;
  min-height: 100%;
  padding: 48px;
  box-sizing: border-box;

  display: grid;
  grid-template-columns: 180px 1fr;
  grid-template-rows: 180px auto 98px;
}
</style>
