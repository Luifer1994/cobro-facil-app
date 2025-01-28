import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: "/users",
        name: "users",
        redirect: "/users/list",
        meta: { title: "Usuarios", auth: true, permission: "users-module" },
        children: [
            {
                path: "list",
                name: "user-list",
                component: () => import("@/modules/users/views/List.vue"),
                meta: { title: "Lista de usuarios", auth: true, permission: "users-module" }
            },
        ]
    }
];

export default routes;