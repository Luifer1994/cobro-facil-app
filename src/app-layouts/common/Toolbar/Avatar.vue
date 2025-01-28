<template>
	<n-dropdown :options="options" placement="bottom-end" @select="handleSelect">
		<n-avatar round :size="32" class="cursor-pointer" :color="themeStore.primaryColor">
			{{ userInitials }}
		</n-avatar>
	</n-dropdown>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { NAvatar, NDropdown } from "naive-ui"
import { renderIcon } from "@/utils"
import { useRouter } from "vue-router"
import { computed } from "vue"
import { useAuth } from "@/modules/auth/composables/useAuth"
import { useThemeStore } from "@/stores/theme"

const themeStore = useThemeStore()
const { user } = useAuth()
const router = useRouter()

// Generar iniciales del usuario
const userInitials = computed(() => {
	if (!user.value?.name) return 'US'
	const names = user.value.name.split(' ')
	return names.length > 1
		? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
		: names[0][0].toUpperCase()
})

const UserIcon = "ion:person-outline"
const LogoutIcon = "ion:log-out-outline"

const options = ref([
	{
		label: "Perfil",
		key: "route-Profile",
		icon: renderIcon(UserIcon)
	},
	{
		label: "Cerrar sesión",
		key: "route-Logout",
		icon: renderIcon(LogoutIcon),
	}
])

function handleSelect(key: string) {
	if (key.indexOf("route-") === 0) {
		const path = key.split("route-")[1]
		if (path === "Logout") {
			useAuth().logout()
		}
		router.push({ name: path })
	}
}
</script>