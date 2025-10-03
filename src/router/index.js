import { createRouter, createWebHistory } from 'vue-router'
import HistoryExplorerView from '../views/HistoryExplorerView.vue'
import InternalEvolutionView from '../views/analysis/InternalEvolutionView.vue'
import ImpactEventsView from '../views/analysis/ImpactEventsView.vue'
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
    {
      path: '/analysis/internal-evolution',
      name: 'internalEvolution',
      component: InternalEvolutionView,
    },
    {
      path: '/analysis/impact-events',
      name: 'impact-events',
      component: ImpactEventsView
    }
  ]
})

export default router