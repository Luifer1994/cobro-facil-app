import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/plans",
    name: "plans",
    redirect: "/plans/list",
    meta: { title: "Planes", auth: true, permission: "plans-module" },
    children: [
      {
        path: "list",
        name: "plans-list",
        component: () => import("@/modules/plans/views/Index.vue"),
        meta: {
          title: "Lista de planes",
          auth: true,
          permission: "plans-list",
        },
      },
    ],
  },
];

export default routes;
