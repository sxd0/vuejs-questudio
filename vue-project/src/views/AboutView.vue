<template>
    <div class="about-view">
      <div class="page-header">
        <h1>О проекте</h1>
      </div>
      
      <div class="about-content">
        <section class="about-section card">
          <h2>Наша миссия</h2>
          <p>
            QA Platform — это сообщество программистов, объединенных общей целью: делиться знаниями и помогать друг другу в решении сложных задач. Мы верим, что коллективный разум и опыт сообщества могут помочь решить любую техническую проблему.
          </p>
          <p>
            Наша платформа создана, чтобы упростить процесс получения ответов на технические вопросы, связанные с программированием и разработкой программного обеспечения.
          </p>
        </section>
        
        <section class="about-section card">
          <h2>Как это работает</h2>
          <div class="how-it-works">
            <div class="step">
              <div class="step-icon">
                <i class="fas fa-question"></i>
              </div>
              <div class="step-content">
                <h3>Задавайте вопросы</h3>
                <p>Сформулируйте конкретный вопрос, добавьте подробности и релевантные теги</p>
              </div>
            </div>
            
            <div class="step">
              <div class="step-icon">
                <i class="fas fa-comment-dots"></i>
              </div>
              <div class="step-content">
                <h3>Получайте ответы</h3>
                <p>Эксперты сообщества предложат свои решения и рекомендации</p>
              </div>
            </div>
            
            <div class="step">
              <div class="step-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="step-content">
                <h3>Выбирайте лучшее</h3>
                <p>Голосуйте за полезные ответы и отмечайте решение, которое вам помогло</p>
              </div>
            </div>
            
            <div class="step">
              <div class="step-icon">
                <i class="fas fa-share-alt"></i>
              </div>
              <div class="step-content">
                <h3>Делитесь знаниями</h3>
                <p>Помогайте другим, отвечая на их вопросы и делясь своим опытом</p>
              </div>
            </div>
          </div>
        </section>
        
        <div class="about-two-columns">
          <section class="about-section card">
            <h2>Наше сообщество</h2>
            <p>
              Мы гордимся нашим активным и доброжелательным сообществом разработчиков всех уровней — от новичков до экспертов. Вместе мы создаем базу знаний, которая помогает решать реальные проблемы программирования и развивать навыки каждого участника.
            </p>
            <div class="community-stats">
              <div class="stat">
                <div class="stat-value">10K+</div>
                <div class="stat-label">Пользователей</div>
              </div>
              <div class="stat">
                <div class="stat-value">25K+</div>
                <div class="stat-label">Вопросов</div>
              </div>
              <div class="stat">
                <div class="stat-value">75K+</div>
                <div class="stat-label">Ответов</div>
              </div>
              <div class="stat">
                <div class="stat-value">95%</div>
                <div class="stat-label">Решено</div>
              </div>
            </div>
          </section>
          
          <section class="about-section card">
            <h2>Правила сообщества</h2>
            <ul class="rules-list">
              <li>
                <strong>Уважайте других участников</strong>
                <p>Будьте вежливы и конструктивны в общении</p>
              </li>
              <li>
                <strong>Задавайте конкретные вопросы</strong>
                <p>Четко формулируйте проблему и предоставляйте контекст</p>
              </li>
              <li>
                <strong>Избегайте дубликатов</strong>
                <p>Перед созданием нового вопроса, проверьте, не был ли он уже задан</p>
              </li>
              <li>
                <strong>Оценивайте качественный контент</strong>
                <p>Голосуйте за полезные вопросы и ответы</p>
              </li>
              <li>
                <strong>Делитесь знаниями</strong>
                <p>Отвечайте на вопросы в вашей области компетенции</p>
              </li>
            </ul>
          </section>
        </div>
        
        <section class="about-section card">
          <h2>Присоединяйтесь к нам</h2>
          <p>
            Хотите стать частью нашего сообщества? Регистрация занимает всего минуту, и вы сможете начать задавать вопросы, отвечать другим пользователям и зарабатывать репутацию.
          </p>
          <div class="cta-buttons">
            <router-link to="/" class="btn btn-primary">Начать работу</router-link>
            <router-link to="/contact" class="btn btn-secondary">Связаться с нами</router-link>
          </div>
        </section>
        
        <section class="about-section card">
          <h2>О курсовом проекте</h2>
          <p>
            Данный проект представляет собой клиентскую часть веб-приложения "Вопросы и ответы" по типу StackOverflow, разработанную в рамках курсового проекта по дисциплине "Веб-разработка на стороне клиента".
          </p>
          <p>
            Проект реализован с использованием Vue.js 3, Vue Router, Composition API и других современных веб-технологий. Все данные загружаются из JSON-файла без обращения к серверу.
          </p>
          <p>
            Репозиторий проекта доступен на <a href="https://github.com/sxd0/vuejs-questudio.git" target="_blank">GitHub</a>.
          </p>
        </section>
      </div>
    </div>
  </template>
  
  <style>
  .about-view {
    max-width: 1000px;
    margin: 0 auto;
  }
  
  .page-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .page-header h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
  }
  
  .about-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .about-section {
    padding: 2rem;
  }
  
  .about-section h2 {
    color: var(--primary-color);
    font-size: 1.8rem;
    margin-bottom: 1rem;
    position: relative;
  }
  
  .about-section h2::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 50px;
    height: 3px;
    background-color: var(--accent-color);
  }
  
  .about-section p {
    margin-bottom: 1rem;
    line-height: 1.6;
    color: var(--text-color);
  }
  
  .how-it-works {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 1.5rem;
  }
  
  .step {
    display: flex;
    gap: 1.5rem;
  }
  
  .step-icon {
    flex-shrink: 0;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
  }
  
  .step-content h3 {
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
  }
  
  .step-content p {
    color: var(--text-light);
    margin: 0;
  }
  
  .about-two-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  .community-stats {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
    text-align: center;
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: var(--primary-color);
  }
  
  .stat-label {
    color: var(--text-light);
    font-size: 0.9rem;
  }
  
  .rules-list {
    list-style: none;
    padding: 0;
  }
  
  .rules-list li {
    margin-bottom: 1.5rem;
  }
  
  .rules-list strong {
    display: block;
    margin-bottom: 0.3rem;
    color: var(--text-color);
  }
  
  .rules-list p {
    margin: 0;
    color: var(--text-light);
    font-size: 0.95rem;
  }
  
  .cta-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  @media (max-width: 768px) {
    .about-two-columns {
      grid-template-columns: 1fr;
    }
    
    .community-stats {
      flex-wrap: wrap;
      gap: 1.5rem;
    }
    
    .stat {
      width: 45%;
    }
    
    .cta-buttons {
      flex-direction: column;
    }
    
    .cta-buttons .btn {
      width: 100%;
    }
  }
  </style>