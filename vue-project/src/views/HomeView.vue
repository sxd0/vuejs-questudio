<template>
  <section class="home-view">
    <div class="hero-section">
      <h1>Задавайте вопросы и делитесь знаниями</h1>
      <p>Наше сообщество программистов поможет вам найти ответы на самые сложные вопросы</p>
      <router-link to="/ask" class="btn btn-primary">Задать вопрос</router-link>
    </div>

    <div class="questions-section">
      <div class="header-actions">
        <h2>Последние вопросы</h2>
        <div class="actions">
          <search-form />
          <div class="sort-filter">
            <sort-options @sort-changed="updateSort" />
            <filter-options @filter-changed="updateFilter" />
          </div>
        </div>
      </div>

      <questions-list :questions="filteredQuestions" />
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import QuestionsList from '@/components/questions/QuestionsList.vue';
import SearchForm from '@/components/forms/SearchForm.vue';
import SortOptions from '@/components/common/SortOptions.vue';
import FilterOptions from '@/components/common/FilterOptions.vue';

const questions = ref([]);
const isLoading = ref(true);
const error = ref(null);
const sortBy = ref('newest');
const filterTag = ref('');
const searchQuery = ref('');

onMounted(async () => {
  try {
    const response = await axios.get('/data/main.json');
    questions.value = response.data.posts.filter(post => post.post_type === 'question');
    isLoading.value = false;
  } catch (err) {
    error.value = 'Ошибка при загрузке данных. Пожалуйста, попробуйте позже.';
    isLoading.value = false;
  }
});

const updateSort = (sort) => {
  sortBy.value = sort;
};

const updateFilter = (filter) => {
  filterTag.value = filter;
};

const filteredQuestions = computed(() => {
  let result = [...questions.value];
  
  if (filterTag.value) {
  }
  
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'votes':
        return b.vote_count - a.vote_count;
      case 'views':
        return b.views_count - a.views_count;
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });
  
  return result;
});
</script>

<style>
.home-view {
  width: 100%;
}

.hero-section {
  text-align: center;
  padding: 3rem 1rem;
  margin-bottom: 2rem;
  background-color: var(--bg-light);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.hero-section p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: var(--text-light);
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.sort-filter {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 1rem;
  }
  
  .hero-section h1 {
    font-size: 1.8rem;
  }
  
  .hero-section p {
    font-size: 1rem;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>