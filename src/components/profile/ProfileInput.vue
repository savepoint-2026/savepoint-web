<template>
  <input
    :type="type"
    class="bg-black-4 text-black-1 fw-bold"
    :value="data"
    @input="emit('value-change', $event.target.value)"
  />
</template>

<script setup>
const { type, data } = defineProps({
  type: String,
  data: String | Number,
})

const emit = defineEmits(['value-change'])
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

input:focus {
  border: 1px solid var(--black-2);
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
