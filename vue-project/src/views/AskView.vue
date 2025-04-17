<template>
  <div class="ask-view">
    <div class="container">
      <h1>Задать вопрос</h1>
      
      <div class="tips-container">
        <h2>Советы по составлению хорошего вопроса</h2>
        <ul class="tips-list">
          <li><strong>Будьте конкретны:</strong> Точно опишите проблему и приведите код, если необходимо.</li>
          <li><strong>Проверьте правописание:</strong> Хорошо оформленные вопросы получают больше ответов.</li>
          <li><strong>Добавьте соответствующие теги:</strong> Они помогают привлечь экспертов по теме.</li>
          <li><strong>Поиск похожих вопросов:</strong> Возможно, на ваш вопрос уже есть ответ.</li>
        </ul>
      </div>
      
      <form @submit.prevent="submitQuestion" class="question-form">
        <div class="form-group">
          <label for="questionTitle">Заголовок вопроса</label>
          <input 
            type="text" 
            id="questionTitle" 
            v-model="questionTitle" 
            placeholder="Например: Как использовать Vuex в Vue 3 с Composition API?" 
            required
          />
          <div class="input-hint">Сформулируйте вопрос так, чтобы на него можно было дать конкретный ответ</div>
        </div>
        
        <div class="form-group">
          <label for="questionBody">Подробное описание вопроса</label>
          <textarea 
            id="questionBody" 
            v-model="questionBody" 
            rows="10" 
            placeholder="Опишите вашу проблему подробно. Включите код, контекст и что вы уже пытались сделать." 
            required
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="questionTags">Теги</label>
          <div class="tags-input-container">
            <div class="selected-tags">
              <span v-for="(tag, index) in selectedTags" :key="index" class="selected-tag">
                {{ tag }}
                <button type="button" @click="removeTag(index)" class="remove-tag-btn"></button>
              </span>
            </div>
            <input 
              type="text" 
              id="questionTags" 
              v-model="tagInput" 
              @keydown.enter.prevent="addTag"
              placeholder="Добавьте теги (нажмите Enter после каждого тега)" 
            />
          </div>
          <div class="input-hint">Добавьте до 5 тегов для классификации вашего вопроса</div>
          
          <div class="available-tags">
            <p>Популярные теги:</p>
            <div class="tags-list">
              <button 
                v-for="tag in availableTags" 
                :key="tag.id" 
                type="button"
                @click="selectTag(tag.name)" 
                class="tag-btn"
              >
                {{ tag.name }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn-primary">Опубликовать вопрос</button>
          <button type="button" @click="resetForm" class="btn-secondary">Сбросить</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const questionTitle = ref("");
const questionBody = ref("");
const tagInput = ref("");
const selectedTags = ref([]);
const availableTags = ref([]);

// Загрузка доступных тегов
onMounted(async () => {
  try {
    const response = await fetch("/data/main.json");
    const data = await response.json();
    availableTags.value = data.tags;
  } catch (error) {
    console.error("Error loading tags:", error);
  }
});

// Добавление тега
const addTag = () => {
  const tag = tagInput.value.trim().toLowerCase();
  
  if (tag && !selectedTags.value.includes(tag) && selectedTags.value.length < 5) {
    selectedTags.value.push(tag);
    tagInput.value = "";
  }
};

// Выбор тега из списка доступных
const selectTag = (tagName) => {
  if (!selectedTags.value.includes(tagName) && selectedTags.value.length < 5) {
    selectedTags.value.push(tagName);
  }
};

// Удаление тега
const removeTag = (index) => {
  selectedTags.value.splice(index, 1);
};

// Сброс формы
const resetForm = () => {
  questionTitle.value = "";
  questionBody.value = "";
  tagInput.value = "";
  selectedTags.value = [];
};

// Отправка вопроса
const submitQuestion = () => {
  // Здесь будет отправка вопроса на сервер
  // В нашем случае имитируем успешную публикацию
  alert("Ваш вопрос успешно опубликован!");
  
  // Перенаправление на главную страницу
  router.push("/");
};
</script>

<style>
.ask-view {
  padding: 2rem 0;
}

.ask-view h1 {
  margin-bottom: 2rem;
  color: #333;
}

.tips-container {
  background-color: #f0f8ff;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.tips-container h2 {
  font-size: 1.25rem;
  color: #0077cc;
  margin-top: 0;
  margin-bottom: 1rem;
}

.tips-list {
  margin: 0;
  padding-left: 1.5rem;
}

.tips-list li {
  margin-bottom: 0.75rem;
}

.tips-list li:last-child {
  margin-bottom: 0;
}

.question-form {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-group input[type="text"],
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input[type="text"]:focus,
.form-group textarea:focus {
  border-color: #0077cc;
  outline: none;
}

.input-hint {
  font-size: 0.875rem;
  color: #6a737c;
  margin-top: 0.5rem;
}

.tags-input-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.2s;
}

.tags-input-container:focus-within {
  border-color: #0077cc;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-right: 0.5rem;
}

.selected-tag {
  display: flex;
  align-items: center;
  background-color: #e1ecf4;
  color: #39739d;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.remove-tag-btn {
  background: none;
  border: none;
  color: #39739d;
  font-size: 1.25rem;
  cursor: pointer;
  margin-left: 0.25rem;
  line-height: 1;
}

.tags-input-container input {
  flex: 1;
  min-width: 150px;
  border: none;
  padding: 0.5rem 0;
  font-size: 1rem;
}

.tags-input-container input:focus {
  outline: none;
}

.available-tags {
  margin-top: 1rem;
}

.available-tags p {
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  font-size: 0.875rem;
  color: #555;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-btn {
  background-color: #f1f2f3;
  color: #39739d;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.tag-btn:hover {
  background-color: #e1ecf4;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #0077cc;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #005fa3;
}

.btn-secondary {
  background-color: transparent;
  color: #6a737c;
  border: 1px solid #6a737c;
}

.btn-secondary:hover {
  background-color: #f1f2f3;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>
