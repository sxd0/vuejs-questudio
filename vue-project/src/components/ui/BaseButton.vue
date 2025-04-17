<template>
  <button 
    :class="[
      'base-button', 
      `base-button--${variant}`, 
      { 'base-button--block': block, 'base-button--disabled': disabled }
    ]" 
    :disabled="disabled"
    :type="type"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineEmits(["click"]);

defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (value) => ["primary", "secondary", "danger", "text"].includes(value)
  },
  type: {
    type: String,
    default: "button"
  },
  block: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.base-button--primary {
  background-color: #0077cc;
  color: white;
}

.base-button--primary:hover:not(.base-button--disabled) {
  background-color: #005fa3;
}

.base-button--secondary {
  background-color: transparent;
  color: #6a737c;
  border-color: #6a737c;
}

.base-button--secondary:hover:not(.base-button--disabled) {
  background-color: #f1f2f3;
}

.base-button--danger {
  background-color: #dc3545;
  color: white;
}

.base-button--danger:hover:not(.base-button--disabled) {
  background-color: #bd2130;
}

.base-button--text {
  background-color: transparent;
  color: #0077cc;
  border: none;
  padding: 0.5rem;
}

.base-button--text:hover:not(.base-button--disabled) {
  text-decoration: underline;
}

.base-button--block {
  display: block;
  width: 100%;
}

.base-button--disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
</style>
