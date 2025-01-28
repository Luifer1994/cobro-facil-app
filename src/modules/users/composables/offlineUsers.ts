// src/modules/users/composables/offlineUsers.ts

import { getDB } from '@/offline/offlineDB'
import axiosHttp from '@/utils/axios'
import type { User } from '@/modules/users/types/userInterfaces'

// 1) Guardar un usuario en "users_offline"
export async function saveUserOffline(user: User) {
  const db = await getDB()
  const rawUser = JSON.parse(JSON.stringify(user)) // Evita errores de clonación
  await db.put('users_offline', rawUser)
  console.log('Usuario guardado offline:', rawUser)
}

// 2) Obtener todos los users offline
export async function getOfflineUsers(): Promise<User[]> {
  const db = await getDB()
  return db.getAll('users_offline')
}

// 3) Eliminar un user offline
export async function removeOfflineUser(id: number) {
  const db = await getDB()
  await db.delete('users_offline', id)
  console.log('Usuario offline eliminado, ID:', id)
}

// 4) Sincronizar users (enviar a la API real)
export async function syncOfflineUsers() {
  const list = await getOfflineUsers()
  for (const user of list) {
    try {
      // Ajusta tu endpoint
      await axiosHttp.post('users/create', user)
      await removeOfflineUser(user.id!)
      console.log('Usuario sincronizado:', user)
    } catch (error) {
      console.error('Fallo al sincronizar user:', user, error)
    }
  }
}
