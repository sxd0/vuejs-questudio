<template>
    <section class="ask-question-view">
      <div class="page-header">
        <h1>Задать вопрос</h1>
        <p>Поделитесь своими знаниями, задав хорошо сформулированный вопрос</p>
      </div>
      
      <div class="question-form card">
        <form @submit.prevent="submitQuestion">
          <div class="form-group">
            <label for="question-title">Заголовок</label>
            <input 
              type="text" 
              id="question-title" 
              v-model="questionData.title" 
              class="form-control" 
              placeholder="Сформулируйте ваш вопрос кратко и ясно" 
              required
              maxlength="150"
            >
            <div class="form-helper">
              <span>Хороший заголовок делает ваш вопрос заметным</span>
              <span>{{ questionData.title.length }}/150</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="question-body">Подробное описание</label>
            <textarea 
              id="question-body" 
              v-model="questionData.body" 
              class="form-control" 
              rows="12" 
              placeholder="Опишите ваш вопрос подробно, включая все необходимые детали" 
              required
            ></textarea>
            <div class="form-helper">
              <span>Поддерживается форматирование Markdown</span>
              <span>{{ questionData.body.length }}/30000</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="question-tags">Теги</label>
            <div class="tags-input-container">
              <div class="selected-tags">
                <div v-for="(tag, index) in questionData.tags" :key="index" class="selected-tag">
                  <span>{{ tag }}</span>
                  <button type="button" @click="removeTag(index)" class="remove-tag-btn" aria-label="Удалить тег">
                    &times;
                  </button>
                </div>
              </div>
              <input 
                type="text" 
                id="question-tags" 
                v-model="tagInput" 
                @keydown.enter.prevent="addTag"
                @keydown.tab.prevent="addTag"
                @keydown.188.prevent="addTag" 
                class="form-control" 
                placeholder="Добавьте теги (через Enter или запятую)" 
              >
            </div>
            <div class="form-helper">
              <span>Добавьте до 5 тегов, описывающих о чем ваш вопрос</span>
              <span>{{ questionData.tags.length }}/5</span>
            </div>
          </div>
          
          <div class="popular-tags">
            <h3>Популярные теги:</h3>
            <div class="tags-list">
              <button 
                v-for="tag in popularTags" 
                :key="tag.id" 
                type="button" 
                class="tag-btn" 
                @click="selectTag(tag.name)"
              >
                {{ tag.name }}
              </button>
            </div>
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary" 
              :disabled="isSubmitting || !isFormValid"
            >
              {{ isSubmitting ? 'Отправка...' : 'Опубликовать вопрос' }}
            </button>
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="resetForm"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
      
      <div class="question-tips card">
        <h3>Советы по созданию хорошего вопроса</h3>
        <ul>
          <li>
            <strong>Будьте конкретны</strong>
            <p>Опишите проблему детально, включая что вы пытались сделать и какой результат ожидали.</p>
          </li>
          <li>
            <strong>Будьте краткими</strong>
            <p>Включайте только необходимую информацию, избегая лишних деталей.</p>
          </li>
          <li>
            <strong>Проверьте грамматику</strong>
            <p>Правильно оформленный вопрос легче понять и ответить.</p>
          </li>
          <li>
            <strong>Добавьте код</strong>
            <p>Если проблема связана с кодом, включите минимальный пример, воспроизводящий проблему.</p>
          </li>
          <li>
            <strong>Используйте правильные теги</strong>
            <p>Теги помогают привлечь внимание экспертов в нужной области.</p>
          </li>
        </ul>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const router = useRouter();
  
  const questionData = ref({
    title: '',
    body: '',
    tags: []
  });
  
  const tagInput = ref('');
  const isSubmitting = ref(false);
  const popularTags = ref([]);
  
  onMounted(async () => {
    try {
      const response = await axios.get('/data/main.json');
      popularTags.value = response.data.tags || [];
    } catch (error) {
      console.error('Ошибка при загрузке тегов:', error);
    }
  });
  
  const isFormValid = computed(() => {
    return (
      questionData.value.title.trim().length > 0 &&
      questionData.value.body.trim().length > 0 &&
      questionData.value.tags.length > 0
    );
  });
  
  const addTag = () => {
    const tag = tagInput.value.trim().toLowerCase();
    if (
      tag &&
      !questionData.value.tags.includes(tag) &&
      questionData.value.tags.length < 5
    ) {
      questionData.value.tags.push(tag);
    }
    tagInput.value = '';
  };
  
  const removeTag = (index) => {
    questionData.value.tags.splice(index, 1);
  };
  
  const selectTag = (tagName) => {
    if (
      !questionData.value.tags.includes(tagName) &&
      questionData.value.tags.length < 5
    ) {
      questionData.value.tags.push(tagName);
    }
  };
  
  const submitQuestion = async () => {
    if (!isFormValid.value) return;
    
    isSubmitting.value = true;
    
    // Имитация отправки данных на сервер
    setTimeout(() => {
      const newQuestion = {
        ...questionData.value,
        createdAt: new Date().toISOString()
      };
      
      // В реальном приложении здесь был бы запрос к API
      console.log('Новый вопрос:', newQuestion);
      
      // Показываем сообщение об успешной публикации
      alert('Ваш вопрос успешно опубликован!');
      
      // Перенаправляем на главную страницу
      router.push('/');
      
      isSubmitting.value = false;
    }, 1000);
  };
  
  const resetForm = () => {
    // Спрашиваем подтверждение, если форма не пуста
    if (
      questionData.value.title.trim() ||
      questionData.value.body.trim() ||
      questionData.value.tags.length
    ) {
      if (confirm('Вы уверены, что хотите отменить создание вопроса? Все введенные данные будут потеряны.')) {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  };
  </script>
  
  <style>
  .ask-question-view {
    max-width: 900px;
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
  
  .question-form {
    margin-bottom: 2rem;
  }
  
  .tags-input-container {
    display: flex;
    flex-wrap: wrap;
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 0.5rem;
    background-color: #fff;
  }
  
  .selected-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .selected-tag {
    display: flex;
    align-items: center;
    background-color: var(--accent-color);
    color: white;
    padding: 0.3rem 0.5rem;
    border-radius: var(--radius);
    font-size: 0.9rem;
    gap: 0.5rem;
  }
  
  .remove-tag-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1.2rem;
    line-height: 1;
    padding: 0;
  }
  
  .tags-input-container input {
    flex: 1;
    border: none;
    padding: 0.5rem;
    width: 100%;
  }
  
  .tags-input-container input:focus {
    outline: none;
  }
  
  .popular-tags {
    margin-bottom: 2rem;
  }
  
  .popular-tags h3 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .tag-btn {
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 0.3rem 0.5rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .tag-btn:hover {
    background-color: var(--accent-color);
    color: white;
    border-color: var(--accent-color);
  }
  
  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .question-tips {
    background-color: #f8f9fa;
  }
  
  .question-tips h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
  
  .question-tips ul {
    list-style: none;
    padding-left: 0;
  }
  
  .question-tips li {
    margin-bottom: 1rem;
  }
  
  .question-tips strong {
    display: block;
    margin-bottom: 0.3rem;
    color: var(--primary-color);
  }
  
  .question-tips p {
    margin: 0;
    color: var(--text-light);
    font-size: 0.95rem;
  }
  
  @media (max-width: 768px) {
    .form-actions {
      flex-direction: column;
    }
    
    .form-actions button {
      width: 100%;
    }
  }
  </style>