<template>
  <input :type="type" class="bg-black-4 text-black-1 fw-bold" />
</template>

<script setup>
const { type } = defineProps({
  type: String,
})
</script>

<style scoped>
input {
  width: 100%;
  height: 52px;
  border: 1px solid var(--black-3);
  border-radius: 14px;
  font-size: 20px;
  padding-left: 16px;
  box-sizing: border-box;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
