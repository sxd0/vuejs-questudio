<template>
  <span :class="['tag-badge', size === 'small' ? 'tag-badge--small' : '']">
    <slot></slot>
  </span>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  size: {
    type: String,
    default: "normal",
    validator: (value) => ["normal", "small"].includes(value)
  }
});
</script>

<style scoped>
.tag-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: #e1ecf4;
  color: #39739d;
  border-radius: 4px;
  font-size: 0.75rem;
  transition: background-color 0.2s;
}

.tag-badge:hover {
  background-color: #d0e3f1;
}

.tag-badge--small {
  padding: 0.1rem 0.3rem;
  font-size: 0.7rem;
}
</style>
