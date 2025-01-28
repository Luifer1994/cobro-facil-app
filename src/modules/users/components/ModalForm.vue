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
            <n-form ref="formRef" :model="user" size="small" label-placement="top" :rules="computedRules">
                <n-grid cols="1 m:2" :x-gap="12" responsive="screen">
                    <n-form-item-gi label="Nombre" path="name">
                        <n-input v-model:value="user.name" placeholder="Nombre" />
                    </n-form-item-gi>

                    <n-form-item-gi label="Correo" path="email">
                        <n-input v-model:value="user.email" placeholder="Correo" />
                    </n-form-item-gi>

                    <n-form-item-gi label="Celular" path="phone">
                        <n-input v-model:value="user.phone" placeholder="Celular" />
                    </n-form-item-gi>

                    <n-form-item-gi label="Contraseña" path="password">
                        <n-input v-model:value="user.password" placeholder="Contraseña" />
                    </n-form-item-gi>

                    <n-form-item-gi label="Rol" path="role_id">
                        <n-select v-model:value="user.role_id" filterable placeholder="Buscar rol" :options="roles.map((role) => ({
                            value: role.id,
                            label: role.description,
                        }))
                            " :clearable="true" />
                    </n-form-item-gi>
                </n-grid>
            </n-form>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <ButtonCancel @click="onCancel" :disabled="loading" />
                    <ButtonSave @click="handleValidateButtonClick" :title="user.id ? 'Actualizar' : 'Crear'"
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
    NInput,
    NFormItemGi,
    NIcon,
    NCard,
    NSelect
} from "naive-ui";
import { ButtonSave, ButtonCancel } from '@/components/shared/ui';

import type { FormInst, FormValidationError } from "naive-ui";
import { rules as generateRules } from "@/modules/users/utils/utilsUser";

import { useMessage } from "naive-ui";
import { useUsers } from "@/modules/users/composables/useUsers";
import { useRolesAndPermissions } from "@/modules/rolesAndPermissions/composables/useRolesAndPermissions";

const { user, createUser, updateUser, loading } =
    useUsers();
const { roles, fetchRoles } = useRolesAndPermissions();

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
const isCreating = computed(() => !user.value.id);
const computedRules = computed(() => generateRules(isCreating.value));

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
                if (user.value.id) {
                    const res = await updateUser(user.value);

                    if (res) {
                        message.success("Usuario actualizado");
                        visible.value = false;
                        emit("update:show", false);
                    } else {
                        message.error("Error al actualizar el usuario");
                    }
                } else {
                    const res = await createUser(user.value);

                    if (res) {
                        message.success("Usuario creado");
                        visible.value = false;
                        emit("update:show", false);
                    } else {
                        message.error("Error al crear el usuario");
                    }
                }
            } else {
                message.error("Por favor, complete los campos requeridos");
            }
        }
    );
};

watch(
    () => props.show,
    async (newVal) => {
        visible.value = newVal;
        await fetchRoles();
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