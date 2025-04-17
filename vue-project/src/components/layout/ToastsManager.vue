<template>
  <div class="toasts-container">
    <BaseToast
      v-for="toast in toasts"
      :key="toast.id"
      :show="true"
      :message="toast.message"
      :type="toast.type"
      @close="removeToast(toast.id)"
    />
  </div>
</template>

<script setup>
import { ref, provide } from "vue";
import BaseToast from "../ui/BaseToast.vue";

const toasts = ref([]);
let nextId = 1;

// Добавление нового уведомления
const addToast = (message, type = "info", timeout = 5000) => {
  const toast = {
    id: nextId++,
    message,
    type
  };
  
  toasts.value.push(toast);
  
  if (timeout > 0) {
    setTimeout(() => {
      removeToast(toast.id);
    }, timeout);
  }
  
  return toast.id;
};

// Удаление уведомления
const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id);
  if (index !== -1) {
    toasts.value.splice(index, 1);
  }
};

// Предоставление методов для использования в других компонентах
provide("toast", {
  success: (message, timeout) => addToast(message, "success", timeout),
  error: (message, timeout) => addToast(message, "error", timeout),
  warning: (message, timeout) => addToast(message, "warning", timeout),
  info: (message, timeout) => addToast(message, "info", timeout),
  remove: removeToast
});
</script>

<style scoped>
.toasts-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
