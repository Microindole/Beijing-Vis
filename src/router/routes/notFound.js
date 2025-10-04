export default [
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/NotFound.vue"),
    meta: {
      title: "页面未找到",
      hideInMenu: true
    }
  }
];