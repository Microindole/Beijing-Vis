import { createRouter, createWebHistory } from 'vue-router'
import HistoryExplorerView from '../views/HistoryExplorerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/history-explorer' 
    },
    {
      path: '/history-explorer', 
      name: 'history-explorer',
      component: HistoryExplorerView 
    }
  ]
})

export default router