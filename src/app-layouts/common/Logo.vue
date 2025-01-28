<template>
	<div class="logo" v-if="isDark && !mini">
		<img :src="logo" />
	</div>
	<div class="logo" v-else-if="isLight && !mini">
		<img :src="logo" />
	</div>
	<div class="logo" v-else-if="isDark && mini">
		<img :src="logo" />
	</div>
	<div class="logo" v-else-if="isLight && mini">
		<img :src="logo" />
	</div>
</template>

<script lang="ts" setup>
import { useThemeStore } from "@/stores/theme"
import { computed, toRefs, ref, watchEffect } from "vue"

const props = withDefaults(
	defineProps<{
		mini: boolean
		dark?: boolean
		login?: boolean
	}>(),
	{ dark: undefined }
)
const { mini, dark } = toRefs(props)

const themeStore = useThemeStore()
const isDark = computed<boolean>(() => dark.value ?? themeStore.isThemeDark)
const isLight = computed<boolean>(() => !dark.value || themeStore.isThemeLight)
const logoTenant = computed<string>(() => themeStore.getLogoTenant())
const logo = ref<string>("")
const isLogin = ref<boolean>(props.login ?? false)

watchEffect(() => {
	if(isLogin.value) {
		logo.value = "/logo.png"
	} else {
		logo.value = logoTenant.value ? logoTenant.value : "/logo.png"
	}
});

</script>

<style lang="scss" scoped>
.logo {
	height: 100%;
	display: flex;
	align-items: center;

	img {
		max-height: 47px;
		display: block;
		height: 100%;
	}

	&.fade-enter-active,
	&.fade-leave-active {
		transition: opacity var(--sidebar-anim-ease) var(--sidebar-anim-duration);
	}

	&.fade-enter-from,
	&.fade-leave-to {
		opacity: 0;
	}
}
</style>
