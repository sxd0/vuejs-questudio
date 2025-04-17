<template>
    <div class="users-view">
      <div class="page-header">
        <h1>Пользователи</h1>
        <p>Участники нашего сообщества</p>
      </div>
      
      <div class="users-controls">
        <search-form />
        <div class="users-sorting">
          <label for="users-sort">Сортировка:</label>
          <select id="users-sort" v-model="sortBy" class="form-control">
            <option value="reputation">По репутации</option>
            <option value="newest">По дате регистрации</option>
            <option value="name">По имени</option>
            <option value="activity">По активности</option>
          </select>
        </div>
      </div>
      
      <div v-if="isLoading" class="loading">
        <p>Загрузка пользователей...</p>
      </div>
      
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>
      
      <div v-else class="users-container">
        <div v-for="user in sortedUsers" :key="user.id" class="user-card">
          <div class="user-avatar">
            <img :src="user.avatar" :alt="user.username">
          </div>
          <div class="user-info">
            <h3 class="user-name">{{ user.username }}</h3>
            <div class="user-stats">
              <div class="user-stat">
                <span class="stat-value">{{ getUserQuestionCount(user.id) }}</span>
                <span class="stat-label">вопросов</span>
              </div>
              <div class="user-stat">
                <span class="stat-value">{{ getUserAnswerCount(user.id) }}</span>
                <span class="stat-label">ответов</span>
              </div>
              <div class="user-stat">
                <span class="stat-value">{{ getUserReputation(user.id) }}</span>
                <span class="stat-label">репутация</span>
              </div>
            </div>
            <div class="user-meta">
              <span class="user-joined">
                <i class="fas fa-calendar-alt"></i> Присоединился: {{ formatDate(user.created_at) }}
              </span>
              <span v-if="user.is_admin" class="user-role admin">
                <i class="fas fa-shield-alt"></i> Администратор
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="pagination">
        <button 
          class="btn btn-secondary btn-sm" 
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          <i class="fas fa-chevron-left"></i> Назад
        </button>
        <span class="page-info">Страница {{ currentPage }} из {{ totalPages }}</span>
        <button 
          class="btn btn-secondary btn-sm" 
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          Вперед <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  import SearchForm from '@/components/forms/SearchForm.vue';
  
  const users = ref([]);
  const isLoading = ref(true);
  const error = ref(null);
  const sortBy = ref('reputation');
  const currentPage = ref(1);
  const usersPerPage = 12;
  const allData = ref({});
  
  onMounted(async () => {
    try {
      const response = await axios.get('/data/main.json');
      allData.value = response.data;
      users.value = response.data.users || [];
      isLoading.value = false;
    } catch (err) {
      error.value = 'Ошибка при загрузке данных. Пожалуйста, попробуйте позже.';
      isLoading.value = false;
    }
  });
  
  const getUserQuestionCount = (userId) => {
    if (!allData.value.posts) return 0;
    return allData.value.posts.filter(
      post => post.user_id === userId && post.post_type === 'question'
    ).length;
  };
  
  const getUserAnswerCount = (userId) => {
    if (!allData.value.posts) return 0;
    return allData.value.posts.filter(
      post => post.user_id === userId && post.post_type === 'answer'
    ).length;
  };
  
  const getUserReputation = (userId) => {
    if (!allData.value.votes || !allData.value.posts) return 0;
    
    const userPosts = allData.value.posts.filter(post => post.user_id === userId);
    const userPostIds = userPosts.map(post => post.id);
    
    let reputation = 0;
    userPostIds.forEach(postId => {
      const votes = allData.value.votes.filter(vote => vote.post_id === postId);
      votes.forEach(vote => {
        reputation += vote.vote_type === 1 ? 10 : -2; // +10 за положительный голос, -2 за отрицательный
      });
    });
    
    return reputation;
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  const sortedUsers = computed(() => {
    const usersCopy = [...users.value];
    
    const sorted = usersCopy.sort((a, b) => {
      switch (sortBy.value) {
        case 'reputation':
          return getUserReputation(b.id) - getUserReputation(a.id);
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'name':
          return a.username.localeCompare(b.username);
        case 'activity':
          const aActivity = getUserQuestionCount(a.id) + getUserAnswerCount(a.id);
          const bActivity = getUserQuestionCount(b.id) + getUserAnswerCount(b.id);
          return bActivity - aActivity;
        default:
          return 0;
      }
    });
    
    const startIndex = (currentPage.value - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    return sorted.slice(startIndex, endIndex);
  });
  
  const totalPages = computed(() => {
    return Math.ceil(users.value.length / usersPerPage);
  });
  
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };
  
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };
  </script>
  
  <style>
  .users-view {
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
  
  .users-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .users-sorting {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .users-sorting label {
    color: var(--text-light);
    font-size: 0.9rem;
  }
  
  .users-sorting select {
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
  
  .users-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .user-card {
    background-color: var(--bg-light);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .user-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  .user-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .user-info {
    flex-grow: 1;
  }
  
  .user-name {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: var(--primary-color);
  }
  
  .user-stats {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .user-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .stat-value {
    font-weight: bold;
    color: var(--text-color);
  }
  
  .stat-label {
    font-size: 0.8rem;
    color: var(--text-light);
  }
  
  .user-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.85rem;
    color: var(--text-light);
  }
  
  .user-role.admin {
    color: var(--primary-color);
    font-weight: 500;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-bottom: 3rem;
  }
  
  .page-info {
    color: var(--text-light);
    font-size: 0.9rem;
  }
  
  @media (max-width: 768px) {
    .users-controls {
      flex-direction: column;
      align-items: stretch;
    }
    
    .users-sorting {
      width: 100%;
    }
    
    .users-sorting select {
      flex-grow: 1;
    }
    
    .user-card {
      flex-direction: column;
      text-align: center;
    }
    
    .user-stats {
      justify-content: center;
    }
    
    .user-meta {
      justify-content: center;
    }
  }
  </style>