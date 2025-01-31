<template>
	<nav class="nav" :class="[{ collapsed }, mode]">
	  <n-menu
		ref="menu"
		:options="menuOptions"
		:collapsed="collapsed"
		:mode="mode"
		:accordion="true"
		:collapsed-width="collapsedWidth"
		:dropdown-props="{
		  scrollable: true,
		  menuProps: () => ({
			class: 'main-nav'
		  })
		}"
		v-model:value="activeKey"
	  />
	</nav>
  </template>
  
  <script lang="ts" setup>
import { type MenuInst, NMenu } from "naive-ui"
import getItems from "./items"
import { useThemeStore } from "@/stores/theme"
import { type MenuMixedOption } from "naive-ui/es/menu/src/interface"
import { computed, onBeforeMount, ref, toRefs } from "vue"
import { useRouter, useRoute, type RouteLocationNormalized } from "vue-router"

const props = withDefaults(
  defineProps<{
    mode?: "vertical" | "horizontal"
    collapsed?: boolean
  }>(),
  { mode: "vertical", collapsed: false }
)
const { mode, collapsed } = toRefs(props)

const route = useRoute()
const router = useRouter()
const activeKey = ref<string | null>(null)
const menu = ref<MenuInst | null>(null)

const themeStore = useThemeStore()

const menuOptions = computed<MenuMixedOption[]>(() => getItems(mode.value, collapsed.value))
const collapsedWidth = computed<number>(() => themeStore.sidebar.closeWidth)
const sidebarCollapsed = computed<boolean>(() => themeStore.sidebar.collapsed)

/**
 * Establece la clave activa según la ruta actual.
 * Se utiliza la propiedad `route.matched` para recorrer la jerarquía de rutas y
 * buscar aquella que coincida con alguna opción del menú.
 */
function setActiveKeyByRoute(currentRoute: RouteLocationNormalized) {
  // Si el nombre de la ruta actual coincide directamente con alguna opción del menú, lo usamos
  if (currentRoute.name && menuOptions.value.some(item => item.key === currentRoute.name)) {
    activeKey.value = currentRoute.name.toString()
    return
  }
  
  // Sino, recorremos la jerarquía de rutas (excluyendo la última, que es la más específica)
  // en orden inverso para encontrar el primer registro (padre) cuyo nombre esté en el menú.
  const parentMatch = currentRoute.matched
    .slice(0, -1) // quitamos el registro más específico (la ruta hija)
    .reverse()
    .find(record => record.name && menuOptions.value.some(item => item.key === record.name))
  
  if (parentMatch && parentMatch.name) {
    activeKey.value = parentMatch.name.toString()
  } else {
    // Si no se encuentra ninguna coincidencia, se deja en null o se puede asignar un valor por defecto.
    activeKey.value = null
  }
}

onBeforeMount(() => {
  // En el montaje inicial, establecemos la clave activa según la ruta actual
  if (route.name) {
    setActiveKeyByRoute(route)
  }

  router.afterEach(newRoute => {
    // Si la ruta tiene registros 'matched' (por ejemplo, tiene rutas hijas o anidadas),
    // podemos verlos con: newRoute.matched
    // console.log(newRoute.matched)

    if (newRoute?.name) {
      setActiveKeyByRoute(newRoute)
    }

    // Si la ventana es pequeña, cierra la sidebar (esto es tu lógica adicional)
    if (window.innerWidth <= 700 && !sidebarCollapsed.value) {
      themeStore.closeSidebar()
    }
  })
})
</script>

  
  <style lang="scss" scoped>
  .nav {
	&.collapsed {
	  pointer-events: none;
	}
  
	:deep() {
	  .n-menu-item {
		.n-menu-item-content {
		  gap: 8px;
  
		  .n-menu-item-content__icon {
			margin-right: 0 !important;
		  }
		}
	  }
	  .n-menu-item-content,
	  .n-menu-item-group {
		.item-badge {
		  display: flex;
		  justify-content: space-between;
		  align-items: center;
		  gap: 10px;
  
		  :nth-child(1) {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		  }
  
		  :nth-child(2) {
			color: var(--fg-color);
			background: var(--hover-005-color);
			height: 22px;
			line-height: 24px;
			border-radius: 15px;
			padding: 0 7px;
			font-weight: bold;
			font-size: 13px;
			font-family: var(--font-family-mono);
		  }
		}
  
		&.n-menu-item-content--selected,
		&.n-menu-item-content--child-active {
		  .item-badge {
			:nth-child(2) {
			  color: var(--n-item-text-color-active);
			  background: var(--n-item-color-active);
			}
		  }
		}
	  }
  
	  .n-menu-item-group {
		.n-menu-item-group-title {
		  white-space: nowrap;
		  overflow: hidden;
		  text-overflow: ellipsis;
		}
		.item-badge {
		  :nth-child(2) {
			font-size: 10px;
			margin-right: 0px;
			height: 20px;
			line-height: 20px;
			border-radius: 8px;
			padding: 0 6px;
		  }
		}
	  }
  
	  .n-menu--horizontal {
		.n-menu-item-content {
		  .n-menu-item-content-header {
			overflow: initial;
		  }
		}
	  }
	}
  }
  
  .direction-rtl {
	.nav {
	  :deep() {
		.n-submenu-children {
		  --dash-offset: 39px;
		}
	  }
	}
  }
  </style>
  
  <style lang="scss">
  .main-nav {
	.n-dropdown-option-body,
	.n-dropdown-option-body--group,
	.n-dropdown-option-body__label {
	  .item-badge {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
  
		:nth-child(1) {
		  overflow: hidden;
		  white-space: nowrap;
		  text-overflow: ellipsis;
		}
  
		:nth-child(2) {
		  color: var(--fg-color);
		  background: var(--hover-005-color);
		  font-weight: bold;
		  font-family: var(--font-family-mono);
		  font-size: 10px;
		  margin-right: 0px;
		  height: 20px;
		  line-height: 20px;
		  border-radius: 8px;
		  padding: 0 6px;
		}
	  }
  
	  &.n-dropdown-option-body--selected,
	  &.n-dropdown-option-body--child-active {
		.item-badge {
		  :nth-child(2) {
			color: var(--n-item-text-color-active);
			background: var(--primary-010-color);
		  }
		}
	  }
	}
  }
  </style>