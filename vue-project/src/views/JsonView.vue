<template>
  <div class="json-view">
    <h1>JSON Данные</h1>
    <p>Просмотр JSON-данных, используемых в приложении.</p>
    
    <v-card>
      <v-card-text>
        <pre class="json-content">{{ jsonContent }}</pre>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'JsonView',
  data() {
    return {
      jsonContent: 'Загрузка данных...'
    };
  },
  async created() {
    try {
      const response = await axios.get('/data/main.json');
      this.jsonContent = JSON.stringify(response.data, null, 2);
    } catch (error) {
      this.jsonContent = 'Ошибка загрузки JSON: ' + error.message;
    }
  }
};
</script>

<style scoped>
.json-content {
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 70vh;
  overflow-y: auto;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-family: monospace;
}
</style>