<script setup lang="ts">
import { NCard, NGrid, NGridItem } from 'naive-ui';
import type { Tenant } from '../types/tenantInterfaces';
defineProps<{
  tenant: Tenant;
}>();
</script>

<template>
  <NCard title="Información General" class="h-full">
    <NGrid cols="2 400:4 600:4" :item-responsive="true" :x-gap="12" :y-gap="8">
      <NGridItem>
        <div class="info-item">
          <p class="text-sm mb-1">Identificación</p>
          <h5 class="font-medium">{{ tenant.document_number }}</h5>
        </div>
      </NGridItem>
      <NGridItem>
        <div class="info-item">
          <p class="text-sm mb-1">Dominio</p>
          <a class="text-blue-500 font-semibold" href="http://{{ tenant.domains[0].domain_front }}" target="_blank">
            {{ tenant.domains[0].domain_front }}
          </a>
        </div>
      </NGridItem>
      <NGridItem>
        <div class="info-item">
          <p class="text-sm mb-1">Correo</p>
          <h5 class="font-medium">{{ tenant.email }}</h5>
        </div>
      </NGridItem>
      <NGridItem>
        <div class="info-item">
          <p class="text-sm mb-1">Ciudad</p>
          <h5 class="font-medium">{{ tenant.city.name }}</h5>
        </div>
      </NGridItem>
      <NGridItem>
        <div class="info-item">
          <p class="text-sm mb-1">Dirección</p>
          <h5 class="font-medium">{{ tenant.address }}</h5>
        </div>
      </NGridItem>
      <NGridItem>
        <div class="info-item">
          <p class="text-sm mb-1">Teléfono</p>
          <h5 class="font-medium">{{ tenant.cell_phone }}</h5>
        </div>
      </NGridItem>
      <NGridItem>
        <div class="info-item">
          <p class="text-sm mb-1">Color primario</p>
          <div class="flex items-center gap-2">
            <h5 class="font-medium">{{ tenant.primary_color }}</h5>
          <div class="rounded-full w-8 h-8" :style="{ backgroundColor: tenant.primary_color }">
          </div>
          </div>
        </div>
      </NGridItem>
      <NGridItem>
        <div class="info-item">
          <p class="text-sm mb-1">Color secundario</p>
          <div class="flex items-center gap-2">
            <h5 class="font-medium">{{ tenant.secondary_color }}</h5>
          <div class="rounded-full w-8 h-8" :style="{ backgroundColor: tenant.secondary_color }">
          </div>
          </div>
        </div>
      </NGridItem>
    </NGrid>
  </NCard>
</template>

<style scoped>
.info-item {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
</style>