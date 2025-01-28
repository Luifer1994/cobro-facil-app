<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { NCard } from 'naive-ui';
import type { Tenant } from '../types/tenantInterfaces';
import { ButtonIconEdit } from '@/components/shared/ui';

const props = defineProps<{
    tenant: Tenant;
}>();

const emit = defineEmits<{
    (e: 'edit'): void;
}>();

const logoSrc = computed<string | undefined>(() => {
    if (typeof props.tenant.logo === 'string') {
        return props.tenant.logo;
    }
    return undefined;
});
</script>

<template>
    <NCard class="Tenant-header" :bordered="false">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 p-4">
            <div class="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                <img :src="logoSrc" :alt="tenant.name" class="w-full h-full object-cover rounded-2xl shadow-lg" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
            <div class="flex-1 w-full">
                <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div class="w-full sm:w-auto">
                        <h1 class="text-2xl sm:text-3xl font-bold  mb-2 sm:mb-3">{{ tenant.name }}
                        </h1>
                        <p class="text-base sm:text-lg">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit?
                        </p>
                    </div>
                    <ButtonIconEdit type="primary" @click="emit('edit')" />
                </div>
            </div>
        </div>
    </NCard>
</template>
