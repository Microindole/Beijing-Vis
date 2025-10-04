export default [
  {
    path: "/ming-tombs",
    name: "ming-tombs",
    component: () => import("@/views/landmarks/MingTombs.vue"),
    meta: {
      title: "故宫",
      icon: "icon-ming-tombs",
    },
    props: true,
    children: [
      {
        path: "life-cycle",
        name: "MingTombsLifeCycle",
        component: () => import("@/components/ming-tombs/LifeCycle.vue"),
        props: true,
        meta: {
          title: "景区详情",
          dynamic: true,
        },
      },
      {
        path: "influence",
        name: "MingTombsInfluence",
        component: () => import("@/components/ming-tombs/Influence.vue"),
        props: true,
        meta: {
          title: "影响力雷达图",
          dynamic: true,
        },
      },
      {
        path: "legends",
        name: "MingTombsLegends",
        component: () => import("@/components/ming-tombs/Legends.vue"),
        props: true,
        meta: {
          title: "生命周期分析",
          dynamic: true,
        },
      },
    ],
  },
];
