import { createRouter, createWebHistory } from 'vue-router'

import ImpactEventView from '../views/ImpactEventView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/impact-events' 
    },
    {
      path: '/impact-events', 
      name: 'impact-events',
      component: ImpactEventView 
    }
  ]
})

export default router