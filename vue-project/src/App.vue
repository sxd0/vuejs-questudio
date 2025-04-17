<template>
  <div class="app">
    <TheHeader />
    <RouterView />
    <TheFooter />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import TheHeader from "./components/layout/TheHeader.vue";
import TheFooter from "./components/layout/TheFooter.vue";
</script>

<style>
/* Сброс стилей */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f9f9f9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Адаптивные стили */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}
</style>
