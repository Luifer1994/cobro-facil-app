<template>
	<div class="header-bar flex items-center gap-3">
		<Logo :mini="false" :dark="isDark" class="anim-wrap" />
		<n-scrollbar class="grow" x-scrollable>
			<Navbar :collapsed="false" mode="horizontal"></Navbar>
		</n-scrollbar>
	</div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { NScrollbar } from "naive-ui"
import Navbar from "@/app-layouts/common/Navbar/index.vue"
import Logo from "@/app-layouts/common/Logo.vue"
import { useThemeStore } from "@/stores/theme"

const themeStore = useThemeStore()
const isDark = computed<boolean>(() => themeStore.isThemeDark)
</script>

<style lang="scss" scoped>
@import "./variables";

.header-bar {
	padding-left: var(--view-padding);
	min-height: var(--header-bar-height);
	height: var(--header-bar-height);
	max-height: var(--header-bar-height);
	background-color: var(--bg-sidebar);

	:deep(.n-scrollbar-rail) {
		opacity: 0.15;
	}

	.nav {
		padding-top: 10px;
		margin-right: var(--view-padding);
	}

	@media (max-width: $sidebar-bp) {
		display: none;
	}
}

.direction-rtl {
	.header-bar {
		direction: rtl;
		padding-left: 0;
		padding-right: var(--view-padding);

		.nav {
			margin-right: 0;
			margin-left: var(--view-padding);
		}
	}
}
</style>
