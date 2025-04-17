<template>
    <div class="tags-view">
      <div class="page-header">
        <h1>Теги</h1>
        <p>Список всех тегов, используемых для категоризации вопросов</p>
      </div>
      
      <div class="tags-controls">
        <search-form />
        <div class="tags-sorting">
          <label for="tags-sort">Сортировка:</label>
          <select id="tags-sort" v-model="sortBy" class="form-control">
            <option value="name">По имени</option>
            <option value="popular">По популярности</option>
            <option value="newest">По новизне</option>
          </select>
        </div>
      </div>
      
      <div v-if="isLoading" class="loading">
        <p>Загрузка тегов...</p>
      </div>
      
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>
      
      <div v-else class="tags-container">
        <div v-for="tag in sortedTags" :key="tag.id" class="tag-card">
          <div class="tag-header">
            <span class="tag-badge badge badge-primary">{{ tag.name }}</span>
            <span class="tag-count">{{ getTagQuestionsCount(tag.id) }} вопросов</span>
          </div>
          <p class="tag-description">{{ tag.description }}</p>
          <router-link :to="`/?tag=${tag.id}`" class="btn btn-secondary btn-sm">
            Смотреть вопросы
          </router-link>
        </div>
      </div>
      
      <div class="tags-info card">
        <h2>Что такое теги?</h2>
        <p>
          Теги — это ключевые слова или метки, которые помогают классифицировать ваш вопрос с похожими вопросами. Использование правильных тегов помогает другим найти ваш вопрос и увеличивает шансы получить ответ быстрее.
        </p>
        <h3>Рекомендации по использованию тегов:</h3>
        <ul>
          <li>Выбирайте теги, точно описывающие тему вашего вопроса</li>
          <li>Используйте конкретные теги вместо общих</li>
          <li>Комбинируйте теги для точной классификации</li>
          <li>Не создавайте новые теги, если существующие подходят</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  import SearchForm from '@/components/forms/SearchForm.vue';
  
  const tags = ref([]);
  const isLoading = ref(true);
  const error = ref(null);
  const sortBy = ref('popular');
  const allData = ref({});
  
  onMounted(async () => {
    try {
      const response = await axios.get('/data/main.json');
      allData.value = response.data;
      tags.value = response.data.tags || [];
      isLoading.value = false;
    } catch (err) {
      error.value = 'Ошибка при загрузке данных. Пожалуйста, попробуйте позже.';
      isLoading.value = false;
    }
  });
  
  const getTagQuestionsCount = (tagId) => {
    if (!allData.value.postsTags) return 0;
    return allData.value.postsTags.filter(pt => pt.tag_id === tagId).length;
  };
  
  const sortedTags = computed(() => {
    const tagsCopy = [...tags.value];
    
    switch (sortBy.value) {
      case 'name':
        return tagsCopy.sort((a, b) => a.name.localeCompare(b.name));
      case 'popular':
        return tagsCopy.sort((a, b) => {
          const aCount = getTagQuestionsCount(a.id);
          const bCount = getTagQuestionsCount(b.id);
          return bCount - aCount;
        });
      case 'newest':
        return tagsCopy.sort((a, b) => b.id - a.id);
      default:
        return tagsCopy;
    }
  });
  </script>
  
  <style>
  .tags-view {
    max-width: 1100px;
    margin: 0 auto;
  }
  
  .page-header {
    margin-bottom: 2rem;
  }
  
  .page-header h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .page-header p {
    color: var(--text-light);
  }
  
  .tags-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .tags-sorting {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .tags-sorting label {
    color: var(--text-light);
    font-size: 0.9rem;
  }
  
  .tags-sorting select {
    padding: 0.3rem 2rem 0.3rem 0.5rem;
    font-size: 0.9rem;
  }
  
  .loading, .error {
    text-align: center;
    padding: 2rem;
    background-color: var(--bg-light);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
  }
  
  .tags-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }
  
  .tag-card {
    background-color: var(--bg-light);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 1.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
  }
  
  .tag-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  .tag-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .tag-badge {
    font-size: 0.9rem;
    padding: 0.3rem 0.6rem;
  }
  
  .tag-count {
    font-size: 0.9rem;
    color: var(--text-light);
  }
  
  .tag-description {
    color: var(--text-color);
    margin-bottom: 1.5rem;
    flex-grow: 1;
    font-size: 0.95rem;
  }
  
  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
  
  .tags-info {
    padding: 2rem;
    margin-bottom: 2rem;
  }
  
  .tags-info h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--primary-color);
  }
  
  .tags-info p {
    margin-bottom: 1.5rem;
  }
  
  .tags-info h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
  
  .tags-info ul {
    padding-left: 1.5rem;
  }
  
  .tags-info li {
    margin-bottom: 0.5rem;
  }
  
  @media (max-width: 768px) {
    .tags-controls {
      flex-direction: column;
      align-items: stretch;
    }
    
    .tags-sorting {
      width: 100%;
    }
    
    .tags-sorting select {
      flex-grow: 1;
    }
  }
  </style>