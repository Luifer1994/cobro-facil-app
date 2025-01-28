<script setup lang="ts">
import { NCard, NTimeline, NTimelineItem, NTag } from 'naive-ui';
import type { Plan } from '../types/tenantInterfaces';
import { formatCurrency } from '@/utils/helpers';


defineProps<{
  plans: Plan[];
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

<template>
  <NCard title="Historial de Planes" class="history-card h-auto">
    <NTimeline>
      <NTimelineItem
        v-for="plan in plans"
        :key="plan.id"
        :type="getStatusType(plan.status)"
        :title="plan.name"
      >
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm">
              {{ plan.start_date }} / {{ plan.end_date }}
            </p>
            <h5 class="font-medium">${{ formatCurrency(plan.price) }} / mes</h5>
          </div>
          <NTag :type="getStatusType(plan.status)" size="medium" round>
            {{ plan.status.toUpperCase() }}
          </NTag>
        </div>
      </NTimelineItem>
    </NTimeline>
  </NCard>
</template>