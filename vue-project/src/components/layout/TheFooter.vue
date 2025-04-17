<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-content">
        <div class="copyright">
          <p>&copy; 2024 QA Platform. Все права защищены.</p>
        </div>
        <div class="footer-links">
          <a href="#">О нас</a>
          <a href="#">Правила сайта</a>
          <a href="#">Конфиденциальность</a>
          <a href="#">Контакты</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style>
.site-footer {
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 2rem 0;
  margin-top: 3rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright p {
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 1rem;
}

.footer-links a {
  color: #ecf0f1;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #3498db;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
