import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/tenant",
    name: "tenant",
    redirect: "/tenant/list",
    meta: { title: "Inquilinos", auth: true, permission: "tenants-module" },
    children: [
      {
        path: "list",
        name: "tenant-list",
        component: () => import("@/modules/tenants/views/Index.vue"),
        meta: {
          title: "Lista de Inquilinos",
          auth: true,
          permission: "tenants-module",
        },
      },
      {
        path: ":id",
        name: "tenant-detail",
        component: () => import("@/modules/tenants/views/Detail.vue"),
        meta: {
          title: "Detalle de inquilino",
          auth: true,
          permission: "tenants-show",
        },
      },
    ],
  },
];

export default routes;
