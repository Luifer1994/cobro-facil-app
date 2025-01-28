<script setup lang="ts">
import { Button } from "@/components/shared/ui";
import { SaveOutline } from "@vicons/ionicons5";
import { defineEmits, defineProps, withDefaults } from 'vue';
import { BaseSpinner } from "@/components/shared/loaders";


const emit = defineEmits<{
    click: [event: MouseEvent];
}>();

withDefaults(defineProps<{
    title?: string;
    loading?: boolean;
}>(), {
    title: 'Guardar',
});

</script>

<template>
    <Button type="success" size="medium" :hasIcon="true" :icon="SaveOutline" :disabled="loading"
        @click="(e) => emit('click', e)">
        <BaseSpinner color="#F8F8F8FF" size="small" v-if="loading" />
        <span v-else>
            {{ title }}
        </span>

    </Button>
</template>