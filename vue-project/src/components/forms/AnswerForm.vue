<template>
    <div class="answer-form">
      <form @submit.prevent="submitAnswer">
        <div class="form-group">
          <label for="answer-body">Ваш ответ</label>
          <textarea
            id="answer-body"
            v-model="answerBody"
            class="form-control"
            rows="10"
            required
            placeholder="Введите ваш ответ здесь..."
          ></textarea>
          <div class="form-helper">
            <span>Поддерживается форматирование Markdown</span>
            <span>{{ characterCount }}/10000</span>
          </div>
        </div>
        
        <div class="form-actions">
          <button 
            type="submit" 
            class="btn btn-primary" 
            :disabled="isSubmitting || !answerBody.trim()"
          >
            {{ isSubmitting ? 'Отправка...' : 'Опубликовать ответ' }}
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
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const emit = defineEmits(['submit-answer']);
  
  const answerBody = ref('');
  const isSubmitting = ref(false);
  
  const characterCount = computed(() => {
    return answerBody.value.length;
  });
  
  const submitAnswer = async () => {
    if (!answerBody.value.trim()) return;
    
    isSubmitting.value = true;
    
    setTimeout(() => {
      const answerData = {
        body: answerBody.value,
        createdAt: new Date().toISOString()
      };
      
      emit('submit-answer', answerData);
      resetForm();
      isSubmitting.value = false;
    }, 500);
  };
  
  const resetForm = () => {
    answerBody.value = '';
  };
  </script>
  
  <style>
  .answer-form {
    background-color: var(--bg-light);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .form-helper {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    color: var(--text-light);
    margin-top: 0.5rem;
  }
  
  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
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