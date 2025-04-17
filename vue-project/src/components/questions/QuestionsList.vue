<template>
    <div class="questions-list">
      <div v-if="!questions || questions.length === 0" class="no-questions">
        <p>Вопросы не найдены.</p>
      </div>
      
      <div v-else>
        <div v-for="question in questions" :key="question.id" class="question-item">
          <div class="stats">
            <div class="stat-item">
              <div class="stat-value">{{ question.vote_count }}</div>
              <div class="stat-label">голосов</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ getAnswersCount(question.id) }}</div>
              <div class="stat-label">ответов</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ question.views_count }}</div>
              <div class="stat-label">просмотров</div>
            </div>
          </div>
          
          <div class="question-content">
            <h3 class="question-title">
              <router-link :to="`/question/${question.id}`">{{ question.title }}</router-link>
            </h3>
            
            <div class="question-excerpt">
              {{ truncateText(question.body, 200) }}
            </div>
            
            <div class="question-meta">
              <div class="tags">
                <span v-for="tagId in getQuestionTags(question.id)" :key="tagId" class="badge badge-primary">
                  {{ getTagName(tagId) }}
                </span>
              </div>
              
              <div class="author-info">
                <span>спросил {{ formatDate(question.created_at) }}</span>
                <div class="author">
                  <img :src="getAuthorAvatar(question.user_id)" :alt="getAuthorName(question.user_id)" class="author-avatar">
                  <span class="author-name">{{ getAuthorName(question.user_id) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const props = defineProps({
    questions: {
      type: Array,
      required: true
    }
  });
  
  const allData = ref({});
  
  onMounted(async () => {
    try {
      const response = await axios.get('/data/main.json');
      allData.value = response.data;
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  });
  
  const getAnswersCount = (questionId) => {
    if (!allData.value.posts) return 0;
    return allData.value.posts.filter(
      post => post.post_type === 'answer' && post.parent_id === questionId
    ).length;
  };
  
  const getQuestionTags = (questionId) => {
    if (!allData.value.postsTags) return [];
    return allData.value.postsTags
      .filter(pt => pt.post_id === questionId)
      .map(pt => pt.tag_id);
  };
  
  const getTagName = (tagId) => {
    if (!allData.value.tags) return '';
    const tag = allData.value.tags.find(t => t.id === tagId);
    return tag ? tag.name : '';
  };
  
  const getAuthorName = (userId) => {
    if (!allData.value.users) return 'Неизвестный пользователь';
    const user = allData.value.users.find(u => u.id === userId);
    return user ? user.username : 'Неизвестный пользователь';
  };
  
  const getAuthorAvatar = (userId) => {
    if (!allData.value.users) return '';
    const user = allData.value.users.find(u => u.id === userId);
    return user ? user.avatar : '';
  };
  
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  </script>
  
  <style>
  .questions-list {
    margin-top: 1.5rem;
  }
  
  .no-questions {
    text-align: center;
    padding: 2rem;
    background-color: var(--bg-light);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
  }
  
  .question-item {
    display: flex;
    padding: 1.5rem;
    margin-bottom: 1rem;
    background-color: var(--bg-light);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .question-item:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  .stats {
    display: flex;
    flex-direction: column;
    min-width: 100px;
    margin-right: 1.5rem;
    padding-right: 1.5rem;
    border-right: 1px solid var(--border-color);
  }
  
  .stat-item {
    text-align: center;
    margin-bottom: 0.5rem;
  }
  
  .stat-value {
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  .stat-label {
    font-size: 0.8rem;
    color: var(--text-light);
  }
  
  .question-content {
    flex: 1;
  }
  
  .question-title {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
  }
  
  .question-title a {
    color: var(--text-color);
  }
  
  .question-title a:hover {
    color: var(--primary-color);
  }
  
  .question-excerpt {
    color: var(--text-light);
    margin-bottom: 1rem;
    font-size: 0.95rem;
  }
  
  .question-meta {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .badge {
    padding: 0.3rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
  }
  
  .author-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-light);
  }
  
  .author {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .author-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .author-name {
    color: var(--primary-color);
  }
  
  @media (max-width: 768px) {
    .question-item {
      flex-direction: column;
      padding: 1rem;
    }
    
    .stats {
      flex-direction: row;
      justify-content: space-between;
      border-right: none;
      border-bottom: 1px solid var(--border-color);
      margin-right: 0;
      padding-right: 0;
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
    }
    
    .question-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    .author-info {
      align-items: flex-start;
      width: 100%;
    }
  }
  </style>