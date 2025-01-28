<script setup lang="ts">
import { ref, watch, withDefaults } from 'vue';
import { NPagination } from 'naive-ui';

const props = withDefaults(defineProps<{
  page?: number;
  pageSize?: number;
  total?: number;
}>(), {
  page: 1,
  pageSize: 10,
  total: 0,
});

const emit = defineEmits<{
  'update:page': [page: number]
  'update:pageSize': [pageSize: number]
}>();

const currentPage = ref(props.page);
const currentPageSize = ref(props.pageSize);

watch(() => props.page, (newVal) => {
  currentPage.value = newVal;
});

watch(() => props.pageSize, (newVal) => {
  currentPageSize.value = newVal;
});

watch(currentPage, (newVal) => {
  emit('update:page', newVal);
});

watch(currentPageSize, (newVal) => {
  emit('update:pageSize', newVal);
});
</script>

<template>
  <NPagination
  v-model:page="currentPage"
  v-model:page-size="currentPageSize"
  :item-count="total"
  :page-sizes="[10, 20, 30, 40, 50]"
  show-size-picker
/>

</template>