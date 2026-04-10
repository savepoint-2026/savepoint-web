<template>
  <div class="goal-input justify-align">
    <label class="text-black-1 fw-bold">{{ type === 'itemName' ? '품목' : '금액' }}</label>
    <input
      :type="type === 'itemName' ? 'text' : 'number'"
      class="text-black-1 fw-black"
      :value="data"
      @input="emit('value-change', $event.target.value)"
    />
  </div>
</template>

<script setup>
const { type, data } = defineProps({
  type: String,
  data: String | Number,
})

const emit = defineEmits(['value-change'])
</script>

<style scoped>
.goal-input {
  width: fit-content;
  height: 100%;

  display: flex;
  gap: 16px;
}

input {
  width: 200px;
  height: 52px;
  background-color: white;
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
