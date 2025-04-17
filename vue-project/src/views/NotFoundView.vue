<template>
    <div class="not-found-view">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1>Страница не найдена</h1>
        <p>К сожалению, запрашиваемая страница не существует или была перемещена.</p>
        <div class="actions">
          <router-link to="/" class="btn btn-primary">На главную</router-link>
          <button @click="goBack" class="btn btn-secondary">Назад</button>
        </div>
      </div>
      
      <div class="suggestions">
        <h2>Возможно, вас заинтересует:</h2>
        <ul class="suggestion-links">
          <li><router-link to="/">Свежие вопросы</router-link></li>
          <li><router-link to="/tags">Популярные теги</router-link></li>
          <li><router-link to="/users">Активные пользователи</router-link></li>
          <li><router-link to="/ask">Задать вопрос</router-link></li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const goBack = () => {
    router.go(-1);
  };
  </script>
  
  <style>
  .not-found-view {
    max-width: 800px;
    margin: 0 auto;
    padding: 3rem 1rem;
    text-align: center;
  }
  
  .not-found-content {
    margin-bottom: 3rem;
  }
  
  .error-code {
    font-size: 6rem;
    font-weight: bold;
    color: var(--primary-color);
    line-height: 1;
    margin-bottom: 1rem;
  }
  
  .not-found-view h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: var(--text-color);
  }
  
  .not-found-view p {
    font-size: 1.2rem;
    color: var(--text-light);
    margin-bottom: 2rem;
  }
  
  .actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
  
  .suggestions {
    background-color: var(--bg-light);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 2rem;
  }
  
  .suggestions h2 {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    position: relative;
    display: inline-block;
  }
  
  .suggestions h2::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    right: 0;
    height: 2px;
    background-color: var(--accent-color);
  }
  
  .suggestion-links {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
  }
  
  .suggestion-links a {
    color: var(--primary-color);
    font-weight: 500;
    transition: color 0.2s;
  }
  
  .suggestion-links a:hover {
    color: var(--secondary-color);
  }
  
  @media (max-width: 768px) {
    .error-code {
      font-size: 4rem;
    }
    
    .not-found-view h1 {
      font-size: 1.5rem;
    }
    
    .not-found-view p {
      font-size: 1rem;
    }
    
    .actions {
      flex-direction: column;
    }
    
    .actions .btn {
      width: 100%;
    }
    
    .suggestion-links {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
  </style>