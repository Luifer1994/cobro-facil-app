<template>
	<div class="page-auth">
		<div class="flex wrapper justify-center">
			<div class="image-box basis-2/3" v-if="align === 'right'"></div>
			<div class="form-box basis-1/3 flex items-center justify-center" :class="{ centered: align === 'center' }">
				<AuthForm :type="type" />
			</div>
			<div class="image-box basis-2/3" v-if="align === 'left'"></div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import AuthForm from "@/modules/auth/components/AuthForm.vue"
import { type Align } from "@/modules/auth/components/Settings.vue"
import { ref, onBeforeMount, toRefs } from "vue"
import { useRoute } from "vue-router"
import type { FormType } from "@/modules/auth/types/types.d"

const props = defineProps<{
	formType?: FormType
}>()
const { formType } = toRefs(props)

const route = useRoute()
const align = ref<Align>("left")
const activeColor = ref("")
const type = ref<FormType | undefined>(formType.value || undefined)


onBeforeMount(() => {
	if (route.query.step) {
		const step = route.query.step as FormType
		type.value = step
	}
})
</script>

<style lang="scss" scoped>
@import "../assets/main.scss";

.page-auth {
	.wrapper {
		.image-box {
			background-color: v-bind(activeColor);
		}
	}
}
</style>
