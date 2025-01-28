<script setup lang="ts">
import { NButton, NIcon } from "naive-ui";
import { defineEmits, withDefaults, defineProps, type Component} from 'vue';

const emit = defineEmits<{
    click: [event: MouseEvent];
}>();

withDefaults(defineProps<{
    title?: string;
    loading?: boolean;
    type?: "primary" | "default" | "error" | "warning" | "success" | "info";
    icon: Component;
}>(), {
    title: 'Button',
    type: 'primary',
});

</script>

<template>
    <n-button quaternary circle :type="type" @click="(e) => emit('click', e)">
        <template #icon>
            <n-icon>
                <component :is="icon" />
            </n-icon>
        </template>
    </n-button>
</template>