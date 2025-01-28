<template>
	<div class="sidebar-footer center-text" :class="{ collapsed }">
		<span>V 1.0.0</span>
	</div>
</template>

<script lang="ts" setup>
import { toRefs } from "vue"

const props = withDefaults(
	defineProps<{
		collapsed?: boolean
	}>(),
	{ collapsed: false }
)
const { collapsed } = toRefs(props)

</script>

<style lang="scss" scoped>
.sidebar-footer {
	margin: 8px;
	background-color: var(--bg-body);
	border-radius: var(--border-radius);
	padding: 3px 0;
	transition: all 0.3s;

	:deep(.n-menu) {
		.n-menu-item-content.n-menu-item-content--selected::before {
			background-color: transparent !important;
		}
	}
}
</style>
