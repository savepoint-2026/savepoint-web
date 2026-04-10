<template>
  <div class="button-box">
    <ModifyButton v-if="userStore.isModifying" :id="0" />
    <ModifyButton :id="1" />
  </div>
</template>

<script setup>
import ModifyButton from './ModifyButton.vue'
import { useUserStore } from '@/stores/useUserStore'

const userStore = useUserStore()
</script>

<style scoped>
.button-box {
  grid-row: 1;
  grid-column: 2;
  width: fit-content;
  height: fit-content;
  justify-self: end;

  display: flex;
  gap: 14px;
}
</style>
