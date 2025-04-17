<template>
    <footer class="app-footer">
      <div class="container footer-container">
        <div class="footer-content">
          <div class="footer-logo">
            <h2>QA Platform</h2>
            <p>Сообщество программистов для обмена знаниями</p>
          </div>
          
          <div class="footer-links">
            <div class="footer-section">
              <h3>Навигация</h3>
              <ul>
                <li><router-link to="/">Главная</router-link></li>
                <li><router-link to="/tags">Теги</router-link></li>
                <li><router-link to="/users">Пользователи</router-link></li>
                <li><router-link to="/about">О нас</router-link></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h3>Ресурсы</h3>
              <ul>
                <li><a href="/data/main.json" target="_blank">JSON данные</a></li>
                <li><a href="https://github.com/username/webexam2023" target="_blank">GitHub репозиторий</a></li>
                <li><router-link to="/faq">FAQ</router-link></li>
                <li><router-link to="/contact">Контакты</router-link></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h3>Социальные сети</h3>
              <ul class="social-links">
                <li><a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a></li>
                <li><a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a></li>
                <li><a href="#" aria-label="GitHub"><i class="fab fa-github"></i></a></li>
                <li><a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="newsletter">
          <h3>Подпишитесь на нашу рассылку</h3>
          <p>Получайте самые интересные вопросы и ответы каждую неделю</p>
          <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
            <div class="form-group">
              <input 
                type="email" 
                v-model="email" 
                placeholder="Ваш email" 
                class="form-control" 
                required
                inputmode="email"
              >
            </div>
            <button type="submit" class="btn btn-primary">Подписаться</button>
          </form>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2025 QA Platform. Все права защищены.</p>
          <div class="footer-legal">
            <router-link to="/terms">Условия использования</router-link>
            <router-link to="/privacy">Политика конфиденциальности</router-link>
          </div>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const email = ref('');
  
  const subscribeNewsletter = () => {
    // В реальном приложении здесь будет логика подписки на рассылку
    alert(`Спасибо за подписку! Email: ${email.value}`);
    email.value = '';
  };
  </script>
  
  <style>
  .app-footer {
    background-color: var(--text-color);
    color: #fff;
    padding: 3rem 0 1rem;
    margin-top: 2rem;
  }
  
  .footer-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .footer-content {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
  }
  
  .footer-logo {
    flex: 1;
    min-width: 250px;
  }
  
  .footer-logo h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #fff;
  }
  
  .footer-logo p {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .footer-links {
    flex: 2;
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
  }
  
  .footer-section {
    flex: 1;
    min-width: 150px;
  }
  
  .footer-section h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: #fff;
  }
  
  .footer-section ul {
    list-style: none;
  }
  
  .footer-section li {
    margin-bottom: 0.5rem;
  }
  
  .footer-section a {
    color: rgba(255, 255, 255, 0.7);
    transition: color 0.2s;
  }
  
  .footer-section a:hover {
    color: #fff;
    text-decoration: none;
  }
  
  .social-links {
    display: flex;
    gap: 1rem;
  }
  
  .social-links i {
    font-size: 1.5rem;
  }
  
  .newsletter {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 2rem;
  }
  
  .newsletter h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
  
  .newsletter p {
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 1rem;
  }
  
  .newsletter-form {
    display: flex;
    gap: 0.5rem;
    max-width: 500px;
  }
  
  .newsletter-form .form-group {
    flex: 1;
  }
  
  .footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 1rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }
  
  .footer-legal {
    display: flex;
    gap: 1rem;
  }
  
  .footer-legal a {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .footer-legal a:hover {
    color: #fff;
  }
  
  @media (max-width: 768px) {
    .footer-content {
      flex-direction: column;
    }
    
    .newsletter-form {
      flex-direction: column;
    }
    
    .footer-bottom {
      flex-direction: column;
      text-align: center;
    }
    
    .footer-legal {
      justify-content: center;
    }
  }
  
  @media print {
    .app-footer {
      display: none;
    }
  }
  </style>