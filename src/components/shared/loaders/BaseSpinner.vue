<script setup lang="ts">
import { NSpin, NConfigProvider } from 'naive-ui'
import { computed } from 'vue'

interface Props {
  color?: string;
  size?: 'small' | 'medium' | 'large';
  description?: string;
  stroke?: number;
}

const props = withDefaults(defineProps<Props>(), {
  color: '#F6822B',
  size: 'small',
  description: '',
  stroke: 15
})

const themeOverrides = computed(() => ({
  common: {
    primaryColor: props.color,
    primaryColorHover: props.color,
    primaryColorPressed: props.color,
    primaryColorSuppl: props.color
  }
}))
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-spin
      :size="size"
      :description="description"
      :stroke-width="stroke"
    />
  </n-config-provider>
</template>