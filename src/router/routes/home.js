import HomeView from "@/views/HomeView.vue";

export default [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { 
      title: "首页",
      requiresAuth: false 
    }
  }
];