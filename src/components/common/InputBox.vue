<template>
  <div class="input-field">
    <span class="fw-black" :style="{ width: `${labelWidth}px` }">{{ label }}</span>
    <input
      :type="type"
      class="bg-black-3 fw-bold text-black-1"
      :value="data"
      @input="emit('value-change', $event.target.value)"
    />
  </div>
</template>

<script setup>
const { label, labelWidth, type, data } = defineProps({
  label: String,
  labelWidth: Number,
  type: String,
  data: String,
})

const emit = defineEmits(['value-change'])
</script>

<style scoped>
.input-field {
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 36px;
}

span {
  font-size: 14px;
}

input {
  height: 56px;
  border: none;
  border-radius: 22px;
  flex: 1;
  font-size: 14px;
  padding: 16px;
  box-sizing: border-box;
}

input:focus {
  border: 1px solid var(--black-2);
}
</style>
