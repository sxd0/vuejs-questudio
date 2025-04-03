<template>
  <v-app>
    <v-app-bar flat>
      <v-app-bar-title class="font-weight-bold">
        <v-icon icon="mdi-help-circle-outline" class="mr-2"></v-icon>
        QuestUdio
      </v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <v-btn to="/" variant="text">
        <v-icon icon="mdi-home" class="mr-1"></v-icon>
        Главная
      </v-btn>
      
      <v-btn to="/json" variant="text">
        <v-icon icon="mdi-code-json" class="mr-1"></v-icon>
        JSON
      </v-btn>
      
      <v-btn 
        href="https://github.com/yourusername/vuejs-questudio" 
        target="_blank"
        variant="text"
      >
        <v-icon icon="mdi-github" class="mr-1"></v-icon>
        Репозиторий
      </v-btn>
      
      <v-divider vertical class="mx-2"></v-divider>
      
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn class="ml-2" v-bind="props">
            <v-avatar color="primary" size="32" class="mr-2">
              <span class="text-subtitle-2 font-weight-medium">J</span>
            </v-avatar>
            <span>johndoe</span>
            <v-icon end icon="mdi-chevron-down"></v-icon>
          </v-btn>
        </template>
        
        <v-list>
          <v-list-item>
            <v-list-item-title>
              <v-icon icon="mdi-account" class="mr-2"></v-icon>
              Профиль
            </v-list-item-title>
          </v-list-item>
          
          <v-list-item>
            <v-list-item-title>
              <v-icon icon="mdi-bookmark-outline" class="mr-2"></v-icon>
              Сохраненные
            </v-list-item-title>
          </v-list-item>
          
          <v-divider></v-divider>
          
          <v-list-item>
            <v-list-item-title>
              <v-icon icon="mdi-logout" class="mr-2"></v-icon>
              Выйти
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <v-footer app class="pa-4">
      <v-row justify="center" no-gutters>
        <v-col cols="12" md="8" class="text-center">
          <div class="text-body-2">
             {{ new Date().getFullYear() }}  <strong>QuestUdio</strong>  Платформа вопросов и ответов для разработчиков
          </div>
          <div class="mt-1 text-caption text-medium-emphasis">
            Разработано с <v-icon icon="mdi-heart" size="small" color="error"></v-icon> на Vue.js
          </div>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    //
  }),
};
</script>

<style>
body {
  font-family: 'Roboto', sans-serif;
}

.v-application {
  line-height: 1.6;
}
</style>