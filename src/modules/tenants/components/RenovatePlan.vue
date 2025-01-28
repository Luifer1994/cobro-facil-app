<template>
    <div>
        <n-form size="small" label-placement="top" ref="formRef" :model="tenant" :rules="computedRules">
            <n-grid cols="1" :x-gap="16" responsive="screen">

                <n-form-item-gi label="Plan" path="plan_id">
                    <n-select v-model:value="tenant.plan_id" size="medium" style="width: 100%" filterable
                        placeholder="Buscar plan" :options="plansActive.map((planActive) => ({
                            value: planActive.id,
                            label: planActive.name,
                        }))" :clearable="true" />
                </n-form-item-gi>

                <n-form-item-gi :span="2">
                    <div class="button-container">
                        <ButtonCancel v-if="btnCancel" @click="handleCancel" :disabled="loading" />
                        <ButtonSave @click="handleValidateButtonClick" :title="'Renovar'"
                            :loading="loading" :disabled="loading" />
                    </div>
                </n-form-item-gi>
            </n-grid>
        </n-form>
    </div>
</template>

<script setup lang="ts">
import { onMounted, defineEmits, computed, ref, defineProps } from 'vue';
import { useTenant } from '@/modules/tenants/composables/useTenant';
import { usePlan } from '@/modules/plans/composables/usePlan';
import { rulesChangePlan } from '@/modules/tenants/utils/utilsTenant';
import { ButtonSave, ButtonCancel } from '@/components/shared/ui';
import {
    NForm,
    NFormItemGi,
    NGrid,
    NSelect,
    useMessage,
    type FormInst
} from 'naive-ui';

const { plansActive, fetchPlansActive } = usePlan();
const { tenant, loading, renovatePlan } = useTenant();

const formRef = ref<FormInst | null>(null);
const emits = defineEmits(['cancel']);
const message = useMessage();
const computedRules = computed(() => rulesChangePlan());
defineProps<{ btnCancel: boolean }>();

onMounted(async () => {
    await fetchPlansActive();
});

const handleCancel = () => {
    emits('cancel');
};

const handleValidateButtonClick = (e: Event) => {
    e.preventDefault();
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            try {
                const result = await renovatePlan(tenant.value.id, tenant.value.plan_id);
                if (result) {
                    message.success("Plan actualizado correctamente.");
                    emits('cancel');
                }
            } catch (error) {
                message.error("Error al procesar el Tenante.");
            }
        } else {
            message.error("Por favor, completa los campos requeridos.");
        }
    });
};

</script>