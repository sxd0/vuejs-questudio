<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>Q&A Platform</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn to="/">Главная</v-btn>
      <v-btn to="/json">JSON данные</v-btn>
      <v-btn href="https://github.com/yourusername/webexam2023-qa-site" target="_blank">
        Репозиторий
      </v-btn>
      <v-spacer></v-spacer>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar color="accent">
              <span class="text-h6">U</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>Пользователь</v-list-item-title>
            <v-list-item-subtitle>user@example.com</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>

    <v-footer app color="primary" dark>
      <v-row justify="center" no-gutters>
        <v-col class="text-center" cols="12">
          {{ new Date().getFullYear() }}  <strong>Q&A Platform</strong>
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