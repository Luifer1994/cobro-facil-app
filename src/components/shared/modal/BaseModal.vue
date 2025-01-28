<template>
    <div class="modal-wrapper">
      <n-modal 
        :show="visible" 
        @update:show="value => emit('update:visible', value)" 
        :mask-closable="maskClosable"
        :style="{ maxWidth: maxWidth, width: width }"
      >
        <n-card :title="title" :bordered="bordered" size="huge" role="dialog" aria-modal="true">
          <template #header-extra>
            <n-button size="small" :disabled="loading" @click="emit('cancel')">
              <n-icon>
                <Close />
              </n-icon>
            </n-button>
          </template>
  
          <div class="modal-content">
            <slot />
          </div>
  
          <template v-if="footer" #footer>
            <div class="flex justify-end gap-2">
              <Button type="error" class="w-auto" :disabled="loading" @click="() => emit('cancel')">
                Cancelar
              </Button>
            </div>
          </template>
        </n-card>
      </n-modal>
    </div>
  </template>
  
  <script setup lang="ts">
  import { NModal, NCard, NButton, NIcon } from 'naive-ui';
  import { withDefaults, defineProps, defineEmits } from 'vue';
  import { Close } from '@vicons/ionicons5';
  import { Button } from '@/components/shared/ui';
  
  const emit = defineEmits(['update:visible', 'cancel', 'save']);
  
  withDefaults(defineProps<{
    title?: string;
    visible?: boolean;
    maxWidth?: string;
    width?: string;
    maskClosable?: boolean;
    bordered?: boolean;
    loading?: boolean;
    footer?: boolean;
  }>(), {
    title: 'Modal',
    visible: false,
    maxWidth: '90%',
    width: '1000px',
    maskClosable: false,
    bordered: false,
    loading: false,
    footer: false,
  });
  </script>
  
  <style scoped>
  .modal-wrapper {
    width: 100%;
  }
  
  .modal-content {
    width: 100%;
  }
  </style>