// src/modules/clients/composables/offlineClients.ts

import { getDB } from '@/offline/offlineDB'
import axiosHttp from '@/utils/axios'
import type { Client } from '@/modules/clients/types/clientInterfaces'

/**
 * Guarda un cliente (generalmente creado offline) en la store 'clients_offline'.
 */
export async function saveClientOffline(client: Client) {
  const db = await getDB()
  const rawClient = JSON.parse(JSON.stringify(client))
  await db.put('clients_offline', rawClient)
  console.log('Cliente guardado offline (create):', rawClient)
}

/**
 * Actualiza un cliente en 'clients_offline'. 
 * - Si es localOnly=true, solo se guardan sus cambios localmente.
 * - Si es localOnly=false (existe en server), le pondremos pendingUpdate=true para luego sincronizar.
 */
export async function updateClientOffline(client: Client) {
  const db = await getDB()
  const rawClient = JSON.parse(JSON.stringify(client))
  await db.put('clients_offline', rawClient)
  console.log('Cliente actualizado offline (update):', rawClient)
}

/**
 * Guarda la lista de clientes que vienen del servidor, marcándolos localOnly = false.
 * Realizamos un "merge" para no perder los localOnly.
 */
export async function saveClientsOffline(serverClients: Client[]) {
  const db = await getDB()

  // Obtenemos todo lo existente
  const existing = await db.getAll('clients_offline')

  const tx = db.transaction('clients_offline', 'readwrite')

  for (const serverC of serverClients) {
    serverC.localOnly = false
    serverC.pendingUpdate = false
    const raw = JSON.parse(JSON.stringify(serverC))
    await tx.store.put(raw)
  }
  await tx.done
  console.log('Clientes (server) mergeados en offline:', serverClients)
}

/**
 * Retorna TODOS los clientes en 'clients_offline'.
 */
export async function getOfflineClients(): Promise<Client[]> {
  const db = await getDB()
  const all = await db.getAll('clients_offline')
  return all
}

/**
 * Elimina un cliente local por ID (autoIncrement o real).
 */
export async function removeOfflineClient(id: number) {
  const db = await getDB()
  await db.delete('clients_offline', id)
  console.log('Cliente offline eliminado, ID:', id)
}

/**
 * Sincroniza los clientes con el servidor:
 *  1) localOnly=true => POST /clients/create
 *  2) pendingUpdate=true => PUT /clients/update/:id
 */
export async function syncOfflineClients() {
  const db = await getDB()
  const list = await db.getAll('clients_offline')

  for (const client of list) {
    try {
      if (client.localOnly) {
        // Aún no existe en el server => POST create
        const resp = await axiosHttp.post('clients/create', client)
        const created = resp.data.data as Client

        // Eliminamos el client local "viejo"
        if (client.id != null) {
          await removeOfflineClient(client.id)
        }
        // Insertamos el client creado: localOnly=false
        created.localOnly = false
        created.pendingUpdate = false
        const rawCreated = JSON.parse(JSON.stringify(created))
        await db.put('clients_offline', rawCreated)

        console.log('Cliente creado en server y offline:', created)
      }
      else if (client.pendingUpdate) {
        // Ya existe en el server => PUT update
        if (!client.id) {
          console.error('Cliente sin id, no se puede PUT:', client)
          continue
        }
        const resp = await axiosHttp.put(`clients/update/${client.id}`, client)
        const updated = resp.data.data as Client

        // Eliminamos el client local "viejo"
        await removeOfflineClient(client.id)

        updated.localOnly = false
        updated.pendingUpdate = false
        const rawUpdated = JSON.parse(JSON.stringify(updated))
        await db.put('clients_offline', rawUpdated)

        console.log('Cliente actualizado en server y offline:', updated)
      }
      else {
        // Ni localOnly ni pendingUpdate => no hacemos nada
        // (ya sincronizado)
      }
    } catch (error) {
      console.error('Fallo al sincronizar cliente offline:', client, error)
    }
  }
}