export default [
  {
    path: "/forbidden-city",
    name: "forbidden-city",
    component: () => import("@/views/landmarks/ForbiddenCity.vue"),
    children: [
      {
        path: "life-cycle",
        name: "ForbiddenCityLifeCycle",
        component: () => import("@/components/forbidden-city/LifeCycle.vue"),
      },
      {
        path: "influence",
        name: "ForbiddenCityInfluence",
        component: () => import("@/components/forbidden-city/Influence.vue"),
      },
      {
        path: "legends",
        name: "ForbiddenCityLegends",
        component: () => import("@/components/forbidden-city/Legends.vue"),
      },
    ],
    meta: {
      title: "故宫",
      icon: "icon-forbidden-city",
    },
  },
];
