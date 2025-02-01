// src/offline/fetchAllCommonData.ts

import { useRolesAndPermissions } from "@/modules/rolesAndPermissions/composables/useRolesAndPermissions";
import { useDocumentType } from "@/modules/documentTypes/composables/useDocumentType";
import { useCity } from "@/modules/cities/composables/useCity";
import { useLoans } from "@/modules/loans/composables/useLoans";
import { useClients } from "@/modules/clients/composables/useClients";
// ... y así con tus otros catálogos

/**
 * Llama a todos los fetch...() de catálogos
 * para tenerlos listos en la store + IndexedDB (si implementaste offline).
 */
export async function fetchAllCommonData() {
  try {
    const { fetchRoles } = useRolesAndPermissions();
    const { fetchDocumentTypes } = useDocumentType();
    const { fetchAllCities } = useCity();

    // Llamas a cada uno
    await Promise.all([fetchRoles(), fetchDocumentTypes(), fetchAllCities()]);

    /*  estos solo si en el local store existe tenant y tiene un id y si el validTenant es true tambien en localStore */
    if (
      localStorage.getItem("tenant") &&
      localStorage.getItem("validTenant") === "true"
    ) {
      const { fetchLoans } = useLoans();
      const { fetchClientsActive } = useClients();
      await Promise.all([fetchLoans(), fetchClientsActive()]);
    }
  } catch (error) {
    console.error("Error al cargar los catálogos comunes:", error);
  }
}
