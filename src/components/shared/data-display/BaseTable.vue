<script setup lang="ts">
import { computed, defineProps, withDefaults, useSlots, type Slots } from "vue"
import { NDataTable } from "naive-ui"
import type { TableColumn, RowData } from "naive-ui/es/data-table/src/interface"

// Tipos de props
withDefaults(
  defineProps<{
    data: RowData[]
    columns: TableColumn[]
    loading?: boolean
    bordered?: boolean
    singleLine?: boolean
  }>(),
  {
    bordered: false,
    singleLine: false,
    loading: false
  }
)

// 1. Obtén los slots y tipa la variable "slots" correctamente
const slots: Slots = useSlots()

// 2. Crea un computed para las claves de slots con tipo string[]
const slotNames = computed<string[]>(() => Object.keys(slots))
</script>


<template>
  <NDataTable
    :columns="columns"
    :data="data"
    :loading="loading"
    :bordered="bordered"
    class="mt-4"
  >
    <template #empty>
      <div class="text-center text-gray-500">No hay datos</div>
    </template>

    <!-- 3. Iteramos sobre slotNames en lugar de Object.keys($slots) -->
    <template
      v-for="(slotName, index) in slotNames"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <slot :name="slotName" v-bind="slotProps"></slot>
    </template>
  </NDataTable>
</template>
