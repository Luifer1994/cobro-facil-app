<template>
    <div>
        <div class="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2">
            <!-- Contenedor para Input y Botón Buscar -->
            <div class="flex w-full sm:w-1/2 gap-2">
                <n-input v-model:value="search" type="text" placeholder="Buscar usurio" :clearable="true"
                    @keyup.enter="fetchClientsLocal" class="flex-1" size="small" />

                <ButtonSearch type="primary" class="w-auto" @click="fetchClientsLocal" :disabled="loading" />
            </div>

            <!-- Botón Registrar al final de la columna -->
            <div class="flex justify-end sm:justify-start mt-2 sm:mt-0">
                <ButtonRegister type="primary" class="w-auto" @click="register" />
            </div>
        </div>

        <div class="overflow-x-auto mb-4">
            <Table :columns="columns" :data="clients" :loading="loading" class="min-w-max text-white" />


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
import { useClients } from "@/modules/clients/composables/useClients";
import { NInput } from "naive-ui";
import ModalFrom from "@/modules/clients/components/ModalForm.vue";
import { Table } from "@/components/shared/data-display";
import { ButtonSearch, ButtonRegister, ButtonIconEdit } from "@/components/shared/ui";
import { Pagination } from "@/components/shared/navigation";

import type { TableColumn } from "naive-ui/es/data-table/src/interface";
import type { Client } from "@/modules/clients/types/clientInterfaces";

const showModel = ref(false);
const modalTitle = ref("Registrar Client");

const {
    clients,
    fetchClients,
    meta,
    search,
    loading,
    updatePage,
    updatePageSize,
    getClientById,
    client,
} = useClients();

onMounted(async () => {
    await fetchClients();
});

const columns = [
    { title: "ID", key: "id" },
    { title: "Nombre", key: "name" },
    { title: "# Documento", key: "document" },
    { title: "Celular", key: "phone" },
    { title: "Correo", key: "email" },
    {
        title: "Acción",
        key: "actions",
        render(row: Client) {
            return h(
                ButtonIconEdit,
                {
                    onClick: () => {
                        if (row.id !== undefined) {
                            edit(row.id);
                        }
                    }
                }
            );
        },
    }
] as TableColumn[];

async function edit(id: number) {
    console.log(id);
    await getClientById(id);
    modalTitle.value = "Editar Client";
    showModel.value = true;
}

function register() {
    modalTitle.value = "Registrar Client";
    showModel.value = true;
}

async function handleModalClose(show: boolean) {
    showModel.value = show;
    client.value = {} as Client;
    await fetchClients();
}

function fetchClientsLocal() {
    updatePage(1);
}

</script>