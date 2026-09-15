<script setup>
import Toast from '@/components/Toast.vue'
</script>

<template>
  <main class="app-main">
    <router-view />
  </main>
  <Toast />
</template>

<style scoped>
.app-main {
  width: 100%;
  flex: 1;
}
</style>
