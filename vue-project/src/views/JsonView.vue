<template>
  <div class="json-view">
    <h1 class="text-h4 mb-6">JSON Данные</h1>
    
    <v-alert
      type="info"
      variant="tonal"
      title="О формате данных"
      text="Этот файл содержит структурированные данные в формате JSON, используемые для работы приложения."
      class="mb-6"
    ></v-alert>
    
    <v-card variant="outlined" class="json-card">
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-code-json" class="mr-2"></v-icon>
        main.json
        <v-spacer></v-spacer>
        <v-chip color="primary" size="small">application/json</v-chip>
      </v-card-title>
      
      <v-divider></v-divider>
      
      <v-card-text class="pa-0">
        <div class="pa-2">
          <v-skeleton-loader
            v-if="loading"
            type="article"
            class="my-4"
          ></v-skeleton-loader>
          
          <pre v-else class="json-content">{{ jsonContent }}</pre>
        </div>
      </v-card-text>
      
      <v-divider></v-divider>
      
      <v-card-actions>
        <v-btn
          variant="text"
          prepend-icon="mdi-download"
          @click="downloadJson"
        >
          Скачать JSON
        </v-btn>
        
        <v-btn
          variant="text"
          prepend-icon="mdi-content-copy"
          @click="copyJson"
        >
          Копировать
        </v-btn>
        
        <v-snackbar
          v-model="showSnackbar"
          :timeout="2000"
          color="success"
        >
          {{ snackbarText }}
        </v-snackbar>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'JsonView',
  data() {
    return {
      jsonContent: '',
      loading: true,
      error: null,
      showSnackbar: false,
      snackbarText: ''
    };
  },
  async created() {
    try {
      const response = await axios.get('/data/main.json');
      this.jsonContent = JSON.stringify(response.data, null, 2);
      this.loading = false;
    } catch (error) {
      this.jsonContent = 'Ошибка загрузки JSON: ' + error.message;
      this.error = error.message;
      this.loading = false;
    }
  },
  methods: {
    downloadJson() {
      const blob = new Blob([this.jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'main.json';
      link.click();
      
      this.showSnackbar = true;
      this.snackbarText = 'JSON файл успешно скачан';
    },
    
    copyJson() {
      navigator.clipboard.writeText(this.jsonContent)
        .then(() => {
          this.showSnackbar = true;
          this.snackbarText = 'JSON скопирован в буфер обмена';
        })
        .catch(err => {
          console.error('Ошибка при копировании: ', err);
          this.showSnackbar = true;
          this.snackbarText = 'Не удалось скопировать JSON';
        });
    }
  }
};
</script>

<style scoped>
.json-card {
  background-color: #121212 !important;
  border-color: #2D3748 !important;
}

.json-content {
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 70vh;
  overflow-y: auto;
  padding: 1rem;
  font-family: 'Fira Code', Consolas, Monaco, 'Andale Mono', monospace;
  border-radius: 4px;
  line-height: 1.5;
  font-size: 14px;
  background-color: #1E1E1E;
  color: #E2E8F0;
}
</style>