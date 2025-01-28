import type { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/types/theme.d'
import type { FormType } from '@/modules/auth/types/types.d'

const routes: Array<RouteRecordRaw> = [
    {
        path: "/login",
        name: "Login",
        component: () => import("@/modules/auth/views/Login.vue"),
        meta: { title: "Login", forceLayout: Layout.Blank, checkAuth: true, skipPin: true }
    },
    {
        path: "/forgot-password",
        name: "ForgotPassword",
        component: () => import("@/modules/auth/views/Login.vue"),
        props: { formType: "forgotpassword" as FormType },
        meta: { title: "Forgot Password", forceLayout: Layout.Blank, checkAuth: true, skipPin: true }
    },
];

export default routes;