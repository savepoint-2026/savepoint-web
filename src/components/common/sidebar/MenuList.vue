<template>
  <ul>
    <MenuItem v-for="id in menuId" :key="id" :id="id" />
  </ul>
</template>

<script setup>
import MenuItem from './MenuItem.vue'

const menuId = [0, 1, 2, 3]
</script>

<style>
ul {
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
