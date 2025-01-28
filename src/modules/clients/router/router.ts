import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: "/clients",
        name: "clients",
        redirect: "/clients/list",
        meta: { title: "Clientes", auth: true, permission: "clients-module" },
        children: [
            {
                path: "list",
                name: "client-list",
                component: () => import("@/modules/clients/views/List.vue"),
                meta: { title: "Lista de clientes", auth: true, permission: "clients-module" }
            },
        ]
    }
];

export default routes;