// router.js
export default [
  {
    path: "/dashilan",
    name: "dashilan",
    component: () => import("@/views/landmarks/Dashilan.vue"),
    meta: {
      title: "大栅栏",
      icon: "icon-dashilan",
    },
    props: true,
    children: [
      {
        path: "life-cycle",
        name: "DashilanLifeCycle",
        component: () => import("@/components/dashilan/LifeCycle.vue"),
        props: true,
        meta: {
          title: "景区详情",
          dynamic: true,
        },
      },
      {
        path: "influence",
        name: "DashilanInfluence",
        component: () => import("@/components/dashilan/Influence.vue"),
        props: true,
        meta: {
          title: "影响力雷达图",
          dynamic: true,
        },
      },
      {
        path: "legends",
        name: "DashilanLegends",
        component: () => import("@/components/dashilan/Legends.vue"),
        props: true,
        meta: {
          title: "生命周期分析",
          dynamic: true,
        },
      },
    ],
  },
];
