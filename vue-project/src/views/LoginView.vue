<template>
  <div class="login-view">
    <div class="container">
      <div class="auth-container">
        <h1>Вход на сайт</h1>
        
        <form @submit.prevent="login" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              placeholder="Введите ваш email" 
              required
              inputmode="email"
            />
          </div>
          
          <div class="form-group">
            <label for="password">Пароль</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="Введите ваш пароль" 
              required
            />
          </div>
          
          <div class="form-options">
            <div class="remember-me">
              <input type="checkbox" id="remember" v-model="rememberMe" />
              <label for="remember">Запомнить меня</label>
            </div>
            <a href="#" class="forgot-password">Забыли пароль?</a>
          </div>
          
          <button type="submit" class="btn-primary">Войти</button>
        </form>
        
        <div class="auth-separator">
          <span>или</span>
        </div>
        
        <div class="social-auth">
          <button class="btn-google">
            <span class="icon">G</span>
            <span>Войти через Google</span>
          </button>
          <button class="btn-github">
            <span class="icon">GH</span>
            <span>Войти через GitHub</span>
          </button>
        </div>
        
        <div class="auth-links">
          <p>Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const rememberMe = ref(false);

const login = () => {
  // Здесь будет логика авторизации
  // Для примера просто перенаправляем на главную
  alert("Вы успешно вошли в систему");
  router.push("/");
};
</script>

<style>
.login-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px); /* Учитываем высоту шапки и подвала */
  padding: 2rem 0;
}

.auth-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

.auth-container h1 {
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

.auth-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #0077cc;
  outline: none;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me input[type="checkbox"] {
  margin-right: 0.5rem;
}

.forgot-password {
  color: #0077cc;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-primary {
  width: 100%;
  background-color: #0077cc;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #005fa3;
}

.auth-separator {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.auth-separator::before,
.auth-separator::after {
  content: "";
  position: absolute;
  top: 50%;
  width: calc(50% - 30px);
  height: 1px;
  background-color: #ddd;
}

.auth-separator::before {
  left: 0;
}

.auth-separator::after {
  right: 0;
}

.auth-separator span {
  display: inline-block;
  background-color: white;
  padding: 0 10px;
  position: relative;
  color: #6a737c;
  font-size: 0.875rem;
}

.social-auth {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.btn-google,
.btn-github {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-google:hover,
.btn-github:hover {
  background-color: #f8f9fa;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
  font-weight: bold;
}

.auth-links {
  text-align: center;
  font-size: 0.9rem;
}

.auth-links a {
  color: #0077cc;
}

.auth-links a:hover {
  text-decoration: underline;
}
</style>
