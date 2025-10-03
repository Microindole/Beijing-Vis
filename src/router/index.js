import { createRouter, createWebHistory } from 'vue-router'
import HistoryExplorerView from '../views/HistoryExplorerView.vue'
import InternalEvolutionView from '../views/analysis/InternalEvolutionView.vue'
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
    },
    // 添加新的路由
    {
      path: '/analysis/internal-evolution',
      name: 'internalEvolution',
      component: InternalEvolutionView,
    }
  ]
})

export default router