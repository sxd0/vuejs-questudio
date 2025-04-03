<template>
  <v-app>
    <v-app-bar flat>
      <v-app-bar-title class="font-weight-bold">
        <v-icon icon="mdi-help-circle-outline" class="mr-2"></v-icon>
        <span class="gradient-text">QuestUdio</span>
      </v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <v-btn to="/" variant="text" class="mx-1">
        <v-icon icon="mdi-home" class="mr-1"></v-icon>
        Главная
      </v-btn>
      
      <v-btn to="/json" variant="text" class="mx-1">
        <v-icon icon="mdi-code-json" class="mr-1"></v-icon>
        JSON
      </v-btn>
      
      <v-btn 
        href="https://github.com/sxd0/vuejs-questudio" 
        target="_blank"
        variant="text"
        class="mx-1"
      >
        <v-icon icon="mdi-github" class="mr-1"></v-icon>
        Репозиторий
      </v-btn>
      
      <v-divider vertical class="mx-2"></v-divider>
      
      <!-- Компонент уведомлений -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" class="mx-1">
            <v-badge
              :content="unreadNotificationsCount"
              :model-value="unreadNotificationsCount > 0"
              color="error"
            >
              <v-icon icon="mdi-bell-outline"></v-icon>
            </v-badge>
          </v-btn>
        </template>
        
        <v-card min-width="350" max-width="400" class="notification-menu">
          <v-card-title class="d-flex align-center">
            <span>Уведомления</span>
            <v-spacer></v-spacer>
            <v-btn 
              v-if="unreadNotificationsCount > 0" 
              variant="text" 
              size="small" 
              @click="markAllNotificationsRead"
            >
              Прочитать все
            </v-btn>
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-list v-if="notifications.length > 0" class="notification-list">
            <v-list-item
              v-for="notification in notifications"
              :key="notification.id"
              :class="{ 'unread': !notification.read }"
              @click="markNotificationRead(notification.id)"
            >
              <template v-slot:prepend>
                <v-avatar color="primary" size="36" class="mr-3">
                  <v-icon icon="mdi-bell" size="small"></v-icon>
                </v-avatar>
              </template>
              
              <v-list-item-title>{{ notification.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ notification.message }}</v-list-item-subtitle>
              
              <template v-slot:append>
                <div class="text-caption">{{ formatTimeAgo(notification.timestamp) }}</div>
              </template>
            </v-list-item>
          </v-list>
          
          <v-card-text v-else class="text-center py-4 text-medium-emphasis">
            <v-icon icon="mdi-bell-off-outline" size="large" class="mb-2"></v-icon>
            <div>Нет новых уведомлений</div>
          </v-card-text>
        </v-card>
      </v-menu>
      
      <!-- Компонент меню пользователя -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn class="ml-2" v-bind="props">
            <v-avatar color="primary" size="32" class="mr-2">
              <span class="text-subtitle-2 font-weight-medium">{{ currentUser.username.charAt(0).toUpperCase() }}</span>
            </v-avatar>
            <span>{{ currentUser.username }}</span>
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
              Закладки ({{ bookmarks.length }})
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
             {{ new Date().getFullYear() }}  <strong class="gradient-text">QuestUdio</strong>  Платформа вопросов и ответов для разработчиков
          </div>
          <div class="mt-1 text-caption text-medium-emphasis">
            Разработано Жетписовым Ансатом из 231-323 на Vue.js
          </div>
        </v-col>
      </v-row>
    </v-footer>
    
    <!-- Глобальные снэкбары для уведомлений -->
    <v-snackbar
      v-model="showSnackbar"
      :timeout="3000"
      :color="snackbarColor"
      location="top"
    >
      {{ snackbarText }}
      
      <template v-slot:actions>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="showSnackbar = false"
        ></v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import '@/assets/style.css';

export default {
  name: 'App',
  data: () => ({
    showSnackbar: false,
    snackbarText: '',
    snackbarColor: 'success'
  }),
  computed: {
    ...mapState([
      'notifications', 
      'currentUser', 
      'bookmarks',
      'darkMode'
    ]),
    
    unreadNotificationsCount() {
      return this.notifications.filter(n => !n.read).length;
    }
  },
  methods: {
    ...mapMutations([
      'MARK_NOTIFICATION_READ', 
      'MARK_ALL_NOTIFICATIONS_READ',
      'TOGGLE_DARK_MODE'
    ]),
    ...mapActions(['toggleDarkMode']),
    
    markNotificationRead(id) {
      this.MARK_NOTIFICATION_READ(id);
    },
    
    markAllNotificationsRead() {
      this.MARK_ALL_NOTIFICATIONS_READ();
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
    
    showNotification(text, color = 'success') {
      this.snackbarText = text;
      this.snackbarColor = color;
      this.showSnackbar = true;
    }
  },
  mounted() {
    // Убедимся, что вся страница имеет чёрный фон
    document.body.style.backgroundColor = '#000000';
    
    // Подписка на события для отображения уведомлений
    this.$watch(
      () => this.notifications,
      (newNotifications, oldNotifications) => {
        if (newNotifications.length > oldNotifications.length) {
          const latestNotification = newNotifications[0];
          this.showNotification(latestNotification.message);
        }
      },
      { deep: true }
    );
  }
};
</script>

<style>
body {
  font-family: 'Roboto', sans-serif;
  background-color: #000000 !important;
}

.v-application {
  line-height: 1.6;
}

.notification-list .unread {
  background-color: rgba(37, 99, 235, 0.1);
}

.notification-menu {
  background-color: #121212 !important;
  border: 1px solid #2D3748 !important;
}

.gradient-text {
  background: linear-gradient(90deg, #2563EB, #10B981);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

/* Тёмная тема для диалогов */
.v-dialog > .v-card {
  background-color: #121212 !important;
  border: 1px solid #2D3748 !important;
}
</style>