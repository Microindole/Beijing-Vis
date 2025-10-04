export default [
  {
    path: "/beihai-park",
    name: "beihai-park",
    component: () => import("@/views/landmarks/BeihaiPark.vue"),
    meta: {
      title: "北海公园",
      icon: "icon-beihai-park"
    },
    children: [
      {
        path: "life-cycle",
        name: "BeihaiParkLifeCycle",
        component: () => import("@/components/BeihaiPark/LifeCycle.vue"),
        props: true
      },
      {
        path: "influence",
        name: "BeihaiParkInfluence",
        component: () => import("@/components/BeihaiPark/Influence.vue"),
        props: true
      },
      {
        path: "legends",
        name: "BeihaiParkLegends",
        component: () => import("@/components/BeihaiPark/Legends.vue"),
        props: true
      }
    ]
  }
];