<template>
  <div class="app-wrapper">
    <app-header />
    <main class="main-content">
      <div class="container">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
    <app-footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';

onMounted(() => {
  document.title = 'QA Platform - Вопросы и ответы по программированию';
});
</script>

<style>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem 0;
  }
}
</style>