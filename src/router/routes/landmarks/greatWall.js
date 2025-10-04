export default [
  {
    path: "/great-wall",
    name: "great-wall",
    component: () => import("@/views/landmarks/GreatWall.vue"),
    meta: {
      title: "长城",
      icon: "icon-great-wall",
    },
    children: [
      {
        path: "life-cycle",
        name: "GreatWallLifeCycle",
        component: () => import("@/components/GreatWall/LifeCycle.vue"),
        meta: { title: "生命年轮" }
      },
      {
        path: "influence",
        name: "GreatWallInfluence",
        component: () => import("@/components/GreatWall/Influence.vue"),
        meta: { title: "影响力光环" }
      },
      {
        path: "legends",
        name: "GreatWallLegends",
        component: () => import("@/components/GreatWall/Legends.vue"),
        meta: { title: "传奇故事" }
      }
    ]
  }
];
