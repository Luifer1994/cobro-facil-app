<script setup lang="ts">
import { defineProps, defineEmits, withDefaults, type Component } from "vue";
import { NButton, NIcon } from "naive-ui";
import { useThemeStore } from "@/stores/theme";
import { getContrastYIQ, getHexColor } from "@/utils/color";

withDefaults(defineProps<{
  type?: "primary" | "default" | "error" | "warning" | "success" | "info";
  size?: "tiny" | "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
  hasIcon?: boolean;
  icon?: Component;
  ghost?: boolean;
  circle?: boolean;
}>(), {
  type: 'primary',
  size: 'medium',
  loading: false,
  disabled: false,
  hasIcon: false,
  icon: undefined,
  ghost: false,
  circle: false
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const themeStore = useThemeStore();

const getButtonTextColor = (type: string, isGhost: boolean) => {
  if (!isGhost) {
    return getContrastYIQ(getHexColor(type));
  }
  
  // For ghost buttons, use the theme's text color in light mode
  // and the button's color in dark mode
  if (!themeStore.isThemeDark) {
    return getHexColor(type);
  }
  
  return getContrastYIQ(getHexColor(type));
};
</script>

<template>
  <n-button 
    :style="{
      color: getButtonTextColor(type, ghost)
    }" 
    :type="type" 
    :size="size" 
    :loading="loading" 
    :disabled="disabled" 
    :ghost="ghost" 
    @click="(e) => emit('click', e)"
    :circle="circle"
  >
  <template #icon>
    <n-icon v-if="hasIcon" :size="20" class="mx-2">
      <component :is="icon" />
    </n-icon>
  </template>
    
    <slot></slot>
  </n-button>
</template>