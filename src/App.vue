<template>
  <div class="container">
    <SideBar></SideBar>
    <section class="router-container">
      <router-view></router-view>
    </section>
  </div>
</template>

<script setup>
import SideBar from './components/common/SideBar.vue'
</script>

<style>
.container {
  width: 100%;
  height: 100vh;
  background-color: #f9fafa;
  padding: 0;

  display: flex;
}

.router-container {
  width: calc(100% - 320px);
  height: 100%;
  padding: 72px 48px;
  box-sizing: border-box;
}
</style>
