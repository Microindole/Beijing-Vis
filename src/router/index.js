import { createRouter, createWebHistory } from "vue-router";
import homeRoutes from "./routes/home";
import landmarkRoutes from "./routes/landmarks";
import notFoundRoute from "./routes/notFound";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...homeRoutes,
    ...landmarkRoutes,
    ...notFoundRoute
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  }
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} | 景区导览系统`;
  }
  next();
});

export default router;