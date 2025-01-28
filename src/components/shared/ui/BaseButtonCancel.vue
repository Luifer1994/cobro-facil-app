<script setup lang="ts">
import { Button } from "@/components/shared/ui";
import { CloseCircleOutline } from "@vicons/ionicons5";
import { defineEmits, withDefaults, defineProps } from 'vue';

const emit = defineEmits<{
    click: [event: MouseEvent];
}>();

withDefaults(defineProps<{
    title?: string;
    loading?: boolean;
}>(), {
    title: 'Cancelar',
});

</script>

<template>
    <Button type="error" size="medium" :hasIcon="true" :icon="CloseCircleOutline" :disabled="loading"
        @click="(e) => emit('click', e)">
        Cancelar
    </Button>
</template>