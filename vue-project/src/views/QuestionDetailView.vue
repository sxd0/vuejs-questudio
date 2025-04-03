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
      <p class="text-body-1 mb-6">Возможно, вопрос был удалён или у вас неверная ссылка.</p>
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
          
          <div class="d-flex justify-space-between align-center flex-wrap">
            <div class="d-flex align-center mb-2">
              <v-btn-group variant="outlined" density="comfortable">
                <v-btn @click="handleVote(question.id, 'up', true)" prepend-icon="mdi-thumb-up">
                  {{ question.vote_count > 0 ? '+' + question.vote_count : question.vote_count }}
                </v-btn>
                <v-btn @click="handleVote(question.id, 'down', true)" prepend-icon="mdi-thumb-down"></v-btn>
              </v-btn-group>
              
              <v-btn 
                variant="text" 
                class="ml-2" 
                :prepend-icon="isBookmarked(questionId) ? 'mdi-bookmark' : 'mdi-bookmark-outline'"
                :color="isBookmarked(questionId) ? 'warning' : undefined"
                @click="handleToggleBookmark(questionId)"
              >
                {{ isBookmarked(questionId) ? 'Сохранено' : 'Сохранить' }}
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
      
      <!-- Статистика -->
      <v-row class="mb-6">
        <v-col cols="12" sm="4">
          <v-card variant="tonal" class="text-center">
            <v-card-text>
              <div class="text-h5">{{ answersCount }}</div>
              <div>Ответов</div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" sm="4">
          <v-card variant="tonal" class="text-center">
            <v-card-text>
              <div class="text-h5">{{ acceptedAnswer ? 'Да' : 'Нет' }}</div>
              <div>Принятый ответ</div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" sm="4">
          <v-card variant="tonal" class="text-center">
            <v-card-text>
              <div class="text-h5">
                {{ Math.floor((new Date() - new Date(question.created_at)) / (1000 * 60 * 60 * 24)) }}
              </div>
              <div>Дней активен</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Ответы -->
      <h2 class="text-h5 mb-4 d-flex align-center">
        <v-icon icon="mdi-message-reply" class="mr-2"></v-icon>
        {{ answersCount }} Ответов
      </h2>
      
      <div v-if="answers && answers.length > 0">
        <v-card 
          v-for="answer in answers" 
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
            
            <div class="d-flex justify-space-between align-center flex-wrap">
              <div class="d-flex align-center mb-2">
                <v-btn-group variant="outlined" density="comfortable">
                  <v-btn @click="handleVote(answer.id, 'up', false)" prepend-icon="mdi-thumb-up">
                    {{ answer.vote_count > 0 ? '+' + answer.vote_count : answer.vote_count }}
                  </v-btn>
                  <v-btn @click="handleVote(answer.id, 'down', false)" prepend-icon="mdi-thumb-down"></v-btn>
                </v-btn-group>
                
                <v-btn 
                  v-if="question.author_id === currentUser.id && !answer.is_accepted"
                  variant="text" 
                  color="success" 
                  class="ml-2" 
                  prepend-icon="mdi-check-circle-outline"
                  @click="handleAcceptAnswer(answer.id)"
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
        <p class="text-body-1 mb-4">На этот вопрос ещё нет ответов.</p>
        <p class="text-body-2 text-medium-emphasis mb-6">Станьте первым, кто даст ответ!</p>
      </div>
      
      <!-- Форма добавления ответа -->
      <AnswerForm 
        class="mt-8"
        :loading="submittingAnswer"
        @submit="handleSubmitAnswer"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import AnswerForm from '@/components/AnswerForm.vue';

export default {
  name: 'QuestionDetailView',
  components: {
    AnswerForm
  },
  data() {
    return {
      newComment: '',
      showComments: false,
      submittingAnswer: false
    };
  },
  computed: {
    ...mapState(['questions', 'users', 'loading', 'error', 'currentUser']),
    ...mapGetters(['getQuestionById', 'getUserById', 'getTagById', 'isBookmarked']),
    
    questionId() {
      return parseInt(this.$route.params.id);
    },
    
    question() {
      return this.getQuestionById(this.questionId);
    },
    
    answers() {
      return this.question?.answers || [];
    },
    
    answersCount() {
      return this.answers.length;
    },
    
    acceptedAnswer() {
      return this.answers.find(a => a.is_accepted);
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
      if (this.question) {
        this.viewQuestion(this.questionId);
      }
    });
  },
  methods: {
    ...mapActions([
      'fetchData', 
      'vote', 
      'acceptAnswer', 
      'createAnswer',
      'viewQuestion',
      'toggleBookmark'
    ]),
    
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
    
    async handleVote(id, type, isQuestion) {
      await this.vote({ id, type, isQuestion });
    },
    
    async handleAcceptAnswer(answerId) {
      await this.acceptAnswer({ 
        questionId: this.questionId, 
        answerId 
      });
    },
    
    async handleSubmitAnswer(answerBody) {
      this.submittingAnswer = true;
      
      const answerData = {
        title: '',
        body: answerBody
      };
      
      try {
        await this.createAnswer({ 
          questionId: this.questionId, 
          answerData 
        });
        
        // Форма будет сброшена через ref в компоненте
        this.$refs.answerForm?.resetForm();
      } catch (error) {
        console.error('Error submitting answer:', error);
      } finally {
        this.submittingAnswer = false;
      }
    },
    
    submitComment() {
      if (!this.newComment.trim()) return;
      
      // В реальном приложении здесь была бы логика сохранения комментария
      this.newComment = '';
      
      // Эмуляция добавления комментария
      this.$nextTick(() => {
        this.showComments = true;
      });
    },
    
    async handleToggleBookmark(questionId) {
      await this.toggleBookmark(questionId);
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
  border-left: 3px solid rgba(37, 99, 235, 0.5);
  background-color: rgba(30, 41, 59, 0.3);
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
    border: 1px solid #2D3748 !important;
    break-inside: avoid;
  }
  
  .question-title {
    font-size: 24px !important;
    margin-bottom: 16px !important;
  }
  
  .accepted-answer {
    border: 1px solid #10B981 !important;
    background-color: rgba(16, 185, 129, 0.1) !important;
  }
}
</style>