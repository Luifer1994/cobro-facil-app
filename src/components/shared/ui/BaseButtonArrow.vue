<template>
    <Button @click="handleClick" type="primary" size="small" ghost>
      <NIcon v-if="icon === 'left'" :class="['text-xl']">
        <component :is="computedIcon" />
      </NIcon>
      {{ text }}
      <NIcon v-if="icon === 'right'" :class="['text-xl']">
        <component :is="computedIcon" />
      </NIcon>
    </Button>
  </template>
  
  <script setup lang="ts">
  import { defineProps, computed } from 'vue';
  import { NIcon } from 'naive-ui';
  import { ArrowLeft, ArrowRight } from "@vicons/tabler";
  import { useRouter } from 'vue-router';
  import { Button } from '@/components/shared/ui';
  
  const props = defineProps<{
    icon?: 'left' | 'right';
    text: string;
    redirect: string;
  }>();
  
  const { icon, text, redirect } = props;
  
  const computedIcon = computed(() => {
    return icon === 'left' ? ArrowLeft : ArrowRight;
  });
  
  const router = useRouter();
  
  const handleClick = () => {
    router.push(redirect);
  };
  </script>
  