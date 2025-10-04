export default [
  {
    path: "/temple-of-heaven",
    name: "temple-of-heaven",
    component: () => import("@/views/landmarks/TempleOfHeaven.vue"),
    children: [
      {
        path: "life-cycle",
        name: "LifeCycle",
        component: () => import("@/components/temple-of-heaven/LifeCycle.vue"),
      },
      {
        path: "influence",
        name: "Influence",
        component: () => import("@/components/temple-of-heaven/Influence.vue"),
      },
      {
        path: "legends",
        name: "Legends",
        component: () => import("@/components/temple-of-heaven/Legends.vue"),
      },
    ],
    meta: {
      title: "天坛",
      icon: "icon-temple-of-heaven",
    },
  },
];
