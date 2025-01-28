<template>
    <div>
        <div class="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2">
            <!-- Contenedor para Input y Botón Buscar -->
            <div class="flex w-full sm:w-1/2 gap-2">
                <n-input v-model:value="search" type="text" placeholder="Buscar usurio" :clearable="true"
                    @keyup.enter="fetchUsersLocal" class="flex-1" size="small" />

                <ButtonSearch type="primary" class="w-auto" @click="fetchUsersLocal" :disabled="loading" />
            </div>

            <!-- Botón Registrar al final de la columna -->
            <div class="flex justify-end sm:justify-start mt-2 sm:mt-0">
                <ButtonRegister type="primary" class="w-auto" @click="register" />
            </div>
        </div>

        <div class="overflow-x-auto mb-4">
            <Table :columns="columns" :data="users" :loading="loading" class="min-w-max text-white" />


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
import { useUsers } from "@/modules/users/composables/useUsers";
import { NInput } from "naive-ui";
import ModalFrom from "@/modules/users/components/ModalForm.vue";
import { Table } from "@/components/shared/data-display";
import { ButtonSearch, ButtonRegister, ButtonIconEdit } from "@/components/shared/ui";
import { Pagination } from "@/components/shared/navigation";

import type { TableColumn } from "naive-ui/es/data-table/src/interface";
import type { User } from "@/modules/users/types/userInterfaces";

const showModel = ref(false);
const modalTitle = ref("Registrar Usuario");

const {
    users,
    fetchUsers,
    meta,
    search,
    loading,
    updatePage,
    updatePageSize,
    getUserById,
    user,
} = useUsers();

onMounted(async () => {
    await fetchUsers();
});

const columns = [
    { title: "ID", key: "id" },
    { title: "Nombre", key: "name" },
    { title: "Correo", key: "email" },
    {
        title: "Acción",
        key: "actions",
        render(row: User) {
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
    await getUserById(id);
    modalTitle.value = "Editar Usuario";
    showModel.value = true;
}

function register() {
    modalTitle.value = "Registrar Usuario";
    showModel.value = true;
}

async function handleModalClose(show: boolean) {
    showModel.value = show;
    user.value = {} as User;
    await fetchUsers();
}

function fetchUsersLocal() {
    updatePage(1);
}

</script>