<template>
    <n-modal v-model:show="visible" :mask-closable="false" @update:show="handleClose"
        :style="{ maxWidth: '90%', width: '1000px' }">
        <n-card :title="props.modalTitle" :bordered="false" size="huge" role="dialog" aria-modal="true">
            <template #header-extra>
                <n-button size="small" :disabled="loading" @click="onCancel">
                    <n-icon>
                        <Close />
                    </n-icon>
                </n-button>
            </template>
            <n-form ref="formRef" :model="loan" size="small" label-placement="top" :rules="computedRules">
                <n-grid cols="1 m:2" :x-gap="12" responsive="screen">
                    <n-form-item-gi label="Cliente" path="client_id">
                        <n-select v-model:value="loan.client_id" filterable placeholder="Buscar cliente" :options="clientsActive.map((client) => ({
                            value: client.id,
                            label: client.name,
                        }))
                            " :clearable="true" />
                    </n-form-item-gi>
                    <n-form-item-gi label="Monto" path="amount" col="6">
                        <n-input-number :parse="parseCurrency" :format="formatCurrency" v-model:value="loan.amount"
                            button-placement="both" style="width: 100%" placeholder="Ingrese el monto">
                            <template #prefix>
                                $
                            </template>
                        </n-input-number>
                    </n-form-item-gi>

                    <n-form-item-gi label="Tasa de interés" path="interest_rate" col="6">
                        <n-input-number :parse="parseCurrency" :format="formatCurrency"
                            v-model:value="loan.interest_rate" button-placement="both" style="width: 100%"
                            placeholder="Ingrese la tasa de interés">
                            <template #prefix>
                                %
                            </template>
                        </n-input-number>
                    </n-form-item-gi>

                    <n-form-item-gi label="Número de coutas" path="installments_count">
                        <n-input-number v-model:value="loan.installments_count" button-placement="both"
                            style="width: 100%" placeholder="Ingrese la cantidad de cuotas">
                        </n-input-number>
                    </n-form-item-gi>

                    <n-form-item-gi label="Tipo de interés" path="interest_type">
                        <n-select v-model:value="loan.interest_type" placeholder="Seleccione el tipo de interés" :options="interestTypesComputed.map((interestType) => ({
                            value: interestType.value,
                            label: interestType.name,
                        }))
                            " :clearable="true" />
                    </n-form-item-gi>

                    <n-form-item-gi label="Frecuencia de pago" path="payment_frequency">
                        <n-select v-model:value="loan.payment_frequency" placeholder="Seleccione la frecuencia de pago"
                            :options="paymentFrequenciesCombo.map((paymentFrequency) => ({
                                value: paymentFrequency.value,
                                label: paymentFrequency.name,
                            }))
                                " :clearable="true" />
                    </n-form-item-gi>




                </n-grid>
            </n-form>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <ButtonCancel @click="onCancel" :disabled="loading" />
                    <ButtonSave @click="handleValidateButtonClick" :title="loan.id ? 'Actualizar' : 'Crear'"
                        :loading="loading" :disabled="loading" />
                </div>
            </template>
        </n-card>
    </n-modal>
</template>

<script setup lang="ts">
import { ref, defineProps, watch, defineEmits, computed } from "vue";
import { Close } from "@vicons/ionicons5";

import {
    NModal,
    NButton,
    NForm,
    NGrid,
    NFormItemGi,
    NIcon,
    NCard,
    NSelect,
    NInputNumber
} from "naive-ui";
import { ButtonSave, ButtonCancel } from '@/components/shared/ui';
import type { FormInst, FormValidationError } from "naive-ui";
import { rules as generateRules, paymentFrequencies, interestTypes } from "@/modules/loans/utils/utilsLoan";
import { useLoans } from "../composables/useLoans";
import { useMessage } from "naive-ui";
import { useClients } from "@/modules/clients/composables/useClients";

const { clientsActive, fetchClientsActive } = useClients();
const { loan, updateLoan, createLoan, loading } = useLoans();

// Define los eventos que emitirá el componente
const emit = defineEmits(["update:show"]);

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    modalTitle: {
        type: String,
        default: "Modal Title",
    },
});

const visible = ref(props.show);
const formRef = ref<FormInst | null>(null);
const message = useMessage();
const isCreating = computed(() => !loan.value.id);
const computedRules = computed(() => generateRules(isCreating.value));
const paymentFrequenciesCombo = paymentFrequencies();
const interestTypesComputed = interestTypes();

const onCancel = () => {
    visible.value = false;
    emit("update:show", false);
};

const handleClose = () => {
    visible.value = false;
    emit("update:show", false);
};

const handleValidateButtonClick = (e: MouseEvent) => {
    e.preventDefault();
    formRef.value?.validate(
        async (errors: Array<FormValidationError> | undefined) => {
            if (!errors) {
                if (loan.value.id) {
                    const res = await updateLoan(loan.value);

                    if (res) {
                        message.success("prestamo actualizado");
                        visible.value = false;
                        emit("update:show", false);
                    } else {
                        message.error("Error al actualizar el prestamo");
                    }
                } else {
                    const res = await createLoan(loan.value);

                    if (res) {
                        message.success("prestamo creado");
                        visible.value = false;
                        emit("update:show", false);
                    } else {
                        message.error("Error al crear el prestamo");
                    }
                }
            } else {
                message.error("Por favor, complete los campos requeridos");
            }
        }
    );
};

const parseCurrency = (input: string) => {
    const nums = input.replace(/,/g, '').trim()
    if (/^\d+(\.(\d+)?)?$/.test(nums))
        return Number(nums)
    return nums === '' ? null : Number.NaN
}

const formatCurrency = (number: number | null) => {
    if (number === null)
        return ''
    /*  return value.toLocaleString('en-US') */
    const formattedNumber = number.toString().replace(/\D/g, "");
    const rest = formattedNumber.length % 3;
    let currency = formattedNumber.substr(0, rest);
    const thousand = formattedNumber.substr(rest).match(/\d{3}/g);
    let separator;

    if (thousand) {
        separator = rest ? "." : "";
        currency += separator + thousand.join(".");
    }

    return currency;
}


watch(
    () => props.show,
    async (newVal) => {
        visible.value = newVal;
        await fetchClientsActive();
    }
);
</script>

<style scoped>
.modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}
</style>