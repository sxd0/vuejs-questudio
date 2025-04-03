<template>
  <div class="home">
    <h1>Вопросы и ответы</h1>
    
    <div class="search-section mb-4">
      <v-text-field
        v-model="searchQuery"
        label="Поиск по вопросам"
        prepend-icon="mdi-magnify"
        clearable
        @input="filterQuestions"
        hide-details
      ></v-text-field>
      
      <div class="filter-sort-container mt-4">
        <v-select
          v-model="selectedTag"
          :items="tagItems"
          label="Фильтр по тегу"
          clearable
          @update:model-value="filterQuestions"
          class="mr-2"
        ></v-select>
        
        <v-select
          v-model="sortOption"
          :items="sortOptions"
          label="Сортировка"
          @update:model-value="filterQuestions"
        ></v-select>
      </div>
    </div>
    
    <div v-if="loading" class="text-center my-5">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    
    <div v-else-if="error" class="text-center error-message my-5">
      {{ error }}
    </div>
    
    <div v-else>
      <div v-if="filteredQuestions.length === 0" class="text-center my-5">
        <p>Вопросы не найдены. Попробуйте изменить параметры поиска.</p>
      </div>
      
      <v-card v-for="question in filteredQuestions" :key="question.id" class="mb-4">
        <v-card-title>
          <router-link :to="'/question/' + question.id" class="question-title">
            {{ question.title }}
          </router-link>
        </v-card-title>
        
        <v-card-text>
          <div class="mb-2">{{ truncateText(question.body, 150) }}</div>
          
          <div class="d-flex">
            <v-chip
              v-for="tagId in question.tags"
              :key="tagId"
              class="mr-2"
              color="primary"
              text-color="white"
              :value="tagId"
              @click="selectTag(getTagById(tagId))"
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
          
          <div class="d-flex align-center">
            <v-avatar size="24" class="mr-2">
              <v-img
                src="https://ui-avatars.com/api/?name=J+D"
                alt="User Avatar"
              ></v-img>
            </v-avatar>
            <span class="text-caption">{{ getUserById(question.author_id)?.username || 'Неизвестный пользователь' }}</span>
          </div>
          
          <v-spacer></v-spacer>
          
          <div class="d-flex align-center">
            <v-icon size="small" class="mr-1">mdi-eye</v-icon>
            <span class="text-caption">{{ question.views }}</span>
          </div>
          
          <div class="ml-4 d-flex align-center">
            <v-icon size="small" class="mr-1">mdi-message-reply</v-icon>
            <span class="text-caption">{{ question.answers?.length || 0 }}</span>
          </div>
        </v-card-actions>
      </v-card>
      
      <div class="text-center mt-4">
        <v-btn
          color="primary"
          variant="outlined"
          @click="loadMoreQuestions"
          :disabled="noMoreQuestions"
        >
          {{ noMoreQuestions ? 'Больше вопросов нет' : 'Загрузить еще' }}
        </v-btn>
      </div>
    </div>
    
    <v-dialog v-model="showQuestionDialog" max-width="700px">
      <template v-slot:activator="{ props }">
        <v-btn 
          v-bind="props"
          color="primary" 
          fixed 
          bottom 
          right
          fab
          class="ma-4"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      
      <v-card>
        <v-card-title>Задать новый вопрос</v-card-title>
        
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="newQuestion.title"
              label="Заголовок вопроса"
              required
            ></v-text-field>
            
            <v-textarea
              v-model="newQuestion.body"
              label="Текст вопроса"
              required
              rows="6"
            ></v-textarea>
            
            <v-select
              v-model="newQuestion.tags"
              :items="tagItems"
              label="Выберите теги"
              multiple
              chips
            ></v-select>
          </v-form>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="showQuestionDialog = false">Отмена</v-btn>
          <v-btn color="primary" @click="submitQuestion">Опубликовать</v-btn>
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
      newQuestion: {
        title: '',
        body: '',
        tags: []
      },
      sortOptions: [
        { title: 'Новые вначале', value: 'newest' },
        { title: 'Популярные', value: 'popular' },
        { title: 'По просмотрам', value: 'views' }
      ]
    };
  },
  computed: {
    ...mapState(['questions', 'users', 'tags', 'loading', 'error']),
    ...mapGetters(['getUserById', 'getTagById']),
    
    tagItems() {
      return this.tags.map(tag => ({
        title: tag.name,
        value: tag.id
      }));
    },
    
    noMoreQuestions() {
      return this.visibleCount >= this.filteredQuestions.length;
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
      }
      
      this.filteredQuestions = result;
      this.visibleCount = Math.min(5, this.filteredQuestions.length);
    },
    
    loadMoreQuestions() {
      this.visibleCount = Math.min(this.visibleCount + 5, this.filteredQuestions.length);
    },
    
    truncateText(text, maxLength) {
      if (text.length <= maxLength) return text;
      return text.slice(0, maxLength) + '...';
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
      this.selectedTag = tag.id;
      this.filterQuestions();
    },
    
    submitQuestion() {
      // Здесь была бы логика отправки нового вопроса на сервер
      // Для демонстрации добавим его локально в список вопросов
      const newQuestionObj = {
        id: Math.max(...this.questions.map(q => q.id)) + 1,
        ...this.newQuestion,
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
      this.showQuestionDialog = false;
    }
  }
};
</script>

<style scoped>
.filter-sort-container {
  display: flex;
  gap: 16px;
}

.question-title {
  color: inherit;
  text-decoration: none;
}

.question-title:hover {
  color: #1867C0;
}

.vote-count {
  margin: 0 8px;
}

@media print {
  .search-section, v-btn {
    display: none;
  }
}
</style>