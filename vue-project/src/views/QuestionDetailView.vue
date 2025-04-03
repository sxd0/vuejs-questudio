<template>
  <div class="question-detail">
    <div v-if="loading" class="text-center my-8">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
      <p class="mt-4 text-medium-emphasis">Загрузка вопроса...</p>
    </div>
    
    <div v-else-if="error" class="text-center error-message my-8">
      <v-icon icon="mdi-alert-circle" size="large" color="error" class="mb-4"></v-icon>
      <p class="text-body-1">{{ error }}</p>
      <v-btn color="primary" class="mt-4" @click="fetchData">Попробовать снова</v-btn>
    </div>
    
    <div v-else-if="!question" class="text-center my-8">
      <v-icon icon="mdi-help-circle-outline" size="large" class="mb-4"></v-icon>
      <h2 class="text-h5 mb-4">Вопрос не найден</h2>
      <p class="text-body-1 mb-6">Возможно, вопрос был удален или у вас неверная ссылка.</p>
      <v-btn color="primary" to="/" prepend-icon="mdi-arrow-left">
        Вернуться на главную
      </v-btn>
    </div>
    
    <div v-else>
      <v-breadcrumbs :items="breadcrumbs" class="px-0 py-2 mb-4"></v-breadcrumbs>
      
      <!-- Вопрос -->
      <v-card class="mb-8" variant="outlined">
        <v-card-item>
          <h1 class="text-h4 mb-2">{{ question.title }}</h1>
          
          <div class="d-flex flex-wrap text-caption text-medium-emphasis mb-4">
            <span class="mr-4">
              <v-icon icon="mdi-calendar-clock" size="small" class="mr-1"></v-icon>
              Задан {{ formatDate(question.created_at) }}
            </span>
            
            <span class="mr-4">
              <v-icon icon="mdi-eye" size="small" class="mr-1"></v-icon>
              {{ question.views }} просмотров
            </span>
            
            <span>
              <v-icon icon="mdi-thumb-up" size="small" class="mr-1"></v-icon>
              {{ question.vote_count }} голосов
            </span>
          </div>
          
          <div class="question-body text-body-1 mb-4">
            {{ question.body }}
          </div>
          
          <div class="d-flex flex-wrap mb-4">
            <v-chip
              v-for="tagId in question.tags"
              :key="tagId"
              class="mr-2 mb-2"
              size="small"
              color="primary"
            >
              {{ getTagById(tagId)?.name || 'тег' }}
            </v-chip>
          </div>
          
          <v-divider class="mb-3"></v-divider>
          
          <div class="d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <v-btn-group variant="outlined" density="comfortable">
                <v-btn @click="toggleVote(question.id, 'up')" prepend-icon="mdi-thumb-up">
                  {{ question.vote_count > 0 ? '+' + question.vote_count : question.vote_count }}
                </v-btn>
                <v-btn @click="toggleVote(question.id, 'down')" prepend-icon="mdi-thumb-down"></v-btn>
              </v-btn-group>
              
              <v-btn variant="text" class="ml-2" prepend-icon="mdi-bookmark-outline">
                Сохранить
              </v-btn>
            </div>
            
            <v-chip variant="text" size="large">
              <template v-slot:prepend>
                <v-avatar>
                  <v-img 
                    :src="'https://ui-avatars.com/api/?name=' + (getUserById(question.author_id)?.username || 'User')" 
                    alt="User Avatar"
                  ></v-img>
                </v-avatar>
              </template>
              <div>
                <div class="font-weight-medium">{{ getUserById(question.author_id)?.username || 'Неизвестный пользователь' }}</div>
                <div class="text-caption">репутация: {{ getUserById(question.author_id)?.reputation || 0 }}</div>
              </div>
            </v-chip>
          </div>
          
          <v-expand-transition>
            <div v-if="showComments" class="mt-4">
              <v-divider class="mb-3"></v-divider>
              
              <h3 class="text-subtitle-1 font-weight-medium mb-2">Комментарии:</h3>
              
              <div class="comment-list">
                <div class="comment pa-2">
                  <div class="text-body-2">Отличный вопрос! У меня была похожая проблема.</div>
                  <div class="d-flex text-caption text-medium-emphasis mt-1">
                    <span class="font-weight-medium">johndoe</span>
                    <span class="mx-1"></span>
                    <span>2 дня назад</span>
                  </div>
                </div>
                
                <div class="comment pa-2">
                  <div class="text-body-2">Возможно, стоит уточнить версию используемого фреймворка?</div>
                  <div class="d-flex text-caption text-medium-emphasis mt-1">
                    <span class="font-weight-medium">janedoe</span>
                    <span class="mx-1"></span>
                    <span>вчера</span>
                  </div>
                </div>
              </div>
              
              <v-textarea
                v-model="newComment"
                label="Добавить комментарий"
                rows="2"
                variant="outlined"
                density="comfortable"
                hide-details
                class="mt-3"
              ></v-textarea>
              
              <div class="d-flex justify-end mt-2">
                <v-btn size="small" @click="submitComment">Отправить</v-btn>
              </div>
            </div>
          </v-expand-transition>
          
          <div class="d-flex justify-center mt-3">
            <v-btn
              variant="text"
              size="small"
              @click="showComments = !showComments"
            >
              {{ showComments ? 'Скрыть комментарии' : 'Показать комментарии' }}
              <v-icon :icon="showComments ? 'mdi-chevron-up' : 'mdi-chevron-down'" class="ml-1"></v-icon>
            </v-btn>
          </div>
        </v-card-item>
      </v-card>
      
      <!-- Ответы -->
      <h2 class="text-h5 mb-4 d-flex align-center">
        <v-icon icon="mdi-message-reply" class="mr-2"></v-icon>
        {{ question.answers?.length || 0 }} Ответов
      </h2>
      
      <div v-if="question.answers && question.answers.length > 0">
        <v-card 
          v-for="answer in question.answers" 
          :key="answer.id" 
          class="mb-4"
          variant="outlined"
          :color="answer.is_accepted ? 'success' : undefined"
          :class="{'accepted-answer': answer.is_accepted}"
        >
          <v-card-item>
            <div class="answer-body text-body-1 mb-4">
              {{ answer.body }}
            </div>
            
            <v-divider class="mb-3"></v-divider>
            
            <div class="d-flex justify-space-between align-center">
              <div class="d-flex align-center">
                <v-btn-group variant="outlined" density="comfortable">
                  <v-btn @click="toggleVote(answer.id, 'up')" prepend-icon="mdi-thumb-up">
                    {{ answer.vote_count > 0 ? '+' + answer.vote_count : answer.vote_count }}
                  </v-btn>
                  <v-btn @click="toggleVote(answer.id, 'down')" prepend-icon="mdi-thumb-down"></v-btn>
                </v-btn-group>
                
                <v-btn 
                  v-if="question.author_id === 1 && !answer.is_accepted"
                  variant="text" 
                  color="success" 
                  class="ml-2" 
                  prepend-icon="mdi-check-circle-outline"
                  @click="acceptAnswer(answer.id)"
                >
                  Принять
                </v-btn>
                
                <v-chip
                  v-if="answer.is_accepted"
                  color="success"
                  class="ml-2"
                >
                  <v-icon start icon="mdi-check-circle"></v-icon>
                  Принятый ответ
                </v-chip>
              </div>
              
              <v-chip variant="text" size="large">
                <template v-slot:prepend>
                  <v-avatar>
                    <v-img 
                      :src="'https://ui-avatars.com/api/?name=' + (getUserById(answer.author_id)?.username || 'User')" 
                      alt="User Avatar"
                    ></v-img>
                  </v-avatar>
                </template>
                <div>
                  <div class="font-weight-medium">{{ getUserById(answer.author_id)?.username || 'Неизвестный пользователь' }}</div>
                  <div class="text-caption">ответил {{ formatDate(answer.created_at) }}</div>
                </div>
              </v-chip>
            </div>
          </v-card-item>
        </v-card>
      </div>
      
      <div v-else class="text-center my-8">
        <v-icon icon="mdi-message-text-outline" size="large" class="mb-4"></v-icon>
        <p class="text-body-1 mb-4">На этот вопрос еще нет ответов.</p>
        <p class="text-body-2 text-medium-emphasis mb-6">Станьте первым, кто даст ответ!</p>
      </div>
      
      <!-- Форма добавления ответа -->
      <v-card class="mt-8" variant="outlined">
        <v-card-title class="d-flex align-center">
          <v-icon icon="mdi-message-plus" class="mr-2"></v-icon>
          Ваш ответ
        </v-card-title>
        
        <v-card-text>
          <v-textarea
            v-model="newAnswer"
            rows="8"
            placeholder="Напишите свой ответ..."
            variant="outlined"
            counter
            :hint="newAnswer.length ? 'Еще ' + (30 - Math.min(newAnswer.length, 30)) + ' символов до минимальной длины' : ''"
            class="mb-2"
          ></v-textarea>
          
          <v-alert
            v-if="newAnswer.length > 0 && newAnswer.length < 30"
            type="info"
            variant="tonal"
            density="compact"
            icon="mdi-information"
            class="mb-4"
          >
            Ответ должен содержать не менее 30 символов.
          </v-alert>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            color="primary" 
            @click="submitAnswer"
            :disabled="newAnswer.length < 30"
            size="large"
          >
            Опубликовать ответ
          </v-btn>
        </v-card-actions>
      </v-card>
      
      <v-alert
        class="mt-6"
        type="info"
        variant="tonal"
        title="Что делает хороший ответ?"
        text="Хороший ответ четко и конкретно отвечает на вопрос, подкреплен примерами и объяснениями. По возможности, добавьте ссылки на официальную документацию или другие авторитетные источники."
        icon="mdi-lightbulb-on"
      ></v-alert>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'QuestionDetailView',
  data() {
    return {
      newAnswer: '',
      newComment: '',
      showComments: false
    };
  },
  computed: {
    ...mapState(['questions', 'users', 'loading', 'error']),
    ...mapGetters(['getQuestionById', 'getUserById', 'getTagById']),
    
    questionId() {
      return parseInt(this.\.params.id);
    },
    
    question() {
      return this.getQuestionById(this.questionId);
    },
    
    breadcrumbs() {
      return [
        {
          title: 'Главная',
          disabled: false,
          href: '/'
        },
        {
          title: 'Вопросы',
          disabled: false,
          href: '/'
        },
        {
          title: this.question ? this.truncateText(this.question.title, 40) : 'Загрузка...',
          disabled: true
        }
      ];
    }
  },
  created() {
    this.fetchData().then(() => {
      // Увеличиваем счетчик просмотров
      if (this.question) {
        this.question.views++;
      }
    });
  },
  methods: {
    ...mapActions(['fetchData']),
    
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    },
    
    truncateText(text, maxLength) {
      if (!text) return '';
      if (text.length <= maxLength) return text;
      return text.slice(0, maxLength) + '...';
    },
    
    toggleVote(postId, type) {
      // Находим пост (вопрос или ответ)
      let post = this.questions.find(q => q.id === postId);
      if (!post) {
        post = this.question.answers.find(a => a.id === postId);
      }
      
      if (!post) return;
      
      if (type === 'up') {
        post.vote_count++;
      } else if (type === 'down') {
        post.vote_count--;
      }
    },
    
    acceptAnswer(answerId) {
      // Находим ответ и помечаем его как принятый
      const answer = this.question.answers.find(a => a.id === answerId);
      if (answer) {
        // Сначала снимаем пометку со всех ответов
        this.question.answers.forEach(a => {
          a.is_accepted = false;
        });
        
        // Затем помечаем выбранный ответ
        answer.is_accepted = true;
      }
    },
    
    submitAnswer() {
      if (this.newAnswer.trim().length < 30) {
        return;
      }
      
      // Создаем новый ответ
      const newAnswerObj = {
        id: Math.max(...this.questions.flatMap(q => q.answers?.map(a => a.id) || [0])) + 1,
        title: '',
        body: this.newAnswer,
        author_id: 1, // Текущий пользователь
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        views: 0,
        is_closed: false,
        is_visible: true,
        is_accepted: false,
        post_type: 'answer',
        vote_count: 0,
        parent_id: this.questionId
      };
      
      // Добавляем ответ в массив ответов вопроса
      if (!this.question.answers) {
        this.question.answers = [];
      }
      
      this.question.answers.push(newAnswerObj);
      this.newAnswer = '';
    },
    
    submitComment() {
      if (!this.newComment.trim()) return;
      
      // В реальном приложении здесь была бы логика сохранения комментария
      this.newComment = '';
      
      // Эмуляция добавления комментария
      this.(() => {
        this.showComments = true;
      });
    }
  }
};
</script>

<style scoped>
.question-body, .answer-body {
  white-space: pre-wrap;
  line-height: 1.6;
}

.comment {
  border-left: 3px solid rgba(var(--v-theme-primary), 0.5);
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
  border-radius: 4px;
  margin-bottom: 8px;
}

.accepted-answer {
  border-left: 4px solid var(--v-theme-success);
}

@media print {
  .v-btn, .v-btn-group, .v-breadcrumbs {
    display: none !important;
  }
  
  .v-card {
    box-shadow: none !important;
    border: 1px solid #ddd !important;
    break-inside: avoid;
  }
  
  .question-title {
    font-size: 24px !important;
    margin-bottom: 16px !important;
  }
  
  .accepted-answer {
    border: 1px solid #2e7d32 !important;
    background-color: #f1f8e9 !important;
  }
}
</style>