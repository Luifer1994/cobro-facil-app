<template>
    <div>
        <div class="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2">
            <!-- Contenedor para Input y Botón Buscar -->
            <div class="flex w-full sm:w-1/2 gap-2">
                <n-input v-model:value="search" type="text" placeholder="Buscar usurio" :clearable="true"
                    @keyup.enter="fetchLoansLocal" class="flex-1" size="small" />

                <ButtonSearch type="primary" class="w-auto" @click="fetchLoansLocal" :disabled="loading" />
            </div>

            <!-- Botón Registrar al final de la columna -->
            <div class="flex justify-end sm:justify-start mt-2 sm:mt-0">
                <ButtonRegister type="primary" class="w-auto" @click="register" />
            </div>
        </div>

        <div class="overflow-x-auto mb-4">
            <Table :columns="columns" :data="loans" :loading="loading" class="min-w-max text-white" />


        </div>
        <div class="flex justify-end">
            <Pagination v-model:page="meta.current_page" v-model:page-size="meta.per_page" :total="meta.total"
                show-size-picker @update:page="updatePage" @update:page-size="updatePageSize" />
        </div>

        <!-- Modal Form -->
        <ModalFrom :show="showModel" @update:show="handleModalClose" :modalTitle="modalTitle" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, h, ref } from "vue";
import { useLoans } from "@/modules/loans/composables/useLoans";
import { NInput, NTag } from "naive-ui";
import ModalFrom from "@/modules/loans/components/ModalForm.vue";
import { Table } from "@/components/shared/data-display";
import { ButtonSearch, ButtonRegister, ButtonIconEdit,ButtonIconShow } from "@/components/shared/ui";
import { Pagination } from "@/components/shared/navigation";
import { formatCurrency, formatDate } from "@/utils/helpers";
import type { TableColumn } from "naive-ui/es/data-table/src/interface";
import type { Loan } from "@/modules/loans/types/loanInterfaces";
import { useRouter } from 'vue-router';
const router = useRouter()

const showModel = ref(false);
const modalTitle = ref("Registrar Prestamo");

const {
    loans,
    fetchLoans,
    meta,
    search,
    loading,
    updatePage,
    updatePageSize,
    getLoanById,
    loan,
} = useLoans();

onMounted(async () => {
    await fetchLoans();
    await fetchClientsActive();
});

const columns = [
    { title: "Cliente", key: "client.name" },
    {
        title: "Monto",
        key: "amount",
        render: (row: Loan) => formatCurrency(row.amount)
    },

    {
        title: "Saldo",
        key: "outstanding_balance",
        render: (row: Loan) => formatCurrency(Number(row.outstanding_balance))
    },
    {
        title: "% Interés",
        key: "interest_rate",
        render: (row: Loan) => row.interest_rate + "%"
    },
    {
        title: "Atrasado",
        key: "total_overdue",
        render: (row: Loan) => formatCurrency(parseFloat(row.total_overdue ?? '0'))
    },
    {
        title: "Próx. Cuota",
        key: "installments[0].due_date",
        render: (row: Loan) =>
            (row.installments && row.installments?.length > 0)
                ? formatDate(row.installments[0].due_date, "DD-MM-YYYY")
                : "-"
    },
    {
        title: "Cuotas",
        key: "installments",
        render: (row: Loan) => `${row.installments_paid_count}/${row.installments_count}`
    },
    {
        title: "Estado",
        key: "status_es",
        render(row: Loan) {
            return h(
                NTag,
                {
                    type: row.color_status,
                    round: true,
                    size: "small",
                },
                { default: () => row.status_es }
            );
        }
    },
    {
        title: "Acción",
        key: "actions",
        render(row: Loan) {
            return h('div', { class: 'flex space-x-2' }, [
                // Botón de Editar
                h(
                    ButtonIconEdit,
                    {
                        onClick: () => {
                            if (row.id !== undefined) {
                                edit(row.id);
                            }
                        },

                    }
                ),
                // Botón de Detalles
                h(
                    ButtonIconShow,
                    {
                        type: "info",
                        onClick: () => {
                            if (row.id !== undefined) {
                                router.push(`/loans/${row.id}`);
                            }
                        }
                    }
                )
            ]);
        },
    }
] as TableColumn[];

async function edit(id: number) {
    await getLoanById(id);
    modalTitle.value = "Editar Prestamo";
    showModel.value = true;
}

function register() {
    modalTitle.value = "Registrar Prestamo";
    showModel.value = true;
}

async function handleModalClose(show: boolean) {
    showModel.value = show;
    loan.value = {} as Loan;
    await fetchLoans();
}

function fetchLoansLocal() {
    updatePage(1);
}

</script>