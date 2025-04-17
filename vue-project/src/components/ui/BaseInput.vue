<template>
  <div class="base-input">
    <label v-if="label" :for="id" class="base-input__label">{{ label }}</label>
    <div class="base-input__wrapper">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :inputmode="inputmode"
        class="base-input__field"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
    <p v-if="hint" class="base-input__hint">{{ hint }}</p>
    <p v-if="error" class="base-input__error">{{ error }}</p>
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
  type: {
    type: String,
    default: "text"
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
  },
  inputmode: {
    type: String,
    default: "text"
  }
});
</script>

<style scoped>
.base-input {
  margin-bottom: 1rem;
}

.base-input__label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.base-input__wrapper {
  position: relative;
}

.base-input__field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  line-height: 1.5;
  transition: border-color 0.2s;
}

.base-input__field:focus {
  border-color: #0077cc;
  outline: none;
}

.base-input__field:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.base-input__hint {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6a737c;
}

.base-input__error {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #dc3545;
}
</style>
