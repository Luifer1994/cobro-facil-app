<script setup lang="ts">
import { Button } from "@/components/shared/ui";
import { Search } from "@vicons/tabler";
import { defineEmits, defineProps, withDefaults } from 'vue';

const emit = defineEmits<{
    click: [event: MouseEvent];
}>();

withDefaults(defineProps<{
    title?: string;
}>(), {
    title: 'Buscar',
});

</script>

<template>
    <Button type="success" size="small" :hasIcon="true" :icon="Search" @click="(e) => emit('click', e)">
        {{ title }}
    </Button>
</template>