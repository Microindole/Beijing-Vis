export default [
  {
    path: "/fayuan-temple",
    name: "fayuan-temple",
    component: () => import("@/views/landmarks/FayuanTemple.vue"),
    children: [
      {
        path: "life-cycle",
        name: "FayuanTempleLifeCycle",
        component: () => import("@/components/fayuan-temple/LifeCycle.vue"),
      },
      {
        path: "influence",
        name: "FayuanTempleInfluence",
        component: () => import("@/components/fayuan-temple/Influence.vue"),
      },
      {
        path: "legends",
        name: "FayuanTempleLegends",
        component: () => import("@/components/fayuan-temple/Legends.vue"),
      },
    ],
    meta: {
      title: "故宫",
      icon: "icon-fayuan-temple",
    },
  },
];
