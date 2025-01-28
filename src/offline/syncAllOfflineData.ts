// src/offline/syncAllOfflineData.ts
import { syncOfflineUsers } from "@/modules/users/composables/offlineUsers"
// si tuvieras otras sync (ciudades, etc) las importas

export async function syncAllOfflineData() {
  console.log("Iniciando syncAllOfflineData...")
  await syncOfflineUsers()
  // await syncOfflineCities()
  // ...
  console.log("Sync finalizado.")
}
