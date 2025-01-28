// src/offline/offlineDB.ts

import { openDB } from 'idb'

/**
 * Abre/crea la BD "my-app" en la versión 1 (o 2, etc.)
 * Crea las object stores que necesites: users_offline, roles_offline, etc.
 */
export async function getDB() {
  return openDB('my-app', 1, {
    upgrade(db) {
      // Store para usuarios offline
      if (!db.objectStoreNames.contains('users_offline')) {
        db.createObjectStore('users_offline', { keyPath: 'id', autoIncrement: true })
      }
      // Store para clientes offline
      if (!db.objectStoreNames.contains('clients_offline')) {
        db.createObjectStore('clients_offline', { keyPath: 'id', autoIncrement: true })
      }

      // Store para roles offline
      if (!db.objectStoreNames.contains('roles_offline')) {
        db.createObjectStore('roles_offline', { keyPath: 'id' })
      }
      // Store para documentTypes offline
      if (!db.objectStoreNames.contains('documentTypes_offline')) {
        db.createObjectStore('documentTypes_offline', { keyPath: 'id' })
      }
      // Store para cities offline
      if (!db.objectStoreNames.contains('cities_offline')) {
        db.createObjectStore('cities_offline', { keyPath: 'id' })
      }
    }
  })
}
