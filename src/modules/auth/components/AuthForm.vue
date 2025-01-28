<template>
	<div class="form-wrap">
		<div class="flex justify-center">
			<Logo mini :dark="isDark" :login="true" class="mb-6" />
		</div>
		<div class="title mb-4">{{ title }}</div>
		<div class="text mb-12">
			Hoy es un nuevo día. Es tu día. Tú le das forma. Inicia sesión para empezar a gestionar tus proyectos.
		</div>

		<div class="form">
			<transition name="form-fade" mode="out-in" appear>
				<SignIn v-if="typeRef === 'signin'" key="signin" @forgot-password="gotoForgotPassword()" />
				<ForgotPassword v-else-if="typeRef === 'forgotpassword'" key="forgotpassword" />
			</transition>
		</div>

		<div class="sign-text text-center mt-2">
			<div class="sign-text" v-if="typeRef === 'forgotpassword'">
				<n-button text @click="gotoSignIn()" type="primary" size="large">Volver a Iniciar sesión</n-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useThemeStore } from "@/stores/theme"
import SignIn from "./SignIn.vue"
import ForgotPassword from "./ForgotPassword.vue"
import Logo from "@/app-layouts/common/Logo.vue"
import { NButton } from "naive-ui"
import { ref, onBeforeMount, computed } from "vue"
import { useRouter } from "vue-router"
import type { FormType } from "../types/types.d"

const props = defineProps<{
	type?: FormType
	useOnlyRouter?: boolean
}>()

const typeRef = ref<FormType>("signin")
const router = useRouter()
const themeStore = useThemeStore()
const isDark = computed<boolean>(() => themeStore.isThemeDark)
const title = computed<string>(() =>
	typeRef.value === "signin" ? "Bienvenido de nuevo" : "Contraseña olvidada"
)

function gotoSignIn() {
	if (!props.useOnlyRouter) {
		typeRef.value = "signin"
	}
	router.replace({ name: "Login" })
}

function gotoForgotPassword() {
	if (!props.useOnlyRouter) {
		typeRef.value = "forgotpassword"
	}
	router.replace({ name: "ForgotPassword" })
}

onBeforeMount(() => {
	if (props.type) {
		typeRef.value = props.type
	}
})
</script>

<style lang="scss" scoped>
.form-wrap {
	width: 100%;
	min-width: 270px;
	max-width: 400px;

	.logo {
		:deep(img) {
			max-height: 120px;
		}
	}

	.title {
		font-size: 36px;
		font-family: var(--font-family-display);
		line-height: 1.2;
		font-weight: 700;
	}

	.text {
		font-size: 18px;
		line-height: 1.3;
		color: var(--fg-secondary-color);
	}

	.social-btns {
		img {
			display: block;
			height: 20px;
		}
	}
}

.form-fade-enter-active,
.form-fade-leave-active {
	transition:
		opacity 0.2s ease-in-out,
		transform 0.3s ease-in-out;
}

.form-fade-enter-from {
	opacity: 0;
	transform: translateX(10px);
}

.form-fade-leave-to {
	opacity: 0;
	transform: translateX(-10px);
}
</style>
