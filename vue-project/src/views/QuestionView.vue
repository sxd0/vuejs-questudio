<template>
  <div class="question-view">
    <div class="container">
      <div v-if="loading" class="loading">
        <p>Загрузка вопроса...</p>
      </div>
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <router-link to="/" class="btn-primary">Вернуться на главную</router-link>
      </div>
      <div v-else class="question-details">
        <!-- Хлебные крошки -->
        <div class="breadcrumbs">
          <router-link to="/">Главная</router-link>
          <span class="separator">/</span>
          <span class="current">{{ question.title }}</span>
        </div>

        <!-- Блок вопроса -->
        <article class="question-article">
          <header class="question-header">
            <h1>{{ question.title }}</h1>
            <div class="question-meta">
              <span class="date">Задан {{ formatDate(question.created_at) }}</span>
              <span class="views">Просмотров: 1.2K</span>
              <div class="tags">
                <span v-for="tagId in getQuestionTags(question.id)" :key="tagId" class="tag">
                  {{ getTagName(tagId) }}
                </span>
              </div>
            </div>
          </header>

          <div class="question-content">
            <div class="question-votes">
              <button class="vote-up" @click="voteQuestion(1)" aria-label="Голосовать за">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
              </button>
              <span class="vote-count">{{ question.vote_count }}</span>
              <button class="vote-down" @click="voteQuestion(-1)" aria-label="Голосовать против">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>
            </div>
            <div class="question-body">
              <p>{{ question.body }}</p>
              <div class="question-author">
                <span>Автор: {{ getUserName(question.user_id) }}</span>
              </div>
            </div>
          </div>

          <!-- Комментарии к вопросу -->
          <CommentsList 
            :comments="getComments(question.id)" 
            :users="users" 
            :parent-id="question.id"
            @add-comment="addComment" 
          />
        </article>

        <!-- Блок ответов -->
        <section class="answers-section">
          <h2>{{ getAnswersCount(question.id) }} ответов</h2>
          
          <div v-if="getAnswersCount(question.id) === 0" class="no-answers">
            <p>На этот вопрос еще нет ответов. Будьте первым!</p>
          </div>
          
          <article v-for="answer in getAnswers(question.id)" :key="answer.id" class="answer-article">
            <div class="answer-content">
              <div class="answer-votes">
                <button class="vote-up" @click="voteAnswer(answer.id, 1)" aria-label="Голосовать за">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                </button>
                <span class="vote-count">{{ answer.vote_count }}</span>
                <button class="vote-down" @click="voteAnswer(answer.id, -1)" aria-label="Голосовать против">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </button>
              </div>
              <div class="answer-body">
                <p>{{ answer.body }}</p>
                <div class="answer-author">
                  <span>Ответил: {{ getUserName(answer.user_id) }}</span>
                  <span class="answer-date">{{ formatDate(answer.created_at) }}</span>
                </div>
              </div>
            </div>

            <!-- Комментарии к ответу -->
            <CommentsList 
              :comments="getComments(answer.id)" 
              :users="users" 
              :parent-id="answer.id"
              @add-comment="addComment" 
            />
          </article>
        </section>

        <!-- Форма добавления ответа -->
        <section class="add-answer-section">
          <h2>Ваш ответ</h2>
          <form @submit.prevent="addAnswer" class="answer-form">
            <div class="form-group">
              <textarea 
                v-model="newAnswer" 
                placeholder="Напишите свой ответ здесь..." 
                rows="6" 
                required
              ></textarea>
            </div>
            <button type="submit" class="btn-primary">Отправить ответ</button>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import CommentsList from "../components/question/CommentsList.vue";

const route = useRoute();
const router = useRouter();

const question = ref(null);
const posts = ref([]);
const users = ref([]);
const tags = ref([]);
const questionTags = ref([]);
const loading = ref(true);
const error = ref(null);
const newAnswer = ref("");

// Загрузка данных
onMounted(async () => {
  try {
    const response = await fetch("/data/main.json");
    const data = await response.json();
    
    // Получаем ID вопроса из URL
    const questionId = parseInt(route.params.id);
    
    // Находим вопрос по ID
    const foundQuestion = data.posts.find(
      post => post.id === questionId && post.post_type === "question"
    );
    
    if (!foundQuestion) {
      error.value = "Вопрос не найден";
      loading.value = false;
      return;
    }
    
    question.value = foundQuestion;
    posts.value = data.posts;
    users.value = data.users;
    tags.value = data.tags;
    questionTags.value = data.question_tags;
    
    loading.value = false;
  } catch (error) {
    console.error("Error loading data:", error);
    error.value = "Ошибка при загрузке данных. Попробуйте позже.";
    loading.value = false;
  }
});

// Получение списка ответов на вопрос
const getAnswers = (questionId) => {
  return posts.value.filter(
    post => post.parent_id === questionId && post.post_type === "answer"
  );
};

// Получение количества ответов
const getAnswersCount = (questionId) => {
  return getAnswers(questionId).length;
};

// Получение комментариев к посту (вопросу или ответу)
const getComments = (postId) => {
  return posts.value.filter(
    post => post.parent_id === postId && post.post_type === "comment"
  );
};

// Получение имени пользователя по ID
const getUserName = (userId) => {
  const user = users.value.find(user => user.id === userId);
  return user ? user.username : "Неизвестный пользователь";
};

// Получение тегов вопроса
const getQuestionTags = (questionId) => {
  return questionTags.value
    .filter(qt => qt.question_id === questionId)
    .map(qt => qt.tag_id);
};

// Получение названия тега по ID
const getTagName = (tagId) => {
  const tag = tags.value.find(tag => tag.id === tagId);
  return tag ? tag.name : "";
};

// Форматирование даты
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
};

// Голосование за вопрос
const voteQuestion = (value) => {
  question.value.vote_count += value;
  alert(`Вы проголосовали ${value > 0 ? "за" : "против"} вопрос`);
};

// Голосование за ответ
const voteAnswer = (answerId, value) => {
  const answer = posts.value.find(post => post.id === answerId);
  if (answer) {
    answer.vote_count += value;
    alert(`Вы проголосовали ${value > 0 ? "за" : "против"} ответ`);
  }
};

// Добавление комментария (обработчик события от CommentsList)
const addComment = ({ parentId, text }) => {
  const newCommentObj = {
    id: posts.value.length + 1,
    user_id: 2, // ID текущего пользователя (janedoe)
    title: null,
    body: text,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parent_id: parentId,
    post_type: "comment",
    is_closed: false,
    is_visible: true,
    vote_count: 0
  };

  posts.value.push(newCommentObj);
  alert("Комментарий добавлен");
};

// Добавление ответа на вопрос
const addAnswer = () => {
  if (!newAnswer.value.trim()) return;

  const newAnswerObj = {
    id: posts.value.length + 1,
    user_id: 2, // ID текущего пользователя (janedoe)
    title: null,
    body: newAnswer.value,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parent_id: question.value.id,
    post_type: "answer",
    is_closed: false,
    is_visible: true,
    vote_count: 0
  };

  posts.value.push(newAnswerObj);
  newAnswer.value = "";
  alert("Ответ добавлен");
};
</script>

<style>
/* Стили для страницы детального просмотра вопроса */
.question-view {
  padding: 2rem 0;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.error {
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}

.breadcrumbs {
  margin-bottom: 1.5rem;
  color: #6a737c;
  font-size: 0.875rem;
}

.breadcrumbs a {
  color: #0077cc;
  text-decoration: none;
}

.breadcrumbs a:hover {
  text-decoration: underline;
}

.separator {
  margin: 0 0.5rem;
}

.current {
  color: #6a737c;
  font-weight: 500;
}

.question-article, 
.answer-article {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
}

.question-header {
  padding: 1.5rem;
  padding-bottom: 0;
}

.question-header h1 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #222;
}

.question-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  color: #6a737c;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: #e1ecf4;
  color: #39739d;
  border-radius: 4px;
  font-size: 0.75rem;
}

.question-content,
.answer-content {
  display: flex;
  padding: 1.5rem;
}

.question-votes,
.answer-votes {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1.5rem;
  min-width: 40px;
}

.vote-up,
.vote-down {
  background: none;
  border: none;
  cursor: pointer;
  color: #6a737c;
  padding: 0.5rem;
  transition: color 0.2s;
}

.vote-up:hover,
.vote-down:hover {
  color: #0077cc;
}

.vote-count {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0.5rem 0;
}

.question-body,
.answer-body {
  flex: 1;
}

.question-body p,
.answer-body p {
  margin-top: 0;
  line-height: 1.6;
  white-space: pre-line;
}

.question-author,
.answer-author {
  margin-top: 1.5rem;
  color: #6a737c;
  font-size: 0.875rem;
  display: flex;
  justify-content: space-between;
}

.answers-section {
  margin-bottom: 2rem;
}

.answers-section h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #222;
}

.no-answers {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 2rem;
}

.add-answer-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.add-answer-section h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #222;
}

.answer-form textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
  font-size: 0.9rem;
}

.answer-form textarea:focus {
  border-color: #0077cc;
  outline: none;
}

.btn-primary {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  margin-top: 1rem;
  background-color: #0077cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #005fa3;
}

@media print {
  .question-view {
    padding: 0;
  }
  
  .breadcrumbs, 
  .vote-up,
  .vote-down,
  .add-answer-section {
    display: none;
  }
  
  .question-article, 
  .answer-article {
    box-shadow: none;
    margin-bottom: 1rem;
    page-break-inside: avoid;
  }
}

@media (max-width: 768px) {
  .question-content,
  .answer-content {
    flex-direction: column;
  }
  
  .question-votes,
  .answer-votes {
    flex-direction: row;
    margin-right: 0;
    margin-bottom: 1rem;
    min-width: auto;
  }
  
  .vote-count {
    margin: 0 1rem;
  }
  
  .question-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .question-header h1 {
    font-size: 1.5rem;
  }
  
  .btn-primary {
    width: 100%;
  }
}
</style>
