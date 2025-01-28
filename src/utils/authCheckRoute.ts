import { useAuthStore } from "@/modules/auth/stores/auth"
import { type RouteMetaAuth } from "@/modules/auth/types/auth.d"
import { type RouteLocationNormalized } from "vue-router"
import { validatePermission } from './validatePermissions';

export function authCheck(route: RouteLocationNormalized) {
	const meta: RouteMetaAuth = route.meta
	const { checkAuth, authRedirect, auth, permission } = meta
	

	const authStore = useAuthStore()

	if (route?.redirectedFrom?.name === "Logout") {
		authStore.setLogout()
	}

	if (auth === true) {
		if (!authStore.user.id) {
			window.location.href = "/login" + window.location.search
			return false
		}
	}

	if (permission) {
		const hasPermission = validatePermission([permission as string])
		if (!hasPermission) {
			window.location.href = "/403"
			return false
		}
	}

	if (checkAuth === true) {
		if (authStore.user.id) {
			return authRedirect || "/"
		}
	}
}
