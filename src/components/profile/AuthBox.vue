<template>
  <div class="auth-box">
    <AuthButton v-for="id in [0, 1]" :id="id" />
  </div>
</template>

<script setup>
import AuthButton from './AuthButton.vue'
</script>

<style scoped>
.auth-box {
  grid-row: 3;
  grid-column: 2;

  display: flex;
  gap: 16px;

  justify-self: end;
  align-items: end;
}
</style>
