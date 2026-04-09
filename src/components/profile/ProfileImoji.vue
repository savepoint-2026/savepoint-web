<template>
  <div class="imoji-box bg-red-3 justify-align">
    {{
      userStore.isModifying ? userStore.userModifyData.profileImg : userStore.userData.profileImg
    }}
    <ModifyImoji v-if="userStore.isModifying" />
  </div>
</template>

<script setup>
import ModifyImoji from './ModifyImoji.vue'

import { useUserStore } from '@/stores/useUserStore'

const userStore = useUserStore()
</script>

<style scoped>
.imoji-box {
  grid-row: 1;
  grid-column: 1;
  width: 180px;
  height: 180px;
  border-radius: 100%;
  box-shadow: 0 2px 4px rgb(0, 0, 0, 0.05);

  font-size: 96px;
  position: relative;
}
</style>
