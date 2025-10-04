export default [
  {
    path: "/summer-palace",
    name: "summer-palace",
    component: () => import("@/views/landmarks/SummerPalace.vue"),
        children: [
      {
        path: "life-cycle",
        name: "SummerPalaceLifeCycle",
        component: () => import("@/components/summer-palace/LifeCycle.vue"),
      },
      {
        path: "influence",
        name: "SummerPalaceInfluence",
        component: () => import("@/components/summer-palace/Influence.vue"),
      },
      {
        path: "legends",
        name: "SummerPalaceLegends",
        component: () => import("@/components/summer-palace/Legends.vue"),
      },
    ],
    meta: {
      title: "颐和园",
      icon: "icon-summer-palace"
    }
  }
];