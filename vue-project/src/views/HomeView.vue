<template>
  <main class="home-view">
    <section class="hero">
      <div class="container">
        <h1>Вопросы и ответы для разработчиков</h1>
        <p>Найдите ответы на ваши вопросы или помогите другим разработчикам</p>
        <div class="cta-buttons">
          <router-link to="/ask" class="btn-primary">Задать вопрос</router-link>
          <button @click="scrollToQuestions" class="btn-secondary">Смотреть вопросы</button>
        </div>
        <div class="search-form">
          <form @submit.prevent="searchQuestions">
            <input
              type="search"
              v-model="searchQuery"
              placeholder="Поиск вопросов..."
              inputmode="search"
            />
            <button type="submit">Поиск</button>
          </form>
        </div>
      </div>
    </section>

    <section id="questions" class="questions-section">
      <div class="container">
        <div class="section-header">
          <h2>Последние вопросы</h2>
          <div class="controls">
            <div class="filter">
              <label for="tagFilter">Фильтр по тегу:</label>
              <select id="tagFilter" v-model="selectedTag" @change="filterQuestions">
                <option value="">Все теги</option>
                <option v-for="tag in tags" :key="tag.id" :value="tag.id">
                  {{ tag.name }}
                </option>
              </select>
            </div>
            <div class="sort">
              <label for="sortOptions">Сортировка:</label>
              <select id="sortOptions" v-model="sortOption" @change="sortQuestions">
                <option value="newest">Новые</option>
                <option value="votes">По голосам</option>
              </select>
            </div>
          </div>
        </div>

        <QuestionList 
          :questions="filteredQuestions" 
          :loading="loading"
          :posts="posts"
          :users="users"
          :tags="tags"
          :question-tags="questionTags"
        />

        <div class="trust-elements">
          <h3>Присоединяйтесь к сообществу разработчиков</h3>
          <div class="stats">
            <div class="stat-item">
              <div class="stat-number">1,000+</div>
              <div class="stat-label">Вопросов</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">5,000+</div>
              <div class="stat-label">Ответов</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">10,000+</div>
              <div class="stat-label">Пользователей</div>
            </div>
          </div>
          <div class="testimonials">
            <div class="testimonial">
              <p>"Благодаря этой платформе я смог быстро найти решение сложной проблемы с React компонентами."</p>
              <div class="author">Алексей К., Frontend-разработчик</div>
            </div>
            <div class="testimonial">
              <p>"Отличное сообщество профессионалов! Всегда получаю квалифицированные ответы на свои вопросы."</p>
              <div class="author">Мария С., Full Stack Developer</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import QuestionList from "../components/question/QuestionList.vue";

const questions = ref([]);
const users = ref([]);
const tags = ref([]);
const questionTags = ref([]);
const posts = ref([]);
const loading = ref(true);
const searchQuery = ref("");
const selectedTag = ref("");
const sortOption = ref("newest");

// Загрузка данных
onMounted(async () => {
  try {
    const response = await fetch("/data/main.json");
    const data = await response.json();
    
    // Получаем только посты с типом "question"
    questions.value = data.posts.filter(post => post.post_type === "question");
    users.value = data.users;
    tags.value = data.tags;
    questionTags.value = data.question_tags;
    posts.value = data.posts;
    loading.value = false;
  } catch (error) {
    console.error("Error loading data:", error);
    loading.value = false;
  }
});

// Фильтрация и сортировка вопросов
const filteredQuestions = computed(() => {
  let result = [...questions.value];
  
  // Поиск по запросу
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      question => 
        question.title.toLowerCase().includes(query) || 
        question.body.toLowerCase().includes(query)
    );
  }
  
  // Фильтр по тегу
  if (selectedTag.value) {
    const tagId = parseInt(selectedTag.value);
    const questionIds = questionTags.value
      .filter(qt => qt.tag_id === tagId)
      .map(qt => qt.question_id);
    result = result.filter(question => questionIds.includes(question.id));
  }
  
  // Сортировка
  if (sortOption.value === "newest") {
    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (sortOption.value === "votes") {
    result.sort((a, b) => b.vote_count - a.vote_count);
  }
  
  return result;
});

// Методы
const searchQuestions = () => {
  // searchQuery уже обновлен через v-model
  // фильтрация происходит автоматически через computed
};

const filterQuestions = () => {
  // selectedTag уже обновлен через v-model
  // фильтрация происходит автоматически через computed
};

const sortQuestions = () => {
  // sortOption уже обновлен через v-model
  // сортировка происходит автоматически через computed
};

const scrollToQuestions = () => {
  document.getElementById("questions").scrollIntoView({ behavior: "smooth" });
};
</script>

<style>
/* Общие стили */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  margin: 0;
  padding: 0;
  background-color: #f9f9f9;
}

/* Секция Hero */
.hero {
  background-color: #0077cc;
  color: white;
  padding: 3rem 0;
  text-align: center;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-buttons {
  margin-bottom: 2rem;
}

.btn-primary, 
.btn-secondary {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  margin: 0 0.5rem;
}

.btn-primary {
  background-color: #ff6b00;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #e65c00;
}

.btn-secondary {
  background-color: transparent;
  color: white;
  border: 2px solid white;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.search-form {
  max-width: 600px;
  margin: 0 auto;
}

.search-form form {
  display: flex;
}

.search-form input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px 0 0 4px;
  font-size: 1rem;
}

.search-form button {
  padding: 0.75rem 1.5rem;
  background-color: #ff6b00;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-form button:hover {
  background-color: #e65c00;
}

/* Секция вопросов */
.questions-section {
  padding: 3rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #333;
}

.controls {
  display: flex;
  gap: 1rem;
}

.filter, 
.sort {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter label, 
.sort label {
  font-weight: 600;
  color: #555;
}

.filter select, 
.sort select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
}

/* Элементы доверия */
.trust-elements {
  margin-top: 3rem;
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.trust-elements h3 {
  margin-top: 0;
  color: #333;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin: 2rem 0;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #0077cc;
}

.stat-label {
  color: #6a737c;
}

.testimonials {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.testimonial {
  text-align: left;
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.testimonial p {
  font-style: italic;
  color: #444;
  margin-top: 0;
}

.testimonial .author {
  font-weight: 600;
  color: #333;
}

/* Адаптивность */
@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero p {
    font-size: 1rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .controls {
    flex-direction: column;
    width: 100%;
  }
  
  .filter, 
  .sort {
    width: 100%;
  }
  
  .filter select, 
  .sort select {
    flex: 1;
  }
  
  .stats {
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style>
