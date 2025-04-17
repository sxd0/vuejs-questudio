<template>
  <div class="app">
    <SkipLink />
    <TheHeader />
    <main id="main-content" class="main-content">
      <RouterView />
    </main>
    <TheFooter />
    <ToastsManager />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import TheHeader from "./components/layout/TheHeader.vue";
import TheFooter from "./components/layout/TheFooter.vue";
import SkipLink from "./components/ui/SkipLink.vue";
import ToastsManager from "./components/layout/ToastsManager.vue";
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

.main-content {
  min-height: calc(100vh - 400px); /* Минимальная высота для основного контента */
}

/* Фокус для клавиатурной навигации */
:focus-visible {
  outline: 3px solid #0077cc;
  outline-offset: 2px;
}

/* Адаптивные стили */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}
</style>
