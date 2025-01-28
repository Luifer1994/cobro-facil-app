// src/offline/fetchAllCommonData.ts

import { useRolesAndPermissions } from "@/modules/rolesAndPermissions/composables/useRolesAndPermissions"
import { useDocumentType } from "@/modules/documentTypes/composables/useDocumentType"
import { useCity } from "@/modules/cities/composables/useCity"
// ... y así con tus otros catálogos

/**
 * Llama a todos los fetch...() de catálogos
 * para tenerlos listos en la store + IndexedDB (si implementaste offline).
 */
export async function fetchAllCommonData() {
  try {
    const { fetchRoles } = useRolesAndPermissions()
    const { fetchDocumentTypes } = useDocumentType()
    const { fetchAllCities } = useCity()
    // Llamas a cada uno
    await Promise.all([
      fetchRoles(),
      fetchDocumentTypes(),
      fetchAllCities(),
      // etc.
    ])
    console.log("Todos los catálogos cargados correctamente")
  } catch (error) {
    console.error("Error al cargar los catálogos comunes:", error)
  }
}
