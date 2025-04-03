import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/question/:id',
      name: 'question-detail',
      component: () => import('../views/QuestionDetailView.vue')
    },
    {
      path: '/json',
      name: 'json',
      component: () => import('../views/JsonView.vue')
    }
  ]
})

export default router