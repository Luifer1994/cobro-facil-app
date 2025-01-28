<script setup lang="ts">
import { EditCircle } from "@vicons/tabler";
import { NButton, NIcon,NTooltip } from "naive-ui";
import { defineEmits, withDefaults, defineProps} from 'vue';

const emit = defineEmits<{
    click: [event: MouseEvent];
}>();

withDefaults(defineProps<{
    title?: string;
    loading?: boolean;
    type?: "primary" | "default" | "error" | "warning" | "success" | "info";
}>(), {
    title: 'Editar',
    type: 'primary',
});

</script>

<template>
    <n-tooltip trigger="hover">
    <template #trigger>
        <n-button quaternary circle :type="type" @click="(e) => emit('click', e)">
        <template #icon>
            <n-icon>
                <EditCircle />
            </n-icon>
        </template>
    </n-button>
    </template>
    <template #default>
        {{ title }}
    </template>
  </n-tooltip>
    
</template>