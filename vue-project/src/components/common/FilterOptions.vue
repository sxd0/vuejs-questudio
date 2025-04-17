<template>
    <div class="filter-options">
      <label for="filter-select" class="filter-label">Фильтр:</label>
      <select 
        id="filter-select" 
        v-model="selectedFilter" 
        class="form-control filter-select" 
        @change="emitFilterChange"
      >
        <option value="">Все вопросы</option>
        <option v-for="tag in tags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
      </select>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const emit = defineEmits(['filter-changed']);
  
  const selectedFilter = ref('');
  const tags = ref([]);
  
  onMounted(async () => {
    try {
      const response = await axios.get('/data/main.json');
      tags.value = response.data.tags || [];
    } catch (error) {
      console.error('Ошибка при загрузке тегов:', error);
    }
  });
  
  const emitFilterChange = () => {
    emit('filter-changed', selectedFilter.value);
  };
  </script>
  
  <style>
  .filter-options {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .filter-label {
    font-size: 0.9rem;
    color: var(--text-light);
    margin-bottom: 0;
  }
  
  .filter-select {
    width: auto;
    padding: 0.3rem 2rem 0.3rem 0.5rem;
    font-size: 0.9rem;
  }
  </style>