<template>
  <v-card variant="outlined">
    <v-card-title class="d-flex align-center">
      <v-icon icon="mdi-message-plus" class="mr-2"></v-icon>
      Ваш ответ
    </v-card-title>
    
    <v-card-text>
      <v-form ref="form" v-model="isFormValid" @submit.prevent="submitAnswer">
        <v-textarea
          v-model="answerBody"
          rows="8"
          placeholder="Напишите свой ответ..."
          variant="outlined"
          counter
          :rules="bodyRules"
          :hint="answerBody.length ? 'Ещё ' + (30 - Math.min(answerBody.length, 30)) + ' символов до минимальной длины' : ''"
          class="mb-2"
        ></v-textarea>
        
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
        
        <v-alert
          type="info"
          variant="tonal"
          title="Что делает хороший ответ?"
          text="Хороший ответ чётко и конкретно отвечает на вопрос, подкреплён примерами и объяснениями. По возможности, добавьте ссылки на официальную документацию или другие авторитетные источники."
          icon="mdi-lightbulb-on"
          class="mt-4"
          density="compact"
        ></v-alert>
      </v-form>
    </v-card-text>
    
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn 
        color="primary" 
        @click="submitAnswer"
        :disabled="!isFormValid"
        :loading="loading"
        size="large"
      >
        <v-icon icon="mdi-send" class="mr-2"></v-icon>
        Опубликовать ответ
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'AnswerForm',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      answerBody: '',
      isFormValid: false,
      formError: '',
      bodyRules: [
        v => !!v || 'Текст ответа обязателен',
        v => v.length >= 30 || 'Ответ должен содержать не менее 30 символов',
        v => v.length <= 5000 || 'Ответ должен содержать не более 5000 символов'
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
    
    async submitAnswer() {
      if (await this.validate()) {
        this.$emit('submit', this.answerBody);
      }
    },
    
    resetForm() {
      this.answerBody = '';
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