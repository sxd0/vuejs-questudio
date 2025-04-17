<template>
  <div class="base-textarea">
    <label v-if="label" :for="id" class="base-textarea__label">{{ label }}</label>
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :required="required"
      :disabled="disabled"
      class="base-textarea__field"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
    <p v-if="hint" class="base-textarea__hint">{{ hint }}</p>
    <p v-if="error" class="base-textarea__error">{{ error }}</p>
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
    type: String,
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
  rows: {
    type: Number,
    default: 5
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
.base-textarea {
  margin-bottom: 1rem;
}

.base-textarea__label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.base-textarea__field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  line-height: 1.5;
  transition: border-color 0.2s;
  font-family: inherit;
  resize: vertical;
}

.base-textarea__field:focus {
  border-color: #0077cc;
  outline: none;
}

.base-textarea__field:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.base-textarea__hint {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6a737c;
}

.base-textarea__error {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #dc3545;
}
</style>
