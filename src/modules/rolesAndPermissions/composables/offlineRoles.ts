// src/modules/rolesAndPermissions/composables/offlineRoles.ts
import { getDB } from '@/offline/offlineDB'
import type { Role } from '../types/roleAndPermissionInterfaces'

export async function saveRolesOffline(roles: Role[]) {
  const db = await getDB()
  const tx = db.transaction('roles_offline', 'readwrite')
  await tx.store.clear()
  for (const role of roles) {
    await tx.store.put(role)
  }
  await tx.done
  console.log('Roles guardados offline:', roles)
}

export async function getRolesOffline(): Promise<Role[]> {
  const db = await getDB()
  const rolesOffline = await db.getAll('roles_offline')
  console.log('Roles offline:', rolesOffline)
  return rolesOffline
}
