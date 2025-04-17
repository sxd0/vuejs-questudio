<template>
    <header class="app-header">
      <div class="container header-container">
        <div class="logo">
          <router-link to="/">
            <h1>QA Platform</h1>
          </router-link>
        </div>
        
        <nav class="main-nav">
          <ul>
            <li><router-link to="/">Главная</router-link></li>
            <li><router-link to="/tags">Теги</router-link></li>
            <li><router-link to="/users">Пользователи</router-link></li>
            <li><router-link to="/about">О нас</router-link></li>
            <li class="json-link"><a href="/data/main.json" target="_blank">JSON</a></li>
            <li class="repo-link"><a href="https://github.com/username/webexam2023" target="_blank">GitHub</a></li>
          </ul>
        </nav>
        
        <div class="user-actions">
          <div v-if="currentUser.isLoggedIn" class="user-info">
            <img :src="currentUser.avatar" :alt="currentUser.username" class="user-avatar">
            <span class="username">{{ currentUser.username }}</span>
            <button @click="logout" class="btn btn-secondary btn-sm">Выйти</button>
          </div>
          <div v-else class="auth-buttons">
            <button @click="showLoginForm = true" class="btn btn-secondary btn-sm">Войти</button>
            <button @click="showRegisterForm = true" class="btn btn-primary btn-sm">Регистрация</button>
          </div>
        </div>
        
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <i class="fas fa-bars"></i>
        </button>
      </div>
      
      <div v-if="isMobileMenuOpen" class="mobile-menu">
        <ul>
          <li><router-link to="/" @click="closeMobileMenu">Главная</router-link></li>
          <li><router-link to="/tags" @click="closeMobileMenu">Теги</router-link></li>
          <li><router-link to="/users" @click="closeMobileMenu">Пользователи</router-link></li>
          <li><router-link to="/about" @click="closeMobileMenu">О нас</router-link></li>
          <li><a href="/data/main.json" target="_blank" @click="closeMobileMenu">JSON</a></li>
          <li><a href="https://github.com/username/webexam2023" target="_blank" @click="closeMobileMenu">GitHub</a></li>
        </ul>
        
        <div class="mobile-user-actions">
          <div v-if="currentUser.isLoggedIn" class="user-info">
            <img :src="currentUser.avatar" :alt="currentUser.username" class="user-avatar">
            <span class="username">{{ currentUser.username }}</span>
            <button @click="logout" class="btn btn-secondary btn-sm">Выйти</button>
          </div>
          <div v-else class="auth-buttons">
            <button @click="showLoginForm = true" class="btn btn-secondary btn-block">Войти</button>
            <button @click="showRegisterForm = true" class="btn btn-primary btn-block">Регистрация</button>
          </div>
        </div>
      </div>
      
      <transition name="fade">
        <div v-if="showLoginForm" class="modal-overlay" @click.self="showLoginForm = false">
          <div class="modal">
            <div class="modal-header">
              <h3>Вход в систему</h3>
              <button class="close-btn" @click="showLoginForm = false">&times;</button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="login" class="login-form">
                <div class="form-group">
                  <label for="login-email">Email</label>
                  <input 
                    type="email" 
                    id="login-email" 
                    v-model="loginData.email" 
                    class="form-control" 
                    required
                    inputmode="email"
                  >
                </div>
                <div class="form-group">
                  <label for="login-password">Пароль</label>
                  <input 
                    type="password" 
                    id="login-password" 
                    v-model="loginData.password" 
                    class="form-control" 
                    required
                  >
                </div>
                <button type="submit" class="btn btn-primary btn-block">Войти</button>
              </form>
            </div>
          </div>
        </div>
      </transition>
      
      <transition name="fade">
        <div v-if="showRegisterForm" class="modal-overlay" @click.self="showRegisterForm = false">
          <div class="modal">
            <div class="modal-header">
              <h3>Регистрация</h3>
              <button class="close-btn" @click="showRegisterForm = false">&times;</button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="register" class="register-form">
                <div class="form-group">
                  <label for="register-username">Имя пользователя</label>
                  <input 
                    type="text" 
                    id="register-username" 
                    v-model="registerData.username" 
                    class="form-control" 
                    required
                  >
                </div>
                <div class="form-group">
                  <label for="register-email">Email</label>
                  <input 
                    type="email" 
                    id="register-email" 
                    v-model="registerData.email" 
                    class="form-control" 
                    required
                    inputmode="email"
                  >
                </div>
                <div class="form-group">
                  <label for="register-password">Пароль</label>
                  <input 
                    type="password" 
                    id="register-password" 
                    v-model="registerData.password" 
                    class="form-control" 
                    required
                  >
                </div>
                <div class="form-group">
                  <label for="register-password-confirm">Подтвердите пароль</label>
                  <input 
                    type="password" 
                    id="register-password-confirm" 
                    v-model="registerData.passwordConfirm" 
                    class="form-control" 
                    required
                  >
                </div>
                <button type="submit" class="btn btn-primary btn-block">Зарегистрироваться</button>
              </form>
            </div>
          </div>
        </div>
      </transition>
    </header>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const currentUser = ref({
    id: null,
    username: '',
    email: '',
    avatar: '',
    isLoggedIn: false,
    isAdmin: false
  });
  
  const isMobileMenuOpen = ref(false);
  const showLoginForm = ref(false);
  const showRegisterForm = ref(false);
  
  const loginData = ref({
    email: '',
    password: ''
  });
  
  const registerData = ref({
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  
  onMounted(async () => {
    try {
      const response = await axios.get('/data/main.json');
      currentUser.value = response.data.currentUser || {
        id: null,
        username: '',
        email: '',
        avatar: '',
        isLoggedIn: false,
        isAdmin: false
      };
    } catch (error) {
      console.error('Ошибка при загрузке данных пользователя:', error);
    }
  });
  
  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  };
  
  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
  };
  
  const login = () => {
    // В реальном приложении здесь будет логика авторизации
    alert(`Выполняется вход: ${loginData.value.email}`);
    showLoginForm.value = false;
    
    // Имитация успешной авторизации
    currentUser.value = {
      id: 1,
      username: 'johndoe',
      email: loginData.value.email,
      avatar: '/images/avatars/user1.jpg',
      isLoggedIn: true,
      isAdmin: false
    };
    
    // Очистка формы
    loginData.value = {
      email: '',
      password: ''
    };
  };
  
  const register = () => {
    // Валидация совпадения паролей
    if (registerData.value.password !== registerData.value.passwordConfirm) {
      alert('Пароли не совпадают!');
      return;
    }
    
    // В реальном приложении здесь будет логика регистрации
    alert(`Регистрация нового пользователя: ${registerData.value.username}`);
    showRegisterForm.value = false;
    
    // Имитация успешной регистрации
    currentUser.value = {
      id: 10,
      username: registerData.value.username,
      email: registerData.value.email,
      avatar: '/images/avatars/default.jpg',
      isLoggedIn: true,
      isAdmin: false
    };
    
    // Очистка формы
    registerData.value = {
      username: '',
      email: '',
      password: '',
      passwordConfirm: ''
    };
  };
  
  const logout = () => {
    // В реальном приложении здесь будет логика выхода
    currentUser.value = {
      id: null,
      username: '',
      email: '',
      avatar: '',
      isLoggedIn: false,
      isAdmin: false
    };
    alert('Вы вышли из системы');
  };
  </script>
  
  <style>
  .app-header {
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
  }
  
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    height: 70px;
  }
  
  .logo h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color);
    margin: 0;
  }
  
  .main-nav ul {
    display: flex;
    list-style: none;
    gap: 1.5rem;
  }
  
  .main-nav a {
    color: var(--text-color);
    font-weight: 500;
    padding: 0.5rem 0;
    position: relative;
  }
  
  .main-nav a:hover {
    color: var(--primary-color);
    text-decoration: none;
  }
  
  .main-nav a.router-link-active {
    color: var(--primary-color);
  }
  
  .main-nav a.router-link-active::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background-color: var(--primary-color);
  }
  
  .user-actions {
    display: flex;
    align-items: center;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .username {
    font-weight: 500;
  }
  
  .auth-buttons {
    display: flex;
    gap: 0.5rem;
  }
  
  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
  
  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-color);
  }
  
  .mobile-menu {
    display: none;
    background-color: #fff;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .mobile-menu ul {
    list-style: none;
    margin-bottom: 1rem;
  }
  
  .mobile-menu li {
    margin-bottom: 0.5rem;
  }
  
  .mobile-menu a {
    display: block;
    padding: 0.5rem 0;
    color: var(--text-color);
    font-weight: 500;
  }
  
  .mobile-user-actions {
    border-top: 1px solid var(--border-color);
    padding-top: 1rem;
  }
  
  .btn-block {
    display: block;
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
  }
  
  .modal {
    background-color: #fff;
    border-radius: var(--radius);
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .modal-header h3 {
    margin: 0;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-light);
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  @media (max-width: 768px) {
    .main-nav,
    .user-actions {
      display: none;
    }
    
    .mobile-menu-btn {
      display: block;
    }
    
    .mobile-menu {
      display: block;
    }
  }
  
  @media print {
    .app-header {
      display: none;
    }
  }
  </style>