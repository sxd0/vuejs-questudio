<template>
  <header class="site-header">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <router-link to="/">
            <h1>QA Platform</h1>
          </router-link>
        </div>
        <nav class="main-nav">
          <ul>
            <li><router-link to="/">Главная</router-link></li>
            <li><router-link to="/ask">Задать вопрос</router-link></li>
            <li><a href="/data/main.json" target="_blank">JSON данные</a></li>
            <li><a href="https://github.com/yourusername/qa-platform" target="_blank">GitHub репозиторий</a></li>
          </ul>
        </nav>
        <div class="user-panel">
          <div v-if="currentUser" class="logged-user">
            <span>{{ currentUser.username }}</span>
            <button @click="logout" class="btn-logout">Выйти</button>
          </div>
          <div v-else class="auth-links">
            <router-link to="/login" class="btn-login">Войти</router-link>
            <router-link to="/register" class="btn-register">Регистрация</router-link>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from "vue";

const currentUser = ref(null);

onMounted(async () => {
  try {
    const response = await fetch("/data/main.json");
    const data = await response.json();
    currentUser.value = data.current_user;
  } catch (error) {
    console.error("Error loading user data:", error);
  }
});

const logout = () => {
  currentUser.value = null;
  alert("Вы вышли из системы");
};
</script>

<style>
.site-header {
  background-color: #f8f9fa;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #0077cc;
}

.main-nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.main-nav li {
  margin-left: 1.5rem;
}

.main-nav a {
  text-decoration: none;
  color: #444;
  font-weight: 500;
  transition: color 0.2s;
}

.main-nav a:hover {
  color: #0077cc;
}

.user-panel {
  display: flex;
  align-items: center;
}

.logged-user {
  display: flex;
  align-items: center;
}

.logged-user span {
  margin-right: 0.5rem;
  font-weight: 500;
}

.btn-logout,
.btn-login,
.btn-register {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-logout {
  background-color: transparent;
  border: 1px solid #dc3545;
  color: #dc3545;
  cursor: pointer;
}

.btn-logout:hover {
  background-color: #dc3545;
  color: white;
}

.btn-login {
  background-color: transparent;
  border: 1px solid #0077cc;
  color: #0077cc;
  margin-right: 0.5rem;
}

.btn-login:hover {
  background-color: #0077cc;
  color: white;
}

.btn-register {
  background-color: #0077cc;
  border: 1px solid #0077cc;
  color: white;
}

.btn-register:hover {
  background-color: #005fa3;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .main-nav {
    margin: 1rem 0;
  }

  .main-nav ul {
    flex-direction: column;
  }

  .main-nav li {
    margin-left: 0;
    margin-bottom: 0.5rem;
  }

  .user-panel {
    margin-top: 1rem;
    align-self: flex-start;
  }
}
</style>
