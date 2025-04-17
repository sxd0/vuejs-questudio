<template>
  <section class="comments-section">
    <h4>Комментарии ({{ comments.length }})</h4>
    <ul class="comments-list">
      <li v-for="comment in comments" :key="comment.id" class="comment">
        <p>{{ comment.body }}</p>
        <div class="comment-meta">
          <span class="comment-author">{{ getUserName(comment.user_id) }}</span>
          <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
        </div>
      </li>
    </ul>
    <form @submit.prevent="submitComment" class="comment-form">
      <div class="form-group">
        <textarea 
          v-model="newComment" 
          placeholder="Добавить комментарий..." 
          rows="2" 
          required
        ></textarea>
      </div>
      <button type="submit" class="btn-secondary">Отправить</button>
    </form>
  </section>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  comments: {
    type: Array,
    required: true
  },
  parentId: {
    type: Number,
    required: true
  },
  users: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(["add-comment"]);

const newComment = ref("");

// Отправка комментария
const submitComment = () => {
  if (!newComment.value.trim()) return;
  
  emit("add-comment", {
    parentId: props.parentId,
    text: newComment.value
  });
  
  newComment.value = "";
};

// Получение имени пользователя
const getUserName = (userId) => {
  const user = props.users.find(user => user.id === userId);
  return user ? user.username : "Неизвестный пользователь";
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
.comments-section {
  background-color: #f8f9fa;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e4e6e8;
}

h4 {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #3c4146;
}

.comments-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.comment {
  padding: 0.75rem 0;
  border-bottom: 1px solid #e4e6e8;
}

.comment:last-child {
  border-bottom: none;
}

.comment p {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
}

.comment-meta {
  color: #6a737c;
  font-size: 0.8rem;
}

.comment-author {
  font-weight: 600;
}

.comment-date {
  margin-left: 0.5rem;
}

.comment-form {
  margin-top: 1rem;
}

.comment-form textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
  font-size: 0.9rem;
}

.comment-form textarea:focus {
  border-color: #0077cc;
  outline: none;
}

.btn-secondary {
  display: inline-block;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  background-color: transparent;
  color: #6a737c;
  border: 1px solid #6a737c;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: #f1f2f3;
}

@media (max-width: 768px) {
  .btn-secondary {
    width: 100%;
  }
}
</style>
