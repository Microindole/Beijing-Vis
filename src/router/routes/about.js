// src/router/routes/about.js

// 使用一个布局组件来承载这些信息页面，确保样式统一
// 如果没有布局组件，可以直接使用 component: () => import(...)
const routes = [
  {
    path: '/about/intro',
    name: 'ProjectIntro',
    component: () => import('@/views/about/ProjectIntro.vue')
  },
  {
    path: '/about/team',
    name: 'TeamMembers',
    component: () => import('@/views/about/TeamMembers.vue')
  },
  {
    path: '/about/data',
    name: 'DataSource',
    component: () => import('@/views/about/DataSource.vue')
  },
  {
    path: '/about/stack',
    name: 'TechStack',
    component: () => import('@/views/about/TechStack.vue')
  }
];

export default routes;