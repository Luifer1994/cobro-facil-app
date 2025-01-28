// src/offline/syncAllOfflineData.ts
import { syncOfflineUsers } from "@/modules/users/composables/offlineUsers";
import { syncOfflineClients } from "@/modules/clients/composables/offlineClients";
// si tuvieras otras sync (ciudades, etc) las importas

export async function syncAllOfflineData() {
  await syncOfflineUsers();
  await syncOfflineClients();
}
