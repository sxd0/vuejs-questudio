<template>
  <transition name="toast">
    <div v-if="show" :class="['toast', `toast--${type}`]" role="alert" aria-live="assertive">
      <div class="toast__content">
        <span v-if="type === 'success'" class="toast__icon"></span>
        <span v-else-if="type === 'error'" class="toast__icon"></span>
        <span v-else-if="type === 'warning'" class="toast__icon">!</span>
        <span v-else-if="type === 'info'" class="toast__icon">i</span>
        <p class="toast__message">{{ message }}</p>
      </div>
      <button @click="$emit('close')" class="toast__close" aria-label="Закрыть уведомление"></button>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineEmits(["close"]);

defineProps({
  show: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: "info",
    validator: (value) => ["success", "error", "warning", "info"].includes(value)
  }
});
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  max-width: 350px;
  min-width: 250px;
  background-color: white;
  color: #333;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
  overflow: hidden;
}

.toast--success {
  border-left: 4px solid #4caf50;
}

.toast--error {
  border-left: 4px solid #f44336;
}

.toast--warning {
  border-left: 4px solid #ff9800;
}

.toast--info {
  border-left: 4px solid #2196f3;
}

.toast__content {
  display: flex;
  align-items: center;
  padding: 16px;
  flex: 1;
}

.toast__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-weight: bold;
  margin-right: 12px;
  flex-shrink: 0;
}

.toast--success .toast__icon {
  background-color: #e8f5e9;
  color: #4caf50;
}

.toast--error .toast__icon {
  background-color: #ffebee;
  color: #f44336;
}

.toast--warning .toast__icon {
  background-color: #fff3e0;
  color: #ff9800;
}

.toast--info .toast__icon {
  background-color: #e3f2fd;
  color: #2196f3;
}

.toast__message {
  margin: 0;
  font-size: 0.875rem;
}

.toast__close {
  background: none;
  border: none;
  color: #999;
  font-size: 20px;
  cursor: pointer;
  padding: 16px;
  transition: color 0.2s;
}

.toast__close:hover {
  color: #333;
}

/* Анимации */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
