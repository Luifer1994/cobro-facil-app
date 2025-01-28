<template>
  <div class="Tenant-detail">
    <div v-if="TenantComputed.id">
      <NSpace vertical>
        <div class="flex items-center mb-4">
          <ButtonArrow icon="left" text="Atrás" redirect="/Tenant" />
        </div>
        <TenantHeader :tenant="TenantComputed" @edit="edit(TenantComputed.id)" />
        <TenantInfo :tenant="TenantComputed" />
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2 order-2 md:order-1">
            <PlanHistory :plans="TenantComputed.plans" />
          </div>
          <div class="order-1 md:order-2">
            <PlanCard :plan="TenantComputed.current_plan" :is-active="true" @renew="openPlanModal()" />
          </div>
        </div>

      </NSpace>
    </div>

    <Modal v-model:visible="isModalVisible" :title="textModal" @cancel="handleCancel" :loading="loading">
      <div class="modal-content">
        <CreateAndUpdate @cancel="handleCancel" :btnCancel="true" v-if="isModalVisible" />
      </div>
    </Modal>

    <Modal width="500px" v-model:visible="showPlanModal" title="Renovar Plan" @cancel="cancelRenovatePlan"
      :loading="loading">
      <RenovatePlan @cancel="cancelRenovatePlan" :btnCancel="true" v-if="showPlanModal" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NSpace } from 'naive-ui';
import TenantHeader from '../components/TenantHeader.vue';
import TenantInfo from '../components/TenantInfo.vue';
import PlanCard from '../components/PlanCard.vue';
import PlanHistory from '../components/PlanHistory.vue';
import { useTenant } from '../composables/useTenant';
import { ButtonArrow } from '@/components/shared/ui';
import { Modal } from "@/components/shared/modal";
import CreateAndUpdate from "@/modules/tenants/components/CreateAndUpdate.vue";
import RenovatePlan from "@/modules/tenants/components/RenovatePlan.vue";

const { getTenantById, loading, tenant } = useTenant();
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const TenantId = route.params.id as string;
  if (!TenantId) router.push('/Tenant');
  const res = await getTenantById(TenantId);
  if (!res) router.push({ name: 'NotFound' });
});

const isModalVisible = ref(false);
const showPlanModal = ref(false);
const textModal = "Editar Tenante";

const openPlanModal = () => {
  showPlanModal.value = true;
};

const TenantComputed = computed(() => {
  return {
    ...tenant.value,
    logo: tenant.value.logo
  };
});

async function edit(id: string) {
  await getTenantById(id);
  isModalVisible.value = true;
}

function handleCancel() {
  isModalVisible.value = false;
}

async function cancelRenovatePlan() {
  showPlanModal.value = false;
  await getTenantById(tenant.value.id);
}
</script>

<style scoped>
.Tenant-detail {
  width: 100%;
}

.n-card {
  @apply rounded-md shadow-sm;
}

.n-card-header {
  @apply text-lg font-semibold text-[#18181B];
}

.modal-content {
  width: 100%;
}
</style>