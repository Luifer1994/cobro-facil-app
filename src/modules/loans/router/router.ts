import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/loans",
    name: "loans",
    redirect: "/loans/list",
    meta: { title: "Prestamos", auth: true, permission: "loans-module" },
    children: [
      {
        path: "list",
        name: "loans-list",
        component: () => import("@/modules/loans/views/List.vue"),
        meta: {
          title: "Lista de Prestamos",
          auth: true,
          permission: "loans-module",
        },
      },
      {
        path: ":id",
        name: "loans-detail",
        component: () => import("@/modules/loans/views/Detail.vue"),
        meta: {
          title: "Detalle de Prestamo",
          auth: true,
          permission: "loans-show",
        },
      },
    ],
  },
];

export default routes;
