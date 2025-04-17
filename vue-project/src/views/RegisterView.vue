<template>
  <div class="register-view">
    <div class="container">
      <div class="auth-container">
        <h1>Регистрация</h1>
        
        <form @submit.prevent="register" class="auth-form">
          <div class="form-group">
            <label for="username">Имя пользователя</label>
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              placeholder="Выберите имя пользователя" 
              required
            />
          </div>
          
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
              placeholder="Создайте пароль" 
              required
            />
            <div class="password-strength" v-if="password">
              <div class="strength-bar" :class="passwordStrengthClass"></div>
              <span class="strength-text">{{ passwordStrengthText }}</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Подтверждение пароля</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="confirmPassword" 
              placeholder="Повторите пароль" 
              required
            />
            <div v-if="passwordMismatch" class="error-message">
              Пароли не совпадают
            </div>
          </div>
          
          <div class="terms-agreement">
            <input type="checkbox" id="terms" v-model="agreeToTerms" required />
            <label for="terms">
              Я согласен с <a href="#">условиями использования</a> и <a href="#">политикой конфиденциальности</a>
            </label>
          </div>
          
          <button type="submit" class="btn-primary" :disabled="!isFormValid">Зарегистрироваться</button>
        </form>
        
        <div class="auth-separator">
          <span>или</span>
        </div>
        
        <div class="social-auth">
          <button class="btn-google">
            <span class="icon">G</span>
            <span>Регистрация через Google</span>
          </button>
          <button class="btn-github">
            <span class="icon">GH</span>
            <span>Регистрация через GitHub</span>
          </button>
        </div>
        
        <div class="auth-links">
          <p>Уже есть аккаунт? <router-link to="/login">Войти</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const agreeToTerms = ref(false);

// Проверка совпадения паролей
const passwordMismatch = computed(() => {
  return confirmPassword.value && password.value !== confirmPassword.value;
});

// Проверка валидности формы
const isFormValid = computed(() => {
  return username.value &&
         email.value &&
         password.value &&
         confirmPassword.value &&
         password.value === confirmPassword.value &&
         agreeToTerms.value;
});

// Определение силы пароля
const passwordStrength = computed(() => {
  if (!password.value) return 0;
  
  let strength = 0;
  
  // Длина пароля
  if (password.value.length >= 8) strength += 1;
  
  // Наличие цифр
  if (/\d/.test(password.value)) strength += 1;
  
  // Наличие строчных букв
  if (/[a-z]/.test(password.value)) strength += 1;
  
  // Наличие заглавных букв
  if (/[A-Z]/.test(password.value)) strength += 1;
  
  // Наличие специальных символов
  if (/[^a-zA-Z0-9]/.test(password.value)) strength += 1;
  
  return strength;
});

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value;
  
  if (strength <= 1) return "weak";
  if (strength <= 3) return "medium";
  return "strong";
});

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value;
  
  if (strength <= 1) return "Слабый пароль";
  if (strength <= 3) return "Средний пароль";
  return "Надежный пароль";
});

const register = () => {
  // Здесь будет логика регистрации
  // Для примера просто перенаправляем на главную
  alert("Регистрация успешно завершена!");
  router.push("/");
};
</script>

<style>
.register-view {
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

.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  height: 4px;
  border-radius: 2px;
  margin-bottom: 4px;
}

.weak {
  width: 33.33%;
  background-color: #f44336;
}

.medium {
  width: 66.66%;
  background-color: #ff9800;
}

.strong {
  width: 100%;
  background-color: #4caf50;
}

.strength-text {
  font-size: 0.75rem;
  color: #6a737c;
}

.error-message {
  color: #f44336;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.terms-agreement {
  display: flex;
  align-items: flex-start;
  margin: 1.5rem 0;
  font-size: 0.875rem;
}

.terms-agreement input[type="checkbox"] {
  margin-right: 0.5rem;
  margin-top: 0.25rem;
}

.terms-agreement a {
  color: #0077cc;
}

.terms-agreement a:hover {
  text-decoration: underline;
}

.btn-primary:disabled {
  background-color: #a3c9e5;
  cursor: not-allowed;
}
</style>
