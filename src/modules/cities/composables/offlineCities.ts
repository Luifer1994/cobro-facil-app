// src/modules/cities/composables/offlineCities.ts
import { getDB } from '@/offline/offlineDB'
import type { City } from '@/modules/cities/types/cityInterfaces'

/** Guardar TODAS las ciudades en la store 'cities_offline' */
export async function saveCitiesOffline(cities: City[]) {
  const db = await getDB()
  const tx = db.transaction('cities_offline', 'readwrite')
  // Limpiar antes de guardar para evitar duplicados
  await tx.store.clear()
  for (const city of cities) {
    await tx.store.put(city)
  }
  await tx.done
}

/** Obtener todas las ciudades de 'cities_offline' */
export async function getCitiesOffline(): Promise<City[]> {
  const db = await getDB()
  const offlineCities = await db.getAll('cities_offline')
  return offlineCities
}
