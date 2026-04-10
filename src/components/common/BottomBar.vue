<template>
  <nav class="bottom-bar box-default">
    <MenuList />
  </nav>
</template>

<script setup>
import MenuList from './sidebar/MenuList.vue'
</script>

<style scoped>
.bottom-bar {
  width: 100%;
  height: 60px;
  background-color: white;
  border-radius: 0;
  padding: 8px;
  box-sizing: border-box;

  position: fixed;
  left: 0;
  bottom: 0;
}
</style>
