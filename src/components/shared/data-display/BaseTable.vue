<script setup lang="ts">
import { NDataTable } from 'naive-ui';
import type { TableColumn, RowData } from 'naive-ui/es/data-table/src/interface';
import { withDefaults, defineProps } from 'vue';

withDefaults(defineProps<{
  data: RowData[];
  columns: TableColumn[];
  loading?: boolean;
  bordered?: boolean;
  singleLine?: boolean;
}>(), {
  bordered: false,
  singleLine: false,
  loading: false,
});
</script>

<template>
  <NDataTable :columns="columns" :data="data" :loading="loading" :bordered="bordered" class="mt-4">
    <template #empty>
      <div class="text-center text-gray-500">No hay datos</div>
    </template>
    <template v-for="slot in Object.keys($slots)" #[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
    </template>
  </NDataTable>
</template>
