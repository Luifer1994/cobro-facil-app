// src/modules/rolesAndPermissions/composables/useRolesAndPermissions.ts

import { storeToRefs } from "pinia"
import { useRoleAndPermissionStore } from "../stores/roleAndPermissionStore"
import { roleAndPermissionRepository } from "../repositories/roleAndPermissionRepository"
import { getRolesOffline, saveRolesOffline } from "./offlineRoles"

export function useRolesAndPermissions() {
  const roleAndPermissionStore = useRoleAndPermissionStore()
  const { roles, loading } = storeToRefs(roleAndPermissionStore)

  const fetchRoles = async () => {
    roleAndPermissionStore.setLoading(true)
    try {
      if (!navigator.onLine) {
        // Offline -> IDB
        const offlineRoles = await getRolesOffline()
        roleAndPermissionStore.setRoles(offlineRoles)
      } else {
        // Online -> API
        const response = await roleAndPermissionRepository.fetRoles()
        roleAndPermissionStore.setRoles(response.data)
        // Guardar en offline
        await saveRolesOffline(response.data)
      }
    } catch (error) {
      console.error("Error al obtener roles:", error)
      // fallback
      const offlineRoles = await getRolesOffline()
      if (offlineRoles.length) {
        roleAndPermissionStore.setRoles(offlineRoles)
      }
    } finally {
      roleAndPermissionStore.setLoading(false)
    }
  }

  return {
    loading,
    fetchRoles,
    roles,
  }
}
