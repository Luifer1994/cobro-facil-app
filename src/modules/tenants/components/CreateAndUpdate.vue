<template>
    <div>
        <n-form size="small" label-placement="top" ref="formRef" :model="tenant" :rules="computedRules">
            <n-grid cols="1 m:2" :x-gap="16" responsive="screen">
                <!-- Dominio -->
                <n-form-item-gi label="Dominio" path="id">
                    <n-input v-model:value="tenant.id" placeholder="Dominio" size="medium" style="width: 100%"
                        :disabled="!isCreating" />
                </n-form-item-gi>

                <!-- Nombre -->
                <n-form-item-gi label="Nombre" path="name">
                    <n-input v-model:value="tenant.name" placeholder="Nombre" size="medium" style="width: 100%" />
                </n-form-item-gi>

                <!-- Color primario -->
                <n-form-item-gi label="Color primario" path="primary_color">
                    <n-color-picker v-model:value="tenant.primary_color" :modes="['hex']" size="medium"
                        style="width: 100%" />
                </n-form-item-gi>

                <!-- Color secundario -->
                <n-form-item-gi label="Color secundario" path="secondary_color">
                    <n-color-picker v-model:value="tenant.secondary_color" :modes="['hex']" size="medium"
                        style="width: 100%" />
                </n-form-item-gi>

                <!-- Tipo de documento -->
                <n-form-item-gi label="Tipo de documento" path="document_type_id">
                    <n-select v-model:value="tenant.document_type_id" size="medium" style="width: 100%" filterable
                        placeholder="Buscar tipo de documento" :options="documentTypes.map((documentType : DocumentType) => ({
                            value: documentType.id,
                            label: `${documentType.code} - ${documentType.name}`,
                        }))" :clearable="true" />
                </n-form-item-gi>

                <!-- Documento -->
                <n-form-item-gi label="Documento" path="document_number">
                    <n-input v-model:value="tenant.document_number" placeholder="Documento" size="medium"
                        style="width: 100%" />
                </n-form-item-gi>

                <!-- Correo -->
                <n-form-item-gi label="Correo" path="email">
                    <n-input v-model:value="tenant.email" placeholder="Correo" size="medium" style="width: 100%" />
                </n-form-item-gi>

                <!-- Dirección -->
                <n-form-item-gi label="Dirección" path="address">
                    <n-input v-model:value="tenant.address" placeholder="Dirección" size="medium"
                        style="width: 100%" />
                </n-form-item-gi>

                <!-- Celular -->
                <n-form-item-gi label="Celular" path="cell_phone">
                    <n-input v-model:value="tenant.cell_phone" placeholder="Celular" size="medium"
                        style="width: 100%" />
                </n-form-item-gi>

                <!-- Ciudad -->
                <n-form-item-gi label="Ciudad" path="city_id">
                    <n-auto-complete v-model:value="citySearchText" size="medium" style="width: 100%"
                        :options="formattedCities" placeholder="Buscar ciudad" clearable
                        @update:value="handleSearchCity" @select="handleSelectCity" />
                </n-form-item-gi>

                <!-- Plan -->
                <n-form-item-gi label="Plan" path="plan_id">
                    <n-select :disabled="!isCreating" v-model:value="tenant.plan_id" size="medium"
                        style="width: 100%" filterable placeholder="Buscar plan" :options="plansActive.map((planActive : Plan) => ({
                            value: planActive.id,
                            label: planActive.name,
                        }))" :clearable="true" />
                </n-form-item-gi>

                <!-- Logo -->
                <n-form-item-gi label="Logo" path="logo">
                    <n-upload list-type="image-card" :file-list="logoFileList" :max="1" @preview="handlePreview"
                        @change="handleChange" @remove="handleRemove" accept="image/*" :default-upload="false"
                        :show-preview-button="true" :show-remove-button="true">
                        {{ logoFileList.length === 0 ? 'Subir Logo' : 'Cambiar Logo' }}
                    </n-upload>
                    <n-modal v-model:show="showModalRef" preset="card" style="width: 600px"
                        title="Vista previa del logo">
                        <img v-if="previewImageUrlRef" :src="previewImageUrlRef" style="width: 100%"
                            alt="Logo Preview" />
                    </n-modal>
                </n-form-item-gi>

                <!-- Botones -->
                <n-form-item-gi :span="2">
                    <div class="button-container">
                        <ButtonCancel v-if="btnCancel" @click="handleCancel" :disabled="loading" />
                        <ButtonSave @click="handleValidateButtonClick" :title="isCreating ? 'Crear' : 'Actualizar'"
                            :loading="loading" :disabled="loading" />
                    </div>
                </n-form-item-gi>
            </n-grid>
        </n-form>
    </div>
</template>

<script setup lang="ts">
import {
    ref,
    computed,
    onMounted,
    defineEmits,
    defineProps,
    nextTick,
    watch,
    onBeforeMount
} from 'vue'
import {
    NForm,
    NFormItemGi,
    NInput,
    NGrid,
    useMessage,
    NSelect,
    NAutoComplete,
    NColorPicker,
    NUpload,
    NModal,
    type FormInst,
    type UploadFileInfo
} from 'naive-ui'
import { ButtonSave, ButtonCancel } from '@/components/shared/ui'
import { useTenant } from '@/modules/tenants/composables/useTenant'
import { rulesCreateUpdate as generateRules } from '@/modules/tenants/utils/utilsTenant'
import { useDocumentType } from '@/modules/documentTypes/composables/useDocumentType'
import { useCity } from '@/modules/cities/composables/useCity'
import { usePlan } from '@/modules/plans/composables/usePlan'
import { debounce } from 'lodash'
import type { Plan } from '@/modules/plans/types/planInterface'
import type { DocumentType } from '@/modules/documentTypes/types/documentTypeInterfaces'

defineProps<{ btnCancel: boolean }>()
const emits = defineEmits(['cancel'])

const { tenant, createTenant, updateTenant, loading } = useTenant()
const { documentTypes, fetchDocumentTypes } = useDocumentType()
const { plansActive, fetchPlansActive } = usePlan()
const { cities, fetchCitiesByName } = useCity()

const formRef = ref<FormInst | null>(null)
const message = useMessage()

// Cambiamos la definición del array a UploadFileInfo[] para evitar el error de tipos
const logoFileList = ref<UploadFileInfo[]>([])

const previewImageUrlRef = ref('')
const showModalRef = ref(false)
const citySearchText = ref('')

// Verificamos si es creación o actualización
const isCreating = !tenant.value.id

// Reglas de validación
const computedRules = computed(() => generateRules(isCreating))

// Formateo de las ciudades para el AutoComplete
const formattedCities = computed(() =>
    cities.value.map(city => ({
        label: city.name,
        value: city.id,
        id: city.id,
        children: []
    }))
)

// Carga inicial de datos
onMounted(async () => {
    await Promise.all([
        fetchDocumentTypes(),
        fetchPlansActive(),
    ])

    // Si no es creación y tenemos la ciudad guardada, sincronizamos el campo de búsqueda
    if (!isCreating && tenant.value.city) {
        citySearchText.value = tenant.value.city.name
        if (!cities.value.some(city => city.id === tenant.value.city_id)) {
            cities.value = [...cities.value, tenant.value.city]
        }
    }
})

// Creamos un helper para generar los objetos que se almacenan en logoFileList
const createFileListItem = (url: string, name = 'Logo'): UploadFileInfo => ({
    id: Date.now().toString(),
    name,
    status: 'finished',
    url,
    // Naive UI usa `thumbUrl` en lugar de `thumbnailUrl`.
    thumbnailUrl: url
})

// Inicialización del logo si estamos en modo edición
const initializeLogo = () => {
    if (!isCreating && tenant.value.logo) {
        try {
            const logo = tenant.value.logo
            // Determinamos si es un archivo (File) o una URL
            const logoUrl = typeof logo === 'string'
                ? logo
                : URL.createObjectURL(logo)

            const fileListItem = createFileListItem(logoUrl)
            logoFileList.value = [fileListItem]
            previewImageUrlRef.value = logoUrl
        } catch (error) {
            console.error('Error initializing logo:', error)
            logoFileList.value = []
            previewImageUrlRef.value = ''
        }
    } else {
        logoFileList.value = []
        previewImageUrlRef.value = ''
    }
}

// Antes de montar el componente, inicializamos el logo
onBeforeMount(() => {
    initializeLogo()
})

// Manejo del botón "Crear" o "Actualizar"
const handleValidateButtonClick = (e: Event) => {
    e.preventDefault()
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            try {
                const result = isCreating
                    ? await createTenant(tenant.value)
                    : await updateTenant(tenant.value)

                if (result) {
                    message.success(
                        `Tenante ${isCreating ? 'creado' : 'actualizado'} correctamente.`
                    )
                    emits('cancel')
                }
            } catch (error) {
                message.error('Error al procesar el Tenante.')
            }
        } else {
            message.error('Por favor, completa los campos requeridos.')
        }
    })
}

// Búsqueda de ciudades (con debounce)
const handleSearchCity = debounce(async (search) => {
    if (!search?.trim()) {
        cities.value = []
        return
    }
    await fetchCitiesByName(search)
}, 300)

// Asignación de la ciudad seleccionada
const handleSelectCity = (value: number | null) => {
    tenant.value.city_id = value || null
}

// Manejo del botón "Cancelar"
const handleCancel = () => {
    emits('cancel')
}

// Vista previa de imagen en el modal
const handlePreview = (file: Required<UploadFileInfo>) => {
    previewImageUrlRef.value =
        file.url || (file.file ? URL.createObjectURL(file.file) : '')
    showModalRef.value = true
}

// Manejo del cambio en la carga de archivos
const handleChange = ({ file }: { file: Required<UploadFileInfo> }) => {
    if (file.status === 'removed') {
        return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
        const previewUrl = e.target?.result as string
        // Guardamos el File en tenant.value.logo para usarlo al crear/actualizar
        tenant.value.logo = file.file || null
        // Actualizamos la lista con el nuevo archivo
        logoFileList.value = [createFileListItem(previewUrl, file.name)]
        previewImageUrlRef.value = previewUrl
    }
    if (file.file) {
        reader.readAsDataURL(file.file)
    }
}

// Remover el logo
const handleRemove = () => {
    logoFileList.value = []
    tenant.value.logo = null
    previewImageUrlRef.value = ''
}

// Sincroniza el nombre de la ciudad al cambiar tenant.value.city
watch(
    () => tenant.value.city,
    async (newCity) => {
        if (newCity?.name) {
            if (!cities.value.some(city => city.id === newCity.id)) {
                cities.value = [...cities.value, newCity]
            }
            await nextTick()
            citySearchText.value = newCity.name
        }
    },
    { immediate: true }
)
</script>

<style scoped>
.button-container {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
}
</style>
