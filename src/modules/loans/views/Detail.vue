<template>
    <div class="min-h-screen bg-gray-50 w-100">
        <div class="mx-auto">
            <!-- Back Button -->
            <div class="mb-6">
                <ButtonArrow icon="left" text="Atrás" redirect="/loans" />
            </div>

            <div v-if="loan" class="space-y-6">
                <!-- Header Card -->
                <n-card class="shadow-sm">
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="flex items-center gap-3 mb-2">
                                <h1 class="text-2xl font-bold">Préstamo #{{ loan.id }}</h1>
                                <n-tag :type="loan.color_status" round>
                                    {{ loan.status_es }}
                                </n-tag>
                            </div>
                            <p class="text-gray-500">Cliente: {{ loan.client?.name }}</p>
                        </div>
                        <ButtonIconEdit type="primary" @click="handleEdit" />
                    </div>
                </n-card>

                <!-- Main Info Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Left Column -->
                    <div class="space-y-6">
                        <!-- Loan Details -->
                        <n-card title="Detalles del Préstamo" class="shadow-sm">
                            <n-grid cols="2" :x-gap="12" :y-gap="8">
                                <n-grid-item>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Monto</p>
                                        <p class="text-lg font-semibold">{{ formatCurrency(loan.amount) }}</p>
                                    </div>
                                </n-grid-item>
                                <n-grid-item>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Saldo Pendiente</p>
                                        <p class="text-lg font-semibold">{{ formatCurrency(loan.outstanding_balance) }}
                                        </p>
                                    </div>
                                </n-grid-item>
                                <n-grid-item>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Tasa de Interés</p>
                                        <div class="flex items-center gap-2">
                                            <p class="text-lg font-semibold">{{ loan.interest_rate }}%</p>
                                            <n-tag size="small" :type="loan.color_interest_type">
                                                {{ loan.interest_type_es }}
                                            </n-tag>
                                        </div>
                                    </div>
                                </n-grid-item>
                                <n-grid-item>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Frecuencia de Pago</p>
                                        <div class="flex items-center gap-2">
                                            <p class="text-lg font-semibold">{{ loan.payment_frequency_es }}</p>
                                        </div>
                                    </div>
                                </n-grid-item>
                            </n-grid>
                        </n-card>

                        <!-- Client Information -->
                        <n-card title="Información del Cliente" class="shadow-sm">
                            <n-grid cols="2" :x-gap="12" :y-gap="8">
                                <n-grid-item>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Nombre</p>
                                        <p class="font-medium">{{ loan.client?.name }}</p>
                                    </div>
                                </n-grid-item>
                                <n-grid-item>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Documento</p>
                                        <p class="font-medium">{{ loan.client?.document_type?.code }} {{
                                            loan.client?.document }}</p>
                                    </div>
                                </n-grid-item>
                                <n-grid-item>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Email</p>
                                        <p class="font-medium">{{ loan.client?.email }}</p>
                                    </div>
                                </n-grid-item>
                                <n-grid-item>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Teléfono</p>
                                        <p class="font-medium">{{ loan.client?.phone }}</p>
                                    </div>
                                </n-grid-item>
                            </n-grid>
                        </n-card>
                    </div>

                    <div class="space-y-6">
                        <n-card title="Progreso de Pagos" class="shadow-sm">
                            <div class="space-y-4">
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-500">Cuotas Pagadas</span>
                                    <span class="font-semibold">{{ loan.installments_paid_count }}/{{
                                        loan.installments_count }}</span>
                                </div>
                                <n-progress type="line"
                                    :percentage="(loan.installments_paid_count / loan.installments_count) * 100"
                                    :indicator-placement="'inside'" />
                                <div class="grid grid-cols-2 gap-4 mt-4">
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Próximo Pago</p>
                                        <p class="font-medium">{{ (loan.installments && loan.installments?.length > 0) ?
                                            formatDate(loan.installments[0]?.due_date, 'DD-MM-YYYY') : "-"}}</p>
                                    </div>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Monto</p>
                                        <p class="font-medium">{{ (loan.installments && loan.installments?.length > 0) ?
                                            formatCurrency(loan.installments[0]?.expected_amount) : "-"}}</p>
                                    </div>
                                </div>
                            </div>
                        </n-card>

                        <n-card title="Fechas Importantes" class="shadow-sm">
                            <n-grid cols="2" :x-gap="12" :y-gap="8">
                                <n-grid-item>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Fecha Inicio</p>
                                        <p class="font-medium">{{ formatDate(loan.start_date, "DD-MM-YYYY") }}</p>
                                    </div>
                                </n-grid-item>
                                <n-grid-item>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Fecha Estimada Fin</p>
                                        <p class="font-medium">{{ formatDate(loan.estimated_end_date, "DD-MM-YYYY") }}
                                        </p>
                                    </div>
                                </n-grid-item>
                            </n-grid>
                        </n-card>

                        <n-card title="Información Adicional" class="shadow-sm">
                            <n-grid cols="2" :x-gap="12" :y-gap="8">
                                <n-grid-item>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Total Pagado</p>
                                        <p class="font-medium">{{ (loan.total_paid) ?
                                            formatCurrency(Number(loan.total_paid)) : "-" }}</p>
                                    </div>
                                </n-grid-item>
                                <n-grid-item>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Total Vencido</p>
                                        <p class="font-medium text-red-600">{{ (loan.total_overdue) ?
                                            formatCurrency(Number(loan.total_overdue)) : "-" }}</p>
                                    </div>
                                </n-grid-item>
                            </n-grid>
                        </n-card>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NCard, NGrid, NGridItem, NTag, NProgress } from 'naive-ui'
import { ButtonIconEdit, ButtonArrow } from '@/components/shared/ui';
import { useLoans } from '@/modules/loans/composables/useLoans'
import { formatCurrency, formatDate } from '@/utils/helpers'

const route = useRoute()
const router = useRouter()
const { getLoanById, loan } = useLoans()

onMounted(async () => {
    const loanId = Number(route.params.id)
    if (!loanId) {
        router.push('/loans')
        return
    }
    await getLoanById(loanId)
})

const handleEdit = () => {
    // Implement edit functionality
    console.log('Edit loan:', loan.value?.id)
}
</script>