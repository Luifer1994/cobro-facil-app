<template>
	<n-form ref="formRef" :model="model" :rules="rules">
		<n-form-item path="email" label="Email">
			<n-input v-model:value="model.email" @keydown.enter="signIn" placeholder="ejemplo@email.com" size="large"
				autocomplete="on" />
		</n-form-item>
		<n-form-item path="password" label="Contraseña">
			<n-input v-model:value="model.password" type="password" show-password-on="click"
				placeholder="Al menos 8 caracteres" @keydown.enter="signIn" autocomplete="on" size="large" />
		</n-form-item>
		<div class="flex flex-col items-end gap-12">
			<div class="flex justify-end w-full">
				<n-button text type="primary" @click="emit('forgot-password')">¿Ha olvidado su contraseña?</n-button>
			</div>
			<div class="w-full">
				<n-button type="primary" @click="signIn" class="!w-full" size="large">Ingresar</n-button>
			</div>
		</div>
	</n-form>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import {
	type FormInst,
	type FormValidationError,
	type FormRules,
	useMessage,
	NForm,
	NFormItem,
	NInput,
	NButton,
} from "naive-ui"
import { useAuth } from "../composables/useAuth"

const { login } = useAuth()

interface ModelType {
	email: string
	password: string
}

const emit = defineEmits<{
	(e: "forgot-password"): void
}>()


const formRef = ref<FormInst | null>(null)
const message = useMessage()
const model = ref<ModelType>({
	email: "almendralesluifer@gmail.com",
	password: "1004280446"
})

const rules: FormRules = {
	email: [
		{
			required: true,
			trigger: ["blur"],
			message: "Email is required"
		}
	],
	password: [
		{
			required: true,
			trigger: ["blur"],
			message: "Password is required"
		}
	]
}



function signIn(e: Event) {
	e.preventDefault()
	formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
		if (!errors) {
			login({ email: model.value.email, password: model.value.password })
		} else {
			message.error("Invalid credentials")
		}
	})
}
</script>
