import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/month/:id',
      name: 'monthDetail',
      component: () => import('../views/MonthDetailView.vue')
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import('../views/TimelineView.vue')
    },
    {
      path: '/checklist',
      name: 'checklist',
      component: () => import('../views/ChecklistView.vue')
    }
  ],
  scrollBehavior(_to, _from, savedPosition) {
    // 如果有保存的位置（如浏览器后退），则恢复该位置
    if (savedPosition) {
      return savedPosition
    }
    // 否则滚动到顶部
    return { top: 0, behavior: 'smooth' }
  }
})

export default router
