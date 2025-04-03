<template>
  <div class="home">
    <v-row>
      <v-col cols="12" md="8">
        <h1 class="text-h4 mb-6">Вопросы и ответы по программированию</h1>
      
        <v-card flat class="mb-6">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="7">
                <v-text-field
                  v-model="searchQuery"
                  label="Поиск по вопросам"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                  @input="filterQuestions"
                  hide-details
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
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
            class="mb-4"
            variant="outlined"
            :ripple="true"
          >
            <v-card-item>
              <router-link 
                :to="'/question/' + question.id" 
                class="question-title text-h6 d-block mb-2 text-decoration-none"
              >
                {{ question.title }}
              </router-link>
              
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
              <v-btn variant="text" size="small" @click="toggleVote(question.id, 'up')" class="pa-2">
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
              Показать еще вопросы
            </v-btn>
          </div>
        </div>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card class="mb-6">
          <v-card-title>
            <v-icon icon="mdi-tag-multiple" class="mr-2"></v-icon>
            Популярные теги
          </v-card-title>
          
          <v-card-text>
            <v-chip
              v-for="tag in tags"
              :key="tag.id"
              class="mr-2 mb-2"
              :color="selectedTag === tag.id ? 'primary' : 'default'"
              :variant="selectedTag === tag.id ? 'flat' : 'outlined'"
              @click="selectTag(tag)"
            >
              {{ tag.name }}
              <span class="ml-1 text-caption">{{ getQuestionCountByTag(tag.id) }}</span>
            </v-chip>
          </v-card-text>
        </v-card>
        
        <v-card class="mb-6">
          <v-card-title>
            <v-icon icon="mdi-account-group" class="mr-2"></v-icon>
            Лучшие участники
          </v-card-title>
          
          <v-list>
            <v-list-item
              v-for="user in topUsers"
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
        
        <v-card>
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
          class="ma-4"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon icon="mdi-help-circle-outline" class="mr-2"></v-icon>
          Задать новый вопрос
        </v-card-title>
        
        <v-divider></v-divider>
        
        <v-card-text class="pt-4">
          <v-form ref="form">
            <v-text-field
              v-model="newQuestion.title"
              label="Заголовок вопроса"
              required
              counter="150"
              hint="Сформулируйте вопрос так, чтобы на него можно было дать конкретный ответ"
              variant="outlined"
              class="mb-4"
            ></v-text-field>
            
            <v-textarea
              v-model="newQuestion.body"
              label="Подробное описание вопроса"
              required
              counter
              hint="Подробно опишите вашу проблему и что вы уже пробовали сделать"
              rows="8"
              variant="outlined"
              class="mb-4"
            ></v-textarea>
            
            <v-combobox
              v-model="newQuestion.tags"
              :items="tagItems"
              label="Выберите теги"
              multiple
              chips
              hint="Выберите до 5 тегов, которые относятся к вашему вопросу"
              variant="outlined"
            ></v-combobox>
          </v-form>
        </v-card-text>
        
        <v-divider></v-divider>
        
        <v-card-actions>
          <v-btn color="default" variant="text" @click="showQuestionDialog = false">
            <v-icon icon="mdi-close" class="mr-1"></v-icon>
            Отмена
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn 
            color="primary" 
            @click="submitQuestion"
            :disabled="!isQuestionFormValid"
            :loading="submittingQuestion"
          >
            <v-icon icon="mdi-send" class="mr-1"></v-icon>
            Опубликовать вопрос
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'HomeView',
  data() {
    return {
      searchQuery: '',
      selectedTag: null,
      sortOption: 'newest',
      filteredQuestions: [],
      visibleCount: 5,
      showQuestionDialog: false,
      submittingQuestion: false,
      newQuestion: {
        title: '',
        body: '',
        tags: []
      },
      sortOptions: [
        { title: 'Новые вначале', value: 'newest' },
        { title: 'Популярные', value: 'popular' },
        { title: 'По просмотрам', value: 'views' },
        { title: 'По ответам', value: 'answers' }
      ]
    };
  },
  computed: {
    ...mapState(['questions', 'users', 'tags', 'loading', 'error']),
    ...mapGetters(['getUserById', 'getTagById', 'getQuestionsByTag']),
    
    tagItems() {
      return this.tags.map(tag => ({
        title: tag.name,
        value: tag.id
      }));
    },
    
    topUsers() {
      return [...this.users]
        .sort((a, b) => b.reputation - a.reputation)
        .slice(0, 5);
    },
    
    isQuestionFormValid() {
      return (
        this.newQuestion.title.trim().length >= 15 &&
        this.newQuestion.body.trim().length >= 30 &&
        this.newQuestion.tags.length > 0
      );
    }
  },
  created() {
    this.fetchData().then(() => {
      this.filterQuestions();
    });
  },
  methods: {
    ...mapActions(['fetchData']),
    
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
    
    toggleVote(questionId, type) {
      const question = this.questions.find(q => q.id === questionId);
      if (!question) return;
      
      if (type === 'up') {
        question.vote_count++;
      } else if (type === 'down') {
        question.vote_count--;
      }
    },
    
    selectTag(tag) {
      if (!tag) return;
      this.selectedTag = this.selectedTag === tag.id ? null : tag.id;
      this.filterQuestions();
    },
    
    getQuestionCountByTag(tagId) {
      return this.questions.filter(question => 
        question.tags && question.tags.includes(tagId)
      ).length;
    },
    
    async submitQuestion() {
      if (!this.isQuestionFormValid) return;
      
      this.submittingQuestion = true;
      
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Создаем новый вопрос
      const newQuestionObj = {
        id: Math.max(...this.questions.map(q => q.id)) + 1,
        title: this.newQuestion.title,
        body: this.newQuestion.body,
        tags: this.newQuestion.tags.map(tag => 
          typeof tag === 'object' ? tag.value : tag
        ),
        author_id: 1, // Текущий пользователь
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        views: 0,
        is_closed: false,
        is_visible: true,
        is_accepted: false,
        post_type: 'question',
        vote_count: 0,
        answers: []
      };
      
      this.questions.unshift(newQuestionObj);
      this.filterQuestions();
      
      // Сбрасываем форму
      this.newQuestion = {
        title: '',
        body: '',
        tags: []
      };
      
      this.submittingQuestion = false;
      this.showQuestionDialog = false;
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
  color: var(--v-primary-base);
}

@media print {
  .search-section, .v-btn {
    display: none !important;
  }
}
</style>