<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <v-icon icon="mdi-help-circle-outline" class="mr-2"></v-icon>
      Задать новый вопрос
    </v-card-title>
    
    <v-divider></v-divider>
    
    <v-card-text class="pt-4">
      <v-form ref="form" v-model="isFormValid" @submit.prevent="submitQuestion">
        <v-text-field
          v-model="questionData.title"
          label="Заголовок вопроса"
          required
          counter="150"
          :rules="titleRules"
          hint="Сформулируйте вопрос так, чтобы на него можно было дать конкретный ответ"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        
        <v-textarea
          v-model="questionData.body"
          label="Подробное описание вопроса"
          required
          counter
          :rules="bodyRules"
          hint="Подробно опишите вашу проблему и что вы уже пробовали сделать"
          rows="8"
          variant="outlined"
          class="mb-4"
        ></v-textarea>
        
        <v-combobox
          v-model="questionData.tags"
          :items="tagItems"
          label="Выберите теги"
          multiple
          chips
          :rules="tagRules"
          hint="Выберите до 5 тегов, которые относятся к вашему вопросу"
          variant="outlined"
        ></v-combobox>
        
        <v-alert
          v-if="formError"
          type="error"
          variant="tonal"
          class="mt-4"
          density="compact"
          closable
          @click:close="formError = ''"
        >
          {{ formError }}
        </v-alert>
      </v-form>
    </v-card-text>
    
    <v-divider></v-divider>
    
    <v-card-actions>
      <v-btn color="error" variant="text" @click="$emit('cancel')">
        <v-icon icon="mdi-close" class="mr-1"></v-icon>
        Отмена
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn 
        color="primary" 
        @click="submitQuestion"
        :disabled="!isFormValid"
        :loading="loading"
      >
        <v-icon icon="mdi-send" class="mr-1"></v-icon>
        Опубликовать вопрос
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'QuestionForm',
  props: {
    tagItems: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isFormValid: false,
      questionData: {
        title: '',
        body: '',
        tags: []
      },
      formError: '',
      titleRules: [
        v => !!v || 'Заголовок обязателен',
        v => v.length >= 15 || 'Заголовок должен содержать не менее 15 символов',
        v => v.length <= 150 || 'Заголовок должен содержать не более 150 символов',
        v => /\?$/.test(v) || 'Заголовок должен заканчиваться знаком вопроса'
      ],
      bodyRules: [
        v => !!v || 'Описание обязательно',
        v => v.length >= 30 || 'Описание должно содержать не менее 30 символов',
        v => v.length <= 10000 || 'Описание должно содержать не более 10000 символов'
      ],
      tagRules: [
        v => v.length > 0 || 'Выберите хотя бы один тег',
        v => v.length <= 5 || 'Можно выбрать не более 5 тегов'
      ]
    };
  },
  methods: {
    async validate() {
      const isValid = await this.$refs.form.validate();
      
      if (!isValid) {
        this.formError = 'Пожалуйста, исправьте ошибки в форме';
        return false;
      }
      
      this.formError = '';
      return true;
    },
    
    async submitQuestion() {
      if (await this.validate()) {
        // Преобразуем теги в правильный формат (из объектов в ID)
        const processedTags = this.questionData.tags.map(tag => 
          typeof tag === 'object' ? tag.value : tag
        );
        
        // Отправляем данные родителю
        this.$emit('submit', {
          title: this.questionData.title,
          body: this.questionData.body,
          tags: processedTags
        });
      }
    },
    
    resetForm() {
      this.questionData = {
        title: '',
        body: '',
        tags: []
      };
      this.formError = '';
      this.$refs.form.reset();
    }
  }
};
</script>

<style scoped>
.v-card {
  background-color: #121212 !important;
}
</style>