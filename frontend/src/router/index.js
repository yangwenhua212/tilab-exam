import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const routes = [
  { path: '/', component: () => import('@/views/Home.vue') },
  { path: '/login', component: () => import('@/views/Login.vue') },
  { path: '/register', component: () => import('@/views/Register.vue') },
  { path: '/user', component: () => import('@/views/UserHome.vue') },
  { path: '/exam', component: () => import('@/views/Exam.vue') },
  { path: '/exam-mock', component: () => import('@/views/ExamMock.vue') },
  { path: '/error-book', component: () => import('@/views/ErrorBook.vue') },
  { path: '/stats', component: () => import('@/views/Stats.vue') },
  { path: '/admin', component: () => import('@/views/Admin.vue'), meta: { requiresAdmin: true } },
  { path: '/user-manage', component: () => import('@/views/UserManage.vue'), meta: { requiresAdmin: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  next(); // 直接放行所有路由
});

export default router