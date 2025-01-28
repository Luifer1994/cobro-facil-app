<template>
  <NCard :class="['plan-card', { 'active-plan': plan.pivot.is_active }]" :bordered="false">
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-xl font-semibold mb-2">{{ plan.name }}</h3>
        <p>
          Válido hasta: {{ plan.end_date }}
        </p>
      </div>
      <NTag :type="getStatusType(plan.status)" size="medium" round>
        {{ plan.status }}
      </NTag>
    </div>
    <NDivider />
    <div class="flex justify-between items-center">
      <span class="">Precio mensual</span>
      <span class="text-2xl font-bold">${{ formatCurrency(plan.price) }}</span>
    </div>
    <NSpace justify="end">
      <Button @click="emit('renew')" type="primary" :ghost="true">
        Renovar Plan
      </Button>
    </NSpace>
  </NCard>
</template>

<script setup lang="ts">
import { NCard, NDivider, NSpace, NTag } from 'naive-ui';
import { Button } from '@/components/shared/ui';
import type { Plan } from '../types/tenantInterfaces';
import { formatCurrency } from '@/utils/helpers';

defineProps<{
  plan: Plan;
}>();

const emit = defineEmits<{
  (e: 'renew'): void;
}>();

const getStatusType = (status: string) => {
  switch (status) {
    case 'Activo':
      return 'success';
    case 'Vencido':
      return 'error';
    default:
      return 'warning';
  }
};

</script>

<style scoped>
.plan-card {
  transition: all 0.2s;
}

.active-plan {
  border-width: 2px;
  border-color: rgba(16, 185, 129, 0.5);
}
</style>