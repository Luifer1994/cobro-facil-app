<template>
    <div>
        <div class="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2">

            <div class="flex w-full sm:w-1/2 gap-2">
                <n-input v-model:value="search" type="text" placeholder="Buscar Tenante" :clearable="true"
                    @keyup.enter="fetchTenantsLocal" class="flex-1" size="small" />

                <ButtonSearch type="primary" class="w-auto" @click="fetchTenantsLocal" :disabled="loading" />
            </div>


            <div class="flex justify-end sm:justify-start mt-2 sm:mt-0">
                <ButtonRegister type="primary" class="w-auto" @click="register" />
            </div>
        </div>

        <div class="overflow-x-auto mb-4">
            <Table :columns="columns" :data="tenants" :loading="loading" class="min-w-max text-white" />
        </div>
        <div class="flex justify-end">
            <Pagination v-model:page="meta.current_page" v-model:page-size="meta.per_page" :total="meta.total"
                show-size-picker @update:page="updatePage" @update:page-size="updatePageSize" />
        </div>

        <Modal v-model:visible="isModalVisible" :title="textModal" @cancel="handleCancel" :loading="loading">
            <CreateAndUpdate @cancel="cancelCreateUpdate" :btnCancel="true" v-if="isModalVisible" />
        </Modal>

    </div>
</template>

<script setup lang="ts">
import { onMounted, h, ref, watch } from "vue";
import { useRouter } from 'vue-router';
import { useTenant } from "@/modules/tenants/composables/useTenant";
import { useCity } from "@/modules/cities/composables/useCity";
import { NInput } from "naive-ui";
import { Table } from "@/components/shared/data-display";
import { ButtonRegister, ButtonSearch, ButtonIconShow, ButtonIconEdit } from "@/components/shared/ui";
import { Pagination } from "@/components/shared/navigation";
import { Modal } from "@/components/shared/modal";
import CreateAndUpdate from "@/modules/tenants/components/CreateAndUpdate.vue";

import type { TableColumn } from "naive-ui/es/data-table/src/interface";
import type { Tenant } from "@/modules/tenants/types/tenantInterfaces";

const {
    loading,
    fetchTenants,
    tenants,
    search,
    updatePageSize,
    updatePage,
    meta,
    getTenantById,
    tenant,
    setTenant
} = useTenant();
const { fetchCitiesByName } = useCity();
const router = useRouter()

const isModalVisible = ref(false);
const textModal = ref("Registrar Tenante");
const citySearchText = ref('');


onMounted(() => {
    fetchTenants();
});

const columns = [
    {
        title: "Logo", key: "logo",
        render(row: Tenant) {
            return h("img", {
                src: row.logo_url,
                alt: row.name,
                class: "w-auto h-10 rounded-full",
            });
        },
    },
    { title: "ID", key: "id" },
    { title: "Nombre", key: "name" },
    { title: "Correo", key: "email" },
    {
        title: "Dominio", key: "domain",
        render(row: Tenant) {
            return h(
                "a",
                {
                    href: 'http://' + row.domains[0].domain_front,
                    target: "_blank",
                    class: "text-blue-500 font-semibold",
                },
                row.domains[0].domain_front
            );
        },
    },
    {
        title: "Acción",
        key: "actions",
        render(row: Tenant) {
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
                                router.push(`/tenant/${row.id}`);
                            }
                        }
                    }
                )
            ]);
        },
    }
] as TableColumn[];

async function edit(id: string) {
    textModal.value = "Editar Tenante";
    await getTenantById(id);

    // Check if the Tenant has a city and set the city search text
    if (tenant.value.city && tenant.value.city.name) {
        citySearchText.value = tenant.value.city.name;
    }

    await fetchCitiesByName(tenant.value.city.name);
    isModalVisible.value = true;
}


function fetchTenantsLocal() {
    updatePage(1);
}

function register() {
    textModal.value = "Registrar Tenante";
    isModalVisible.value = true;
}

function handleCancel() {
    isModalVisible.value = false;
}

function cancelCreateUpdate() {
    isModalVisible.value = false;
}

watch(
    () => isModalVisible.value,
    (newValue) => {
        if (!newValue) {
            setTenant({} as Tenant);
            citySearchText.value = '';
            fetchTenantsLocal();
        }
    }
);

</script>