// src/offline/fetchAllCommonData.ts

import { useRolesAndPermissions } from "@/modules/rolesAndPermissions/composables/useRolesAndPermissions"
import { useDocumentType } from "@/modules/documentTypes/composables/useDocumentType"
import { useCity } from "@/modules/cities/composables/useCity"
import { useLoans } from "@/modules/loans/composables/useLoans"
import { useClients } from "@/modules/clients/composables/useClients"
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
    const { fetchLoans } = useLoans()
    const { fetchClientsActive } = useClients()
    // Llamas a cada uno
    await Promise.all([
      fetchRoles(),
      fetchDocumentTypes(),
      fetchAllCities(),
      fetchLoans(),
      fetchClientsActive(),
      // etc.
    ])
  } catch (error) {
    console.error("Error al cargar los catálogos comunes:", error)
  }
}
