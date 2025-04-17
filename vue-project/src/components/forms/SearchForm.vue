<template>
    <div class="search-form">
      <form @submit.prevent="search">
        <div class="form-group search-input-group">
          <label for="search-input" class="visually-hidden">Поиск</label>
          <input 
            type="search" 
            id="search-input"
            v-model="searchQuery"
            class="form-control"
            placeholder="Поиск по вопросам..."
            aria-label="Поиск по вопросам"
          >
          <button type="submit" class="search-btn" aria-label="Найти">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const searchQuery = ref('');
  
  const search = () => {
    if (!searchQuery.value.trim()) return;
    
    alert(`Поиск: ${searchQuery.value}`);
    
    searchQuery.value = '';
  };
  </script>
  
  <style>
  .search-form {
    width: 100%;
    max-width: 400px;
  }
  
  .search-input-group {
    position: relative;
    margin: 0;
  }
  
  .search-input-group input {
    padding-right: 40px;
    border-radius: var(--radius);
  }
  
  .search-btn {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 40px;
    border: none;
    background: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-light);
    cursor: pointer;
  }
  
  .search-btn:hover {
    color: var(--primary-color);
  }
  
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  </style>