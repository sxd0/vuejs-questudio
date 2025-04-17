<template>
    <div class="sort-options">
      <label for="sort-select" class="sort-label">Сортировка:</label>
      <select 
        id="sort-select" 
        v-model="selectedSort" 
        class="form-control sort-select" 
        @change="emitSortChange"
      >
        <option value="newest">Новые</option>
        <option value="votes">По голосам</option>
        <option value="views">По просмотрам</option>
      </select>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const emit = defineEmits(['sort-changed']);
  
  const selectedSort = ref('newest');
  
  const emitSortChange = () => {
    emit('sort-changed', selectedSort.value);
  };
  </script>
  
  <style>
  .sort-options {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .sort-label {
    font-size: 0.9rem;
    color: var(--text-light);
    margin-bottom: 0;
  }
  
  .sort-select {
    width: auto;
    padding: 0.3rem 2rem 0.3rem 0.5rem;
    font-size: 0.9rem;
  }
  </style>