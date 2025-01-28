<script setup lang="ts">
import { Button } from "@/components/shared/ui";
import { Plus } from "@vicons/tabler";
import { defineEmits, defineProps, withDefaults } from 'vue';

const emit = defineEmits<{
    click: [event: MouseEvent];
}>();

withDefaults(defineProps<{
    title?: string;
    loading?: boolean;
}>(), {
    title: 'Registrar',
    loading: false
});

</script>

<template>
    <Button type="success" size="small" :loading="loading" :hasIcon="true" :icon="Plus"
        @click="(e) => emit('click', e)">
        {{ title }}
    </Button>
</template>