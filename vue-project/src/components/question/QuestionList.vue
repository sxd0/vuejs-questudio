<template>
  <div class="questions-list">
    <div v-if="loading" class="loading">Загрузка вопросов...</div>
    <div v-else-if="questions.length === 0" class="no-questions">
      <slot name="empty">
        Вопросы не найдены. Попробуйте изменить параметры поиска или
        <router-link to="/ask">задайте свой вопрос</router-link>.
      </slot>
    </div>
    <div
      v-else
      v-for="question in questions"
      :key="question.id"
      class="question-card"
    >
      <div class="question-stats">
        <div class="votes">
          <span class="count">{{ question.vote_count }}</span>
          <span class="label">голосов</span>
        </div>
        <div class="answers">
          <span class="count">{{ getAnswersCount(question.id) }}</span>
          <span class="label">ответов</span>
        </div>
      </div>
      <div class="question-content">
        <h3>
          <router-link :to="{ name: 'question', params: { id: question.id } }">
            {{ question.title }}
          </router-link>
        </h3>
        <p class="excerpt">{{ truncateText(question.body, 150) }}</p>
        <div class="question-meta">
          <div class="tags">
            <span
              v-for="tagId in getQuestionTags(question.id)"
              :key="tagId"
              class="tag"
            >
              {{ getTagName(tagId) }}
            </span>
          </div>
          <div class="author">
            <span>{{ getUserName(question.user_id) }}</span>
            <span class="time">{{ formatDate(question.created_at) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  questions: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  posts: {
    type: Array,
    required: true
  },
  users: {
    type: Array,
    required: true
  },
  tags: {
    type: Array,
    required: true
  },
  questionTags: {
    type: Array,
    required: true
  }
});

// Получение количества ответов
const getAnswersCount = (questionId) => {
  return props.posts.filter(
    post => post.parent_id === questionId && post.post_type === "answer"
  ).length;
};

// Получение имени пользователя
const getUserName = (userId) => {
  const user = props.users.find(user => user.id === userId);
  return user ? user.username : "Неизвестный пользователь";
};

// Получение тегов вопроса
const getQuestionTags = (questionId) => {
  return props.questionTags
    .filter(qt => qt.question_id === questionId)
    .map(qt => qt.tag_id);
};

// Получение названия тега
const getTagName = (tagId) => {
  const tag = props.tags.find(tag => tag.id === tagId);
  return tag ? tag.name : "";
};

// Обрезка текста для превью
const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
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
</script>

<style scoped>
.questions-list {
  display: grid;
  gap: 1.5rem;
}

.loading,
.no-questions {
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.question-card {
  display: flex;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.question-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.question-stats {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  padding: 1rem;
  min-width: 80px;
  text-align: center;
}

.votes, 
.answers {
  margin-bottom: 0.5rem;
}

.count {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
}

.label {
  display: block;
  font-size: 0.75rem;
  color: #777;
}

.question-content {
  flex: 1;
  padding: 1.5rem;
}

.question-content h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.question-content h3 a {
  color: #0077cc;
  text-decoration: none;
  transition: color 0.2s;
}

.question-content h3 a:hover {
  color: #005fa3;
}

.excerpt {
  margin-bottom: 1rem;
  color: #555;
}

.question-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.author {
  font-size: 0.875rem;
  color: #6a737c;
}

.time {
  margin-left: 0.5rem;
}

@media (max-width: 768px) {
  .question-card {
    flex-direction: column;
  }
  
  .question-stats {
    flex-direction: row;
    gap: 1rem;
    padding: 0.5rem;
  }
  
  .votes, 
  .answers {
    margin-bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .question-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
