<template>
  <div class="imoji-box bg-red-3 justify-align">
    {{
      userStore.isModifying ? userStore.userModifyData.profileImg : userStore.userData.profileImg
    }}
    <ModifyImoji v-if="userStore.isModifying" @open-picker="togglePicker" />
    <div v-if="isPickerOpen" class="picker-wrapper">
      <EmojiPicker :native="true" @select="onSelectEmoji" />
    </div>
  </div>
</template>

<script setup>
import ModifyImoji from './ModifyImoji.vue'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

import { ref } from 'vue'
import { useUserStore } from '@/stores/useUserStore'

const userStore = useUserStore()

const isPickerOpen = ref(false)

const togglePicker = () => {
  isPickerOpen.value = !isPickerOpen.value
}

const onSelectEmoji = (emoji) => {
  userStore.updateUserData('profileImg', emoji.i)

  isPickerOpen.value = false
}
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

/* picker 위치 조정 */
.picker-wrapper {
  position: absolute;
  top: 200px;
  left: 0;
  z-index: 10;
}

.picker-wrapper :deep(h5.v3-sticky) {
  font-size: 14px !important;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .imoji-box {
    width: 100px;
    height: 100px;

    font-size: 60px;
  }

  .picker-wrapper {
    top: 112px;
  }
}
</style>
