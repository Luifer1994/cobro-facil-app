// src/modules/users/composables/offlineUsers.ts

import { getDB } from '@/offline/offlineDB'
import axiosHttp from '@/utils/axios'
import type { User } from '@/modules/users/types/userInterfaces'

/**
 * Guarda un usuario (generalmente creado offline) en la store 'users_offline'.
 */
export async function saveUserOffline(user: User) {
  const db = await getDB()
  const rawUser = JSON.parse(JSON.stringify(user))
  await db.put('users_offline', rawUser)
  console.log('Usuario guardado offline (create):', rawUser)
}

/**
 * Actualiza un usuario en 'users_offline'. 
 * - Si es localOnly=true, solo se guardan sus cambios localmente.
 * - Si es localOnly=false (existe en server), le pondremos pendingUpdate=true para luego sincronizar.
 */
export async function updateUserOffline(user: User) {
  const db = await getDB()
  const rawUser = JSON.parse(JSON.stringify(user))
  await db.put('users_offline', rawUser)
  console.log('Usuario actualizado offline (update):', rawUser)
}

/**
 * Guarda la lista de usuarios que vienen del servidor, marcándolos localOnly = false.
 * Realizamos un "merge" para no perder los localOnly.
 */
export async function saveUsersOffline(serverUsers: User[]) {
  const db = await getDB()

  // Obtenemos todo lo existente
  const existing = await db.getAll('users_offline')

  const tx = db.transaction('users_offline', 'readwrite')

  for (const serverU of serverUsers) {
    serverU.localOnly = false
    serverU.pendingUpdate = false
    const raw = JSON.parse(JSON.stringify(serverU))
    await tx.store.put(raw)
  }
  await tx.done
  console.log('Usuarios (server) mergeados en offline:', serverUsers)
}

/**
 * Retorna TODOS los usuarios en 'users_offline'.
 */
export async function getOfflineUsers(): Promise<User[]> {
  const db = await getDB()
  const all = await db.getAll('users_offline')
  return all
}

/**
 * Elimina un usuario local por ID (autoIncrement o real).
 */
export async function removeOfflineUser(id: number) {
  const db = await getDB()
  await db.delete('users_offline', id)
  console.log('Usuario offline eliminado, ID:', id)
}

/**
 * Sincroniza los usuarios con el servidor:
 *  1) localOnly=true => POST /users/create
 *  2) pendingUpdate=true => PUT /users/update/:id
 */
export async function syncOfflineUsers() {
  const db = await getDB()
  const list = await db.getAll('users_offline')

  for (const user of list) {
    try {
      if (user.localOnly) {
        // Aún no existe en el server => POST create
        const resp = await axiosHttp.post('users/create', user)
        const created = resp.data.data as User

        // Eliminamos el user local "viejo"
        if (user.id != null) {
          await removeOfflineUser(user.id)
        }
        // Insertamos el user creado: localOnly=false
        created.localOnly = false
        created.pendingUpdate = false
        const rawCreated = JSON.parse(JSON.stringify(created))
        await db.put('users_offline', rawCreated)

        console.log('Usuario creado en server y offline:', created)
      }
      else if (user.pendingUpdate) {
        // Ya existe en el server => PUT update
        if (!user.id) {
          console.error('Usuario sin id, no se puede PUT:', user)
          continue
        }
        const resp = await axiosHttp.put(`users/update/${user.id}`, user)
        const updated = resp.data.data as User

        // Eliminamos el user local "viejo"
        await removeOfflineUser(user.id)

        updated.localOnly = false
        updated.pendingUpdate = false
        const rawUpdated = JSON.parse(JSON.stringify(updated))
        await db.put('users_offline', rawUpdated)

        console.log('Usuario actualizado en server y offline:', updated)
      }
      else {
        // Ni localOnly ni pendingUpdate => no hacemos nada
        // (ya sincronizado)
      }
    } catch (error) {
      console.error('Fallo al sincronizar user offline:', user, error)
    }
  }
}
