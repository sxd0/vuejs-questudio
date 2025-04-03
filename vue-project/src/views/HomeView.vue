<template>
  <div class="home">
    <v-row>
      <v-col cols="12" md="8">
        <h1 class="text-h4 mb-6">Вопросы и ответы по программированию</h1>
      
        <v-card flat class="mb-6 search-card">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="7">
                <v-autocomplete
                  v-model="searchQuery"
                  :items="searchHistory"
                  label="Поиск по вопросам"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                  @update:model-value="handleSearch"
                  hide-details
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
              
              <v-col cols="12" md="5">
                <v-row>
                  <v-col cols="6">
                    <v-select
                      v-model="selectedTag"
                      :items="tagItems"
                      label="Фильтр по тегу"
                      clearable
                      @update:model-value="filterQuestions"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                    ></v-select>
                  </v-col>
                  
                  <v-col cols="6">
                    <v-select
                      v-model="sortOption"
                      :items="sortOptions"
                      label="Сортировка"
                      @update:model-value="filterQuestions"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                    ></v-select>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        
        <div v-if="loading" class="text-center my-8">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
          <p class="mt-4 text-medium-emphasis">Загрузка вопросов...</p>
        </div>
        
        <div v-else-if="error" class="text-center error-message my-8">
          <v-icon icon="mdi-alert-circle" size="large" color="error" class="mb-4"></v-icon>
          <p class="text-body-1">{{ error }}</p>
          <v-btn color="primary" class="mt-4" @click="fetchData">Попробовать снова</v-btn>
        </div>
        
        <div v-else>
          <!-- Статистика -->
          <v-row class="mb-6">
            <v-col cols="12" sm="4">
              <v-card variant="tonal" class="text-center stat-card">
                <v-card-text>
                  <div class="text-h5">{{ getTotalQuestions }}</div>
                  <div>Всего вопросов</div>
                </v-card-text>
              </v-card>
            </v-col>
            
            <v-col cols="12" sm="4">
              <v-card variant="tonal" class="text-center stat-card">
                <v-card-text>
                  <div class="text-h5">{{ getTotalAnswers }}</div>
                  <div>Всего ответов</div>
                </v-card-text>
              </v-card>
            </v-col>
            
            <v-col cols="12" sm="4">
              <v-card variant="tonal" class="text-center stat-card">
                <v-card-text>
                  <div class="text-h5">{{ getAnsweredPercentage }}%</div>
                  <div>Вопросов с ответами</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        
          <div v-if="filteredQuestions.length === 0" class="text-center my-8">
            <v-icon icon="mdi-help-circle-outline" size="large" class="mb-4"></v-icon>
            <p class="text-body-1">Вопросы не найдены. Попробуйте изменить параметры поиска.</p>
            <v-btn 
              color="primary" 
              class="mt-4" 
              @click="resetFilters"
              prepend-icon="mdi-refresh"
            >
              Сбросить фильтры
            </v-btn>
          </div>
          
          <v-card 
            v-for="question in filteredQuestions.slice(0, visibleCount)" 
            :key="question.id" 
            class="mb-4 question-card"
            variant="outlined"
            :ripple="true"
            :to="'/question/' + question.id"
          >
            <v-card-item>
              <div class="d-flex align-center">
                <div class="question-title text-h6 d-block mb-2 text-decoration-none flex-grow-1">
                  {{ question.title }}
                </div>
                
                <v-btn
                  v-if="isBookmarked(question.id)"
                  icon
                  size="small"
                  color="warning"
                  class="ml-2"
                  @click.stop="handleToggleBookmark(question.id)"
                >
                  <v-icon>mdi-bookmark</v-icon>
                </v-btn>
                
                <v-btn
                  v-else
                  icon
                  size="small"
                  variant="text"
                  class="ml-2"
                  @click.stop="handleToggleBookmark(question.id)"
                >
                  <v-icon>mdi-bookmark-outline</v-icon>
                </v-btn>
              </div>
              
              <div class="text-body-2 text-medium-emphasis mb-2">
                {{ truncateText(question.body, 150) }}
              </div>
              
              <div>
                <v-chip
                  v-for="tagId in question.tags"
                  :key="tagId"
                  class="mr-2 mb-2"
                  size="small"
                  color="primary"
                  :value="tagId"
                  @click.stop="selectTag(getTagById(tagId))"
                >
                  {{ getTagById(tagId)?.name || 'тег' }}
                </v-chip>
              </div>
            </v-card-item>
            
            <v-divider></v-divider>
            
            <v-card-actions>
              <v-btn variant="text" size="small" @click.stop="handleVote(question.id, 'up', true)" class="pa-2">
                <v-icon>mdi-thumb-up-outline</v-icon>
                <span class="ml-1">{{ question.vote_count }}</span>
              </v-btn>
              
              <v-btn variant="text" size="small" class="pa-2">
                <v-icon>mdi-eye-outline</v-icon>
                <span class="ml-1">{{ question.views }}</span>
              </v-btn>
              
              <v-btn variant="text" size="small" class="pa-2">
                <v-icon>mdi-message-reply-outline</v-icon>
                <span class="ml-1">{{ question.answers?.length || 0 }}</span>
              </v-btn>
              
              <v-spacer></v-spacer>
              
              <v-chip
                v-if="hasAcceptedAnswer(question)"
                size="small"
                color="success"
                class="mr-2"
              >
                <v-icon start size="small">mdi-check-circle</v-icon>
                Решено
              </v-chip>
              
              <v-chip size="small" variant="text" class="text-caption">
                <v-avatar start>
                  <v-img 
                    :src="'https://ui-avatars.com/api/?name=' + (getUserById(question.author_id)?.username || 'User')" 
                    alt="User Avatar"
                  ></v-img>
                </v-avatar>
                {{ getUserById(question.author_id)?.username || 'User' }}
                <span class="ml-1 text-medium-emphasis">спрашивает {{ formatTimeAgo(question.created_at) }}</span>
              </v-chip>
            </v-card-actions>
          </v-card>
          
          <div v-if="visibleCount < filteredQuestions.length" class="text-center mt-6 mb-8">
            <v-btn
              color="primary"
              variant="outlined"
              @click="loadMoreQuestions"
              size="large"
              prepend-icon="mdi-chevron-down"
            >
              Показать ещё вопросы
            </v-btn>
          </div>
        </div>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card class="mb-6 sidebar-card">
          <v-card-title>
            <v-icon icon="mdi-tag-multiple" class="mr-2"></v-icon>
            Популярные теги
          </v-card-title>
          
          <v-card-text>
            <v-chip
              v-for="tag in getPopularTags(10)"
              :key="tag.id"
              class="mr-2 mb-2"
              :color="selectedTag === tag.id ? 'primary' : undefined"
              :variant="selectedTag === tag.id ? 'flat' : 'outlined'"
              @click="selectTag(tag)"
            >
              {{ tag.name }}
              <span class="ml-1 text-caption">{{ tag.count }}</span>
            </v-chip>
          </v-card-text>
        </v-card>
        
        <v-card class="mb-6 sidebar-card">
          <v-card-title>
            <v-icon icon="mdi-account-group" class="mr-2"></v-icon>
            Лучшие участники
          </v-card-title>
          
          <v-list>
            <v-list-item
              v-for="user in getTopUsers(5)"
              :key="user.id"
              :title="user.username"
              :subtitle="'Репутация: ' + user.reputation"
            >
              <template v-slot:prepend>
                <v-avatar color="surface-variant" size="40">
                  <v-img 
                    :src="'https://ui-avatars.com/api/?name=' + user.username.charAt(0)" 
                    alt="User Avatar"
                  ></v-img>
                </v-avatar>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
        
        <v-card v-if="bookmarks.length > 0" class="mb-6 sidebar-card">
          <v-card-title>
            <v-icon icon="mdi-bookmark-multiple" class="mr-2"></v-icon>
            Ваши закладки
          </v-card-title>
          
          <v-list>
            <v-list-item
              v-for="bookmarkId in bookmarks"
              :key="bookmarkId"
              :title="getQuestionById(bookmarkId)?.title || 'Вопрос не найден'"
              :to="'/question/' + bookmarkId"
              lines="two"
            >
              <template v-slot:prepend>
                <v-icon icon="mdi-help-circle-outline"></v-icon>
              </template>
              
              <template v-slot:append>
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  @click.stop="handleToggleBookmark(bookmarkId)"
                >
                  <v-icon>mdi-bookmark-remove</v-icon>
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
        
        <v-card class="sidebar-card">
          <v-card-title>
            <v-icon icon="mdi-information-outline" class="mr-2"></v-icon>
            О проекте
          </v-card-title>
          
          <v-card-text>
            <p>QuestUdio  это платформа вопросов и ответов для разработчиков, где вы можете задавать вопросы, делиться знаниями и находить решения ваших проблем в программировании.</p>
            
            <v-alert
              class="mt-4"
              icon="mdi-lightbulb-on"
              title="Задайте свой первый вопрос"
              text="Нажмите на кнопку + внизу страницы, чтобы создать новый вопрос и получить помощь от сообщества."
              variant="tonal"
              density="compact"
            ></v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <v-dialog v-model="showQuestionDialog" max-width="700px">
      <template v-slot:activator="{ props }">
        <v-btn 
          v-bind="props"
          color="primary" 
          position="fixed"
          location="bottom right"
          size="large"
          icon
          class="ma-4 glow-button"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      
      <QuestionForm 
        :tag-items="tagItems"
        :loading="submittingQuestion"
        @submit="handleSubmitQuestion"
        @cancel="showQuestionDialog = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import QuestionForm from '@/components/QuestionForm.vue';

export default {
  name: 'HomeView',
  components: {
    QuestionForm
  },
  data() {
    return {
      searchQuery: '',
      selectedTag: null,
      sortOption: 'newest',
      filteredQuestions: [],
      visibleCount: 5,
      showQuestionDialog: false,
      submittingQuestion: false,
      sortOptions: [
        { title: 'Новые вначале', value: 'newest' },
        { title: 'Популярные', value: 'popular' },
        { title: 'По просмотрам', value: 'views' },
        { title: 'По ответам', value: 'answers' }
      ]
    };
  },
  computed: {
    ...mapState([
      'questions', 
      'users', 
      'tags', 
      'loading', 
      'error',
      'searchHistory',
      'bookmarks',
      'currentUser'
    ]),
    ...mapGetters([
      'getUserById', 
      'getTagById', 
      'getQuestionsByTag',
      'getPopularTags',
      'getTopUsers',
      'getTotalQuestions',
      'getTotalAnswers',
      'getAnsweredPercentage',
      'getQuestionsWithAcceptedAnswers',
      'isBookmarked',
      'getQuestionById'
    ]),
    
    tagItems() {
      return this.tags.map(tag => ({
        title: tag.name,
        value: tag.id
      }));
    }
  },
  created() {
    this.fetchData().then(() => {
      this.filterQuestions();
    });
  },
  methods: {
    ...mapActions([
      'fetchData', 
      'searchQuestions', 
      'vote',
      'toggleBookmark',
      'createQuestion'
    ]),
    
    filterQuestions() {
      let result = [...this.questions];
      
      // Применяем поиск
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(q => 
          q.title.toLowerCase().includes(query) || 
          q.body.toLowerCase().includes(query)
        );
      }
      
      // Применяем фильтр по тегу
      if (this.selectedTag) {
        result = result.filter(q => 
          q.tags && q.tags.includes(this.selectedTag)
        );
      }
      
      // Применяем сортировку
      switch (this.sortOption) {
        case 'newest':
          result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
        case 'popular':
          result.sort((a, b) => b.vote_count - a.vote_count);
          break;
        case 'views':
          result.sort((a, b) => b.views - a.views);
          break;
        case 'answers':
          result.sort((a, b) => (b.answers?.length || 0) - (a.answers?.length || 0));
          break;
      }
      
      this.filteredQuestions = result;
      this.visibleCount = Math.min(5, this.filteredQuestions.length);
    },
    
    resetFilters() {
      this.searchQuery = '';
      this.selectedTag = null;
      this.sortOption = 'newest';
      this.filterQuestions();
    },
    
    loadMoreQuestions() {
      this.visibleCount = Math.min(this.visibleCount + 5, this.filteredQuestions.length);
    },
    
    truncateText(text, maxLength) {
      if (text.length <= maxLength) return text;
      return text.slice(0, maxLength) + '...';
    },
    
    formatTimeAgo(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      
      if (diffMinutes < 1) return 'только что';
      if (diffMinutes < 60) return `${diffMinutes} мин назад`;
      
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours} ч назад`;
      
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 30) return `${diffDays} дн назад`;
      
      const diffMonths = Math.floor(diffDays / 30);
      if (diffMonths < 12) return `${diffMonths} мес назад`;
      
      return `${Math.floor(diffMonths / 12)} г назад`;
    },
    
    async handleSearch(query) {
      if (query) {
        const questions = await this.searchQuestions(query);
        this.filteredQuestions = questions;
      } else {
        this.filterQuestions();
      }
    },
    
    async handleVote(id, type, isQuestion) {
      await this.vote({ id, type, isQuestion });
    },
    
    async handleToggleBookmark(questionId) {
      await this.toggleBookmark(questionId);
    },
    
    hasAcceptedAnswer(question) {
      return question.answers?.some(a => a.is_accepted);
    },
    
    selectTag(tag) {
      if (!tag) return;
      this.selectedTag = this.selectedTag === tag.id ? null : tag.id;
      this.filterQuestions();
    },
    
    async handleSubmitQuestion(questionData) {
      this.submittingQuestion = true;
      
      try {
        await this.createQuestion(questionData);
        this.showQuestionDialog = false;
        this.filterQuestions();
      } catch (error) {
        console.error('Error creating question:', error);
      } finally {
        this.submittingQuestion = false;
      }
    }
  }
};
</script>

<style scoped>
.question-title {
  transition: color 0.2s ease;
  color: inherit;
}

.question-title:hover {
  color: var(--v-theme-primary);
  text-shadow: 0 0 5px rgba(37, 99, 235, 0.2);
}

.search-card, .sidebar-card, .stat-card, .question-card {
  background-color: #121212 !important;
  border-color: #2D3748 !important;
}

.search-card {
  border: none !important;
}

.stat-card {
  background-color: #1E293B !important;
}

.glow-button {
  box-shadow: 0 0 15px rgba(37, 99, 235, 0.5) !important;
}

@media print {
  .search-section, .v-btn {
    display: none !important;
  }
}
</style>