<template>
  <div class="button-box">
    <ModifyButton v-for="id in [0, 1]" :id="id" />
  </div>
</template>

<script setup>
import ModifyButton from './ModifyButton.vue'
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
