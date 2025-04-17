<template>
  <section class="question-detail-view">
    <div v-if="isLoading" class="loading">
      <p>Загрузка вопроса...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <router-link to="/" class="btn btn-primary">Вернуться на главную</router-link>
    </div>
    
    <div v-else-if="question" class="question-container">
      <div class="question-header">
        <h1>{{ question.title }}</h1>
        
        <div class="question-meta">
          <span class="date">Задан {{ formatDate(question.created_at) }}</span>
          <span class="views"><i class="fas fa-eye"></i> {{ question.views_count }} просмотров</span>
        </div>
        
        <div class="tags">
          <span v-for="tagId in getQuestionTags(question.id)" :key="tagId" class="badge badge-primary">
            {{ getTagName(tagId) }}
          </span>
        </div>
      </div>
      
      <div class="question-body card">
        <div class="vote-controls">
          <button class="vote-btn" @click="upvoteQuestion">
            <i class="fas fa-chevron-up"></i>
          </button>
          <span class="vote-count">{{ question.vote_count }}</span>
          <button class="vote-btn" @click="downvoteQuestion">
            <i class="fas fa-chevron-down"></i>
          </button>
        </div>
        
        <div class="content">
          {{ question.body }}
          
          <div class="author-info">
            <div class="avatar">
              <img :src="getAuthorAvatar(question.user_id)" alt="Аватар автора">
            </div>
            <div class="details">
              <div class="name">{{ getAuthorName(question.user_id) }}</div>
              <div class="asked">задал {{ formatDate(question.created_at) }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="answers-section">
        <h2>{{ answersCount }} Ответов</h2>
        
        <div v-if="answers.length > 0" class="answers-list">
          <div v-for="answer in answers" :key="answer.id" class="answer card">
            <div class="vote-controls">
              <button class="vote-btn" @click="upvoteAnswer(answer.id)">
                <i class="fas fa-chevron-up"></i>
              </button>
              <span class="vote-count">{{ answer.vote_count }}</span>
              <button class="vote-btn" @click="downvoteAnswer(answer.id)">
                <i class="fas fa-chevron-down"></i>
              </button>
            </div>
            
            <div class="content">
              <div class="answer-body">{{ answer.body }}</div>
              
              <div class="author-info">
                <div class="avatar">
                  <img :src="getAuthorAvatar(answer.user_id)" alt="Аватар автора">
                </div>
                <div class="details">
                  <div class="name">{{ getAuthorName(answer.user_id) }}</div>
                  <div class="answered">ответил {{ formatDate(answer.created_at) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="no-answers">
          <p>На этот вопрос пока нет ответов.</p>
        </div>
        
        <div class="add-answer-section">
          <h3>Ваш ответ</h3>
          <answer-form @submit-answer="addAnswer" />
        </div>
      </div>
      
      <div class="related-questions">
        <h3>Похожие вопросы</h3>
        <ul class="related-list">
          <li v-for="relatedQ in relatedQuestions" :key="relatedQ.id">
            <router-link :to="`/question/${relatedQ.id}`">{{ relatedQ.title }}</router-link>
            <span class="votes">{{ relatedQ.vote_count }} голосов</span>
          </li>
        </ul>
      </div>
    </div>
    
    <div v-else class="not-found">
      <p>Вопрос не найден.</p>
      <router-link to="/" class="btn btn-primary">Вернуться на главную</router-link>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import AnswerForm from '@/components/forms/AnswerForm.vue';

const route = useRoute();
const questionId = computed(() => parseInt(route.params.id));

const allData = ref({});
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await axios.get('/data/main.json');
    allData.value = response.data;
    isLoading.value = false;
  } catch (err) {
    error.value = 'Ошибка при загрузке данных. Пожалуйста, попробуйте позже.';
    isLoading.value = false;
  }
});

const question = computed(() => {
  if (!allData.value.posts) return null;
  return allData.value.posts.find(post => post.id === questionId.value && post.post_type === 'question');
});

const answers = computed(() => {
  if (!allData.value.posts) return [];
  return allData.value.posts.filter(post => 
    post.post_type === 'answer' && post.parent_id === questionId.value
  ).sort((a, b) => b.vote_count - a.vote_count);
});

const answersCount = computed(() => answers.value.length);

const relatedQuestions = computed(() => {
  if (!allData.value.posts || !question.value) return [];
  
  const currentTags = getQuestionTags(questionId.value);
  
  return allData.value.posts
    .filter(post => 
      post.id !== questionId.value && 
      post.post_type === 'question' &&
      getQuestionTags(post.id).some(tag => currentTags.includes(tag))
    )
    .slice(0, 5);
});

const getQuestionTags = (id) => {
  if (!allData.value.postsTags) return [];
  return allData.value.postsTags
    .filter(pt => pt.post_id === id)
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const upvoteQuestion = () => {
  alert('Голос за вопрос учтен!');
};

const downvoteQuestion = () => {
  alert('Голос против вопроса учтен!');
};

const upvoteAnswer = (answerId) => {
  alert(`Голос за ответ #${answerId} учтен!`);
};

const downvoteAnswer = (answerId) => {
  alert(`Голос против ответа #${answerId} учтен!`);
};

const addAnswer = (answerData) => {
  alert('Ваш ответ добавлен!');
};
</script>

<style>
.question-detail-view {
  width: 100%;
}

.loading, .error, .not-found {
  text-align: center;
  padding: 2rem;
}

.question-header {
  margin-bottom: 1.5rem;
}

.question-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.question-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  color: var(--text-light);
  font-size: 0.9rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.badge {
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
}

.question-body, .answer {
  display: flex;
  margin-bottom: 2rem;
  padding: 1.5rem;
}

.vote-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1.5rem;
  min-width: 40px;
}

.vote-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-light);
  font-size: 1.2rem;
}

.vote-btn:hover {
  color: var(--primary-color);
}

.vote-count {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.content {
  flex-grow: 1;
}

.answer-body {
  margin-bottom: 1.5rem;
}

.author-info {
  display: flex;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.details {
  font-size: 0.9rem;
}

.name {
  font-weight: bold;
  color: var(--primary-color);
}

.asked, .answered {
  color: var(--text-light);
}

.answers-section {
  margin-top: 3rem;
  margin-bottom: 3rem;
}

.answers-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.no-answers {
  background-color: var(--bg-light);
  padding: 2rem;
  text-align: center;
  border-radius: var(--radius);
  color: var(--text-light);
}

.add-answer-section {
  margin-top: 3rem;
}

.add-answer-section h3 {
  margin-bottom: 1rem;
}

.related-questions {
  background-color: var(--bg-light);
  padding: 1.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.related-questions h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.related-list {
  list-style-type: none;
}

.related-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
}

.related-list li:last-child {
  border-bottom: none;
}

.votes {
  color: var(--text-light);
  font-size: 0.9rem;
}

@media print {
  .vote-controls, 
  .add-answer-section, 
  .related-questions {
    display: none;
  }
  
  .question-detail-view {
    font-size: 12pt;
  }
  
  .question-header h1 {
    font-size: 18pt;
  }
  
  .card {
    box-shadow: none;
    border: 1px solid #ccc;
  }
  
  .author-info {
    page-break-inside: avoid;
  }
}

@media (max-width: 768px) {
  .question-header h1 {
    font-size: 1.5rem;
  }
  
  .question-meta {
    flex-direction: column;
    gap: 0.3rem;
  }
  
  .question-body, .answer {
    flex-direction: column;
  }
  
  .vote-controls {
    flex-direction: row;
    margin-right: 0;
    margin-bottom: 1rem;
    justify-content: center;
  }
  
  .vote-count {
    margin: 0 0.5rem;
  }
}
</style>