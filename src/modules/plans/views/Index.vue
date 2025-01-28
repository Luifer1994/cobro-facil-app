<template>
    <div>
        <div class="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2">

            <div class="flex w-full sm:w-1/2 gap-2">
                <n-input v-model:value="search" type="text" placeholder="Buscar plan" :clearable="true"
                    @keyup.enter="fetchPlansLocal" class="flex-1" size="small" />

                <ButtonSearch type="primary" class="w-auto" @click="fetchPlansLocal" :disabled="loading" />
            </div>


            <div class="flex justify-end sm:justify-start mt-2 sm:mt-0">
                <ButtonRegister type="primary" class="w-auto" @click="register" />
            </div>
        </div>

        <div class="overflow-x-auto mb-4">
            <Table :columns="columns" :data="plans" :loading="loading" class="min-w-max text-white" />
        </div>
        <div class="flex justify-end">
            <Pagination v-model:page="meta.current_page" v-model:page-size="meta.per_page" :total="meta.total"
                show-size-picker @update:page="updatePage" @update:page-size="updatePageSize" />
        </div>

    </div>
</template>

<script setup lang="ts">
import { onMounted, h, ref, watch } from "vue";
import { usePlan } from "@/modules/plans/composables/usePlan";
import { NInput } from "naive-ui";
import { formatCurrency } from "@/utils/helpers";
import { Table } from "@/components/shared/data-display";
import { ButtonRegister, ButtonSearch, ButtonIconEdit } from "@/components/shared/ui";
import { Pagination } from "@/components/shared/navigation";
import type { TableColumn } from "naive-ui/es/data-table/src/interface";
import type { Plan } from "@/modules/plans/types/planInterface";

const {
    loading,
    fetchPlans,
    plans,
    search,
    updatePageSize,
    updatePage,
    meta,
} = usePlan();

const isModalVisible = ref(false);
const citySearchText = ref('');

onMounted(() => {
    fetchPlans();
});

const columns = [

    { title: "ID", key: "id" },
    { title: "Nombre", key: "name" },
    { title: "Descripción", key: "description" },
    {
        title: "Precio", key: "price",
        render(row: Plan) {
            return "$" + formatCurrency(row.price);
        }
    },
    {
        title: "Acción",
        key: "actions",
        render(row: Plan) {
            return h(
                ButtonIconEdit,
                {
                    onClick: () => {
                        if (row.id !== undefined) {
                            edit(row.id.toString());
                        }
                    }
                }
            );
        },
    }
] as TableColumn[];

async function edit(id: string) {
    console.log(id);
}


function fetchPlansLocal() {
    updatePage(1);
}

function register() {
    console.log("Registrar Plan");
}

watch(
    () => isModalVisible.value,
    (newValue) => {
        if (!newValue) {
            citySearchText.value = '';
            fetchPlansLocal();
        }
    }
);

</script>