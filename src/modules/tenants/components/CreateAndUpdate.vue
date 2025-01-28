<template>
    <div>
      <n-form size="small" label-placement="top" ref="formRef" :model="tenant" :rules="computedRules">
        <n-grid cols="1 m:2" :x-gap="16" responsive="screen">
          <!-- Dominio -->
          <n-form-item-gi label="Dominio" path="id">
            <n-input
              v-model:value="tenant.id"
              placeholder="Dominio"
              size="medium"
              style="width: 100%"
              :disabled="!isCreating"
            />
          </n-form-item-gi>
  
          <!-- Nombre -->
          <n-form-item-gi label="Nombre" path="name">
            <n-input
              v-model:value="tenant.name"
              placeholder="Nombre"
              size="medium"
              style="width: 100%"
            />
          </n-form-item-gi>
  
          <!-- Color primario -->
          <n-form-item-gi label="Color primario" path="primary_color">
            <n-color-picker
              v-model:value="tenant.primary_color"
              :modes="['hex']"
              size="medium"
              style="width: 100%"
            />
          </n-form-item-gi>
  
          <!-- Color secundario -->
          <n-form-item-gi label="Color secundario" path="secondary_color">
            <n-color-picker
              v-model:value="tenant.secondary_color"
              :modes="['hex']"
              size="medium"
              style="width: 100%"
            />
          </n-form-item-gi>
  
          <!-- Tipo de documento -->
          <n-form-item-gi label="Tipo de documento" path="document_type_id">
            <n-select
              v-model:value="tenant.document_type_id"
              size="medium"
              style="width: 100%"
              filterable
              placeholder="Buscar tipo de documento"
              :options="documentTypes.map((documentType: DocumentType) => ({
                value: documentType.id,
                label: `${documentType.code} - ${documentType.name}`
              }))"
              :clearable="true"
            />
          </n-form-item-gi>
  
          <!-- Documento -->
          <n-form-item-gi label="Documento" path="document_number">
            <n-input
              v-model:value="tenant.document_number"
              placeholder="Documento"
              size="medium"
              style="width: 100%"
            />
          </n-form-item-gi>
  
          <!-- Correo -->
          <n-form-item-gi label="Correo" path="email">
            <n-input
              v-model:value="tenant.email"
              placeholder="Correo"
              size="medium"
              style="width: 100%"
            />
          </n-form-item-gi>
  
          <!-- Dirección -->
          <n-form-item-gi label="Dirección" path="address">
            <n-input
              v-model:value="tenant.address"
              placeholder="Dirección"
              size="medium"
              style="width: 100%"
            />
          </n-form-item-gi>
  
          <!-- Celular -->
          <n-form-item-gi label="Celular" path="cell_phone">
            <n-input
              v-model:value="tenant.cell_phone"
              placeholder="Celular"
              size="medium"
              style="width: 100%"
            />
          </n-form-item-gi>
  
          <!-- Ciudad -->
          <n-form-item-gi label="Ciudad" path="city_id">
            <n-auto-complete
              v-model:value="citySearchText"
              size="medium"
              style="width: 100%"
              :options="formattedCities"
              placeholder="Buscar ciudad"
              clearable
              @update:value="handleSearchCity"
              @select="handleSelectCity"
            />
          </n-form-item-gi>
  
          <!-- Plan -->
          <n-form-item-gi label="Plan" path="plan_id">
            <n-select
              :disabled="!isCreating"
              v-model:value="tenant.plan_id"
              size="medium"
              style="width: 100%"
              filterable
              placeholder="Buscar plan"
              :options="plansActive.map((planActive: Plan) => ({
                value: planActive.id,
                label: planActive.name
              }))"
              :clearable="true"
            />
          </n-form-item-gi>
  
          <!-- Logo -->
          <n-form-item-gi label="Logo" path="logo">
            <n-upload
              list-type="image-card"
              :file-list="logoFileList"
              :max="1"
              @preview="handlePreview"
              @change="handleChange"
              @remove="handleRemove"
              accept="image/*"
              :default-upload="false"
              :show-preview-button="true"
              :show-remove-button="true"
            >
              {{ logoFileList.length === 0 ? 'Subir Logo' : 'Cambiar Logo' }}
            </n-upload>
            <n-modal
              v-model:show="showModalRef"
              preset="card"
              style="width: 600px"
              title="Vista previa del logo"
            >
              <img
                v-if="previewImageUrlRef"
                :src="previewImageUrlRef"
                style="width: 100%"
                alt="Logo Preview"
              />
            </n-modal>
          </n-form-item-gi>
  
          <!-- Botones -->
          <n-form-item-gi :span="2">
            <div class="button-container">
              <ButtonCancel v-if="btnCancel" @click="handleCancel" :disabled="loading" />
              <ButtonSave
                @click="handleValidateButtonClick"
                :title="isCreating ? 'Crear' : 'Actualizar'"
                :loading="loading"
                :disabled="loading"
              />
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
  import type { City } from '@/modules/cities/types/cityInterfaces'
  
  // Props y eventos
  defineProps<{ btnCancel: boolean }>()
  const emits = defineEmits(['cancel'])
  
  // Tenants
  const { tenant, createTenant, updateTenant, loading } = useTenant()
  const isCreating = !tenant.value.id
  const computedRules = computed(() => generateRules(isCreating))
  
  // Document Types
  const { documentTypes, fetchDocumentTypes } = useDocumentType()
  
  // Plans
  const { plansActive, fetchPlansActive } = usePlan()
  
  // Cities
  // Cargamos todas las ciudades una vez, y filtramos localmente
  const { cities, fetchAllCities, fetchCitiesByName } = useCity()
  
  // Para el <n-auto-complete>
  const citySearchText = ref('')
  const displayCities = ref<City[]>([]) // Arreglo que se usará para la búsqueda local
  
  // Formateo para el autocomplete
  const formattedCities = computed(() =>
    displayCities.value.map((city) => ({
      label: city.name,
      value: city.id,
      id: city.id,
      children: []
    }))
  )
  
  // onMounted: cargamos data principal (doc types, plans, cities)
  onMounted(async () => {
    await Promise.all([
      fetchDocumentTypes(),
      fetchPlansActive(),
      fetchAllCities() // Cargamos todas las ciudades
    ])
  
    // Llenamos displayCities con la lista completa
    displayCities.value = [...cities.value]
  
    // Si no es creación y tenemos la ciudad guardada, sincronizamos el campo
    if (!isCreating && tenant.value.city) {
      citySearchText.value = tenant.value.city.name
      if (!cities.value.some((city) => city.id === tenant.value.city_id)) {
        cities.value = [...cities.value, tenant.value.city]
        displayCities.value = [...cities.value] // Actualizamos display
      }
    }
  })
  
  // LOGO uploads
  const logoFileList = ref<UploadFileInfo[]>([])
  const previewImageUrlRef = ref('')
  const showModalRef = ref(false)
  
  // Helper para Upload
  const createFileListItem = (url: string, name = 'Logo'): UploadFileInfo => ({
    id: Date.now().toString(),
    name,
    status: 'finished',
    url,
    thumbnailUrl: url
  })
  
  // Inicialización del logo si estamos en modo edición
  onBeforeMount(() => {
    if (!isCreating && tenant.value.logo) {
      try {
        const logo = tenant.value.logo
        const logoUrl =
          typeof logo === 'string' ? logo : URL.createObjectURL(logo)
  
        const fileListItem = createFileListItem(logoUrl)
        logoFileList.value = [fileListItem]
        previewImageUrlRef.value = logoUrl
      } catch (error) {
        console.error('Error initializing logo:', error)
        logoFileList.value = []
        previewImageUrlRef.value = ''
      }
    }
  })
  
  // Validar y crear/actualizar
  const formRef = ref<FormInst | null>(null)
  const message = useMessage()
  
  const handleValidateButtonClick = (e: Event) => {
    e.preventDefault()
    formRef.value?.validate(async (errors) => {
      if (!errors) {
        try {
          const result = isCreating
            ? await createTenant(tenant.value)
            : await updateTenant(tenant.value)
  
          if (result) {
            message.success(`Tenante ${isCreating ? 'creado' : 'actualizado'} correctamente.`)
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
  
  // Búsqueda de ciudades local (con debounce)
  const handleSearchCity = debounce((search: string) => {
    if (!search.trim()) {
      // Si la búsqueda está vacía, restauramos todas
      displayCities.value = [...cities.value]
      return
    }
    // Filtramos local
    const filtered = cities.value.filter((city) =>
      city.name.toLowerCase().includes(search.toLowerCase())
    )
    displayCities.value = filtered
  }, 300)
  
  // Asignación de la ciudad seleccionada
  const handleSelectCity = (value: number | null) => {
    tenant.value.city_id = value || null
  }
  
  // Cancelar
  const handleCancel = () => {
    emits('cancel')
  }
  
  // Vista previa de imagen
  const handlePreview = (file: Required<UploadFileInfo>) => {
    previewImageUrlRef.value =
      file.url || (file.file ? URL.createObjectURL(file.file) : '')
    showModalRef.value = true
  }
  
  // Manejo del cambio de archivos
  const handleChange = ({ file }: { file: Required<UploadFileInfo> }) => {
    if (file.status === 'removed') {
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string
      tenant.value.logo = file.file || null
      logoFileList.value = [createFileListItem(previewUrl, file.name)]
      previewImageUrlRef.value = previewUrl
    }
    if (file.file) {
      reader.readAsDataURL(file.file)
    }
  }
  
  // Remover logo
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
        if (!cities.value.some((city) => city.id === newCity.id)) {
          cities.value = [...cities.value, newCity]
          displayCities.value = [...cities.value]
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
  