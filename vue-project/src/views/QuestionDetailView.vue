<template>
  <div class="question-detail">
    <div v-if="loading" class="text-center my-5">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    
    <div v-else-if="error" class="text-center error-message my-5">
      {{ error }}
    </div>
    
    <div v-else-if="!question" class="text-center my-5">
      <h2>Вопрос не найден</h2>
      <v-btn color="primary" to="/" class="mt-3">Вернуться на главную</v-btn>
    </div>
    
    <div v-else>
      <v-btn color="primary" to="/" class="mb-4" variant="text">
        <v-icon left>mdi-arrow-left</v-icon> Назад к списку вопросов
      </v-btn>
      
      <!-- Вопрос -->
      <v-card class="mb-6">
        <v-card-title class="question-title text-h4">
          {{ question.title }}
        </v-card-title>
        
        <v-card-subtitle class="d-flex align-center mt-2">
          <span class="mr-4">Автор: {{ getUserById(question.author_id)?.username || 'Неизвестный пользователь' }}</span>
          <span class="mr-4">Просмотры: {{ question.views }}</span>
          <span>Опубликовано: {{ formatDate(question.created_at) }}</span>
        </v-card-subtitle>
        
        <v-card-text>
          <p class="question-body mb-4">{{ question.body }}</p>
          
          <div class="d-flex">
            <v-chip
              v-for="tagId in question.tags"
              :key="tagId"
              class="mr-2"
              color="primary"
              text-color="white"
            >
              {{ getTagById(tagId)?.name || 'Неизвестный тег' }}
            </v-chip>
          </div>
        </v-card-text>
        
        <v-card-actions>
          <v-btn icon @click="toggleVote(question.id, 'up')">
            <v-icon>mdi-thumb-up</v-icon>
          </v-btn>
          <span class="vote-count">{{ question.vote_count }}</span>
          <v-btn icon @click="toggleVote(question.id, 'down')">
            <v-icon>mdi-thumb-down</v-icon>
          </v-btn>
          
          <v-spacer></v-spacer>
          
          <v-btn color="primary" @click="showAddCommentDialog = true">
            Добавить комментарий
          </v-btn>
        </v-card-actions>
      </v-card>
      
      <!-- Ответы -->
      <h2 class="mb-4">{{ question.answers?.length || 0 }} Ответов</h2>
      
      <div v-if="question.answers && question.answers.length > 0">
        <v-card v-for="answer in question.answers" :key="answer.id" class="mb-4">
          <v-card-text>
            <p class="answer-body">{{ answer.body }}</p>
          </v-card-text>
          
          <v-card-actions>
            <v-btn icon @click="toggleVote(answer.id, 'up')">
              <v-icon>mdi-thumb-up</v-icon>
            </v-btn>
            <span class="vote-count">{{ answer.vote_count }}</span>
            <v-btn icon @click="toggleVote(answer.id, 'down')">
              <v-icon>mdi-thumb-down</v-icon>
            </v-btn>
            
            <v-spacer></v-spacer>
            
            <div class="d-flex align-center">
              <v-avatar size="24" class="mr-2">
                <v-img
                  src="https://ui-avatars.com/api/?name=J+D"
                  alt="User Avatar"
                ></v-img>
              </v-avatar>
              <span>{{ getUserById(answer.author_id)?.username || 'Неизвестный пользователь' }}</span>
              <span class="ml-2 text-caption">ответил {{ formatDate(answer.created_at) }}</span>
            </div>
            
            <v-btn
              v-if="!answer.is_accepted && question.author_id === 1"
              color="success"
              class="ml-2"
              variant="text"
              @click="acceptAnswer(answer.id)"
            >
              Принять ответ
            </v-btn>
            
            <v-chip
              v-if="answer.is_accepted"
              color="success"
              text-color="white"
              class="ml-2"
            >
              <v-icon left>mdi-check</v-icon>
              Принятый ответ
            </v-chip>
          </v-card-actions>
        </v-card>
      </div>
      
      <div v-else class="text-center my-5">
        <p>На этот вопрос еще нет ответов. Будьте первым!</p>
      </div>
      
      <!-- Форма добавления ответа -->
      <v-card class="mt-6">
        <v-card-title>Ваш ответ</v-card-title>
        
        <v-card-text>
          <v-textarea
            v-model="newAnswer"
            rows="6"
            label="Напишите свой ответ"
            hide-details
          ></v-textarea>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submitAnswer">Опубликовать ответ</v-btn>
        </v-card-actions>
      </v-card>
      
      <!-- Диалог добавления комментария -->
      <v-dialog v-model="showAddCommentDialog" max-width="600px">
        <v-card>
          <v-card-title>Добавить комментарий</v-card-title>
          
          <v-card-text>
            <v-textarea
              v-model="newComment"
              rows="3"
              label="Ваш комментарий"
              hide-details
            ></v-textarea>
          </v-card-text>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="showAddCommentDialog = false">Отмена</v-btn>
            <v-btn color="primary" @click="submitComment">Опубликовать</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
      showAddCommentDialog: false
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
      return date.toLocaleDateString();
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
      if (!this.newAnswer.trim()) return;
      
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
      // В реальном приложении здесь была бы логика сохранения комментария
      this.newComment = '';
      this.showAddCommentDialog = false;
    }
  }
};
</script>

<style scoped>
.vote-count {
  margin: 0 8px;
}

.question-body, .answer-body {
  white-space: pre-wrap;
}

@media print {
  button, .v-btn {
    display: none !important;
  }
  
  .vote-count {
    display: none;
  }
  
  .question-title {
    font-size: 24px;
    margin-bottom: 16px;
  }
  
  .v-card {
    box-shadow: none !important;
    border: 1px solid #ddd;
    margin-bottom: 20px;
  }
}
</style>