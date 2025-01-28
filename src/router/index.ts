// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { Layout } from "@/types/theme.d";
import axios from "axios";

//auth
import { validatePermission } from "@/utils/validatePermissions";
import { useAuthStore } from "@/modules/auth/stores/auth";

// Importaciones sincrónicas de rutas
import authRoutes from "@/modules/auth/router/router";
import usersRoutes from "@/modules/users/router/router";
import TenantRoutes from "@/modules/tenants/router/router";
import planRouter from "@/modules/plans/router/router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...authRoutes,
    ...usersRoutes,
    ...TenantRoutes,
    ...planRouter,
    {
      path: "/",
      name: "BlankPage",
      component: () => import("@/views/BlankPage.vue"),
      meta: {
        title: "Inicio",
        auth: true,
        roles: "all",
      },
    },
    {
      path: "/logout",
      name: "Logout",
      redirect: "/login",
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/NotFound.vue"),
      meta: { forceLayout: Layout.Blank, skipPin: true },
    },
  ],
});

async function validateDomain() {
  const hostname = location.hostname;
  const domainParts = hostname.split(".");
  if (domainParts.length > import.meta.env.VITE_LENGTH_DOMAIN) {
    const tenant = domainParts[0];
    const url = `${import.meta.env.VITE_HTTP}://${
      import.meta.env.VITE_URL_API
    }/api/tenants/get-tenant/${tenant}`;
    try {
      const res = await axios.get(url);
      localStorage.setItem("tenant", JSON.stringify(res.data.data));
      localStorage.setItem("validTenant", "true");
      return true;
    } catch (error) {
      localStorage.setItem("validTenant", "false");
      return false;
    }
  }
  localStorage.setItem("validTenant", "true");
  return true;
}

const publicPages = ["/login", "/404", "/error-page"];

router.beforeEach(async (to, from, next) => {
  const authRequired = !publicPages.includes(to.path);

  let validateChangeRoute = true;
  if (to.path === "/login") {
    validateChangeRoute = await validateDomain();
    if (!validateChangeRoute) {
      next("/error-page");
      return;
    }
  }

  const auth = useAuthStore();

  if (authRequired && !auth.user.id) {
    next("/login");
  } else {
    if (to.meta && to.meta.permission) {
      if (!validatePermission([to.meta.permission as string])) {
        next("/error-page");
        return;
      }
    }
    next();
  }
});

export default router;
