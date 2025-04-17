<template>
  <header class="site-header" role="banner">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <router-link to="/">
            <h1>QA Platform</h1>
          </router-link>
        </div>
        <button 
          class="menu-toggle" 
          @click="toggleMenu" 
          :aria-expanded="menuOpen ? 'true' : 'false'"
          aria-controls="main-nav"
        >
          <span class="visually-hidden">Меню</span>
          <span class="menu-icon"></span>
        </button>
        <nav id="main-nav" class="main-nav" :class="{ 'is-open': menuOpen }" role="navigation" aria-label="Основная навигация">
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
            <BaseButton @click="logout" variant="danger">Выйти</BaseButton>
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
import BaseButton from "../ui/BaseButton.vue";

const currentUser = ref(null);
const menuOpen = ref(false);

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

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
  // Блокировка прокрутки страницы при открытом меню на мобильных устройствах
  if (menuOpen.value) {
    document.body.classList.add("no-scroll");
  } else {
    document.body.classList.remove("no-scroll");
  }
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

/* Скрытие меню-гамбургера по умолчанию */
.menu-toggle {
  display: none;
}

/* Вспомогательный класс для скрытия элементов визуально, но сохранения их для скринридеров */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

/* Блокировка прокрутки при открытом меню */
body.no-scroll {
  overflow: hidden;
}

@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
  }
  
  .logo {
    flex: 1;
  }
  
  .menu-toggle {
    display: block;
    background: none;
    border: none;
    width: 40px;
    height: 40px;
    position: relative;
    cursor: pointer;
    z-index: 100;
  }
  
  .menu-icon,
  .menu-icon::before,
  .menu-icon::after {
    content: "";
    display: block;
    position: absolute;
    height: 2px;
    background-color: #333;
    transition: all 0.3s;
  }
  
  .menu-icon {
    width: 24px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .menu-icon::before {
    width: 24px;
    top: -8px;
    left: 0;
  }
  
  .menu-icon::after {
    width: 24px;
    bottom: -8px;
    left: 0;
  }
  
  .menu-toggle[aria-expanded="true"] .menu-icon {
    background-color: transparent;
  }
  
  .menu-toggle[aria-expanded="true"] .menu-icon::before {
    transform: rotate(45deg);
    top: 0;
  }
  
  .menu-toggle[aria-expanded="true"] .menu-icon::after {
    transform: rotate(-45deg);
    bottom: 0;
  }
  
  .main-nav {
    display: none;
    width: 100%;
    position: absolute;
    top: 70px;
    left: 0;
    background-color: #f8f9fa;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 90;
  }
  
  .main-nav.is-open {
    display: block;
  }
  
  .main-nav ul {
    flex-direction: column;
    padding: 1rem;
  }
  
  .main-nav li {
    margin: 0 0 1rem 0;
  }
  
  .main-nav li:last-child {
    margin-bottom: 0;
  }
  
  .user-panel {
    width: 100%;
    justify-content: flex-end;
    margin-top: 1rem;
  }
}
</style>
