<template>
  <div class="base-select">
    <label v-if="label" :for="id" class="base-select__label">{{ label }}</label>
    <select
      :id="id"
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      class="base-select__field"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
      <slot></slot>
    </select>
    <p v-if="hint" class="base-select__hint">{{ hint }}</p>
    <p v-if="error" class="base-select__error">{{ error }}</p>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineEmits(["update:modelValue"]);

defineProps({
  id: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ""
  },
  label: {
    type: String,
    default: ""
  },
  placeholder: {
    type: String,
    default: ""
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  hint: {
    type: String,
    default: ""
  },
  error: {
    type: String,
    default: ""
  }
});
</script>

<style scoped>
.base-select {
  margin-bottom: 1rem;
}

.base-select__label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.base-select__field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  line-height: 1.5;
  transition: border-color 0.2s;
  background-color: white;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' stroke='%236A737C' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

.base-select__field:focus {
  border-color: #0077cc;
  outline: none;
}

.base-select__field:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.base-select__hint {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6a737c;
}

.base-select__error {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #dc3545;
}
</style>
