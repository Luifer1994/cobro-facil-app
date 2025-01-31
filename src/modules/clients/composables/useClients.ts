// src/modules/clients/composables/useClients.ts

import { storeToRefs } from "pinia";
import { useClientStore } from "@/modules/clients/stores/clientStore";
import { ClientRepository } from "@/modules/clients/repositories/clientRepository";
import {
  saveClientOffline,
  saveClientsOffline,
  getOfflineClients,
  updateClientOffline,
} from "@/modules/clients/composables/offlineClients";
import { isConnectionBadOrOffline } from "@/utils/network";
import type { Client } from "@/modules/clients/types/clientInterfaces";

export function useClients() {
  const ClientStore = useClientStore();
  const { clients, search, limit, page, meta, loading, client, clientsActive } =
    storeToRefs(ClientStore);

  /**
   * Filtra y pagina local
   */
  const localFilterAndPaginate = (allClients: Client[]): { pageClients: Client[]; total: number } => {
    let filtered = allClients;
    if (search.value.trim()) {
      const lowerS = search.value.toLowerCase();
      filtered = allClients.filter(
        (u) =>
          u.name.toLowerCase().includes(lowerS) ||
          (u.email && u.email.toLowerCase().includes(lowerS))
      );
    }
    const totalCount = filtered.length;
    const currentPage = page.value;
    const itemsPerPage = limit.value;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filtered.slice(startIndex, endIndex);

    return { pageClients: pageData, total: totalCount };
  };

  /**
   * fetchClients
   */
  const fetchClients = async () => {
    ClientStore.setLoading(true);
    try {
      if (isConnectionBadOrOffline()) {
        // Offline => filtrar local
        const allLocalClients = await getOfflineClients();
        const { pageClients, total } = localFilterAndPaginate(allLocalClients);

        ClientStore.setClients(pageClients);
        const fromValue = total > 0 ? (page.value - 1) * limit.value + 1 : 0;
        let toValue = fromValue + pageClients.length - 1;
        if (toValue < 0) toValue = 0;

        ClientStore.setMeta({
          current_page: page.value,
          from: pageClients.length ? fromValue : 0,
          last_page: Math.ceil(total / limit.value) || 1,
          links: [],
          next_page_url: null,
          path: "",
          per_page: limit.value,
          prev_page_url: null,
          to: pageClients.length ? toValue : 0,
          total: total,
        });
      } else {
        // Online => API
        const response = await ClientRepository.fetchClients(
          limit.value,
          search.value,
          page.value
        );
        ClientStore.setClients(response.data.data);

        const filteredMeta = {
          ...response.data,
          links: response.data.links.slice(1, -1),
        };
        ClientStore.setMeta(filteredMeta);

        // Guardar en IDB con localOnly=false
        await saveClientsOffline(response.data.data);
      }
    } catch (error) {
      console.error("Error en fetchClients:", error);

      // fallback
      const allLocalClients = await getOfflineClients();
      const { pageClients, total } = localFilterAndPaginate(allLocalClients);
      ClientStore.setClients(pageClients);

      const fromValue = total > 0 ? (page.value - 1) * limit.value + 1 : 0;
      let toValue = fromValue + pageClients.length - 1;
      if (toValue < 0) toValue = 0;

      ClientStore.setMeta({
        current_page: page.value,
        from: pageClients.length ? fromValue : 0,
        last_page: Math.ceil(total / limit.value) || 1,
        links: [],
        next_page_url: null,
        path: "",
        per_page: limit.value,
        prev_page_url: null,
        to: pageClients.length ? toValue : 0,
        total: total,
      });
    } finally {
      ClientStore.setLoading(false);
    }
  };

  /**
   * getClientById
   */
  const getClientById = async (id: number) => {
    ClientStore.setLoading(true);
    try {
      if (!isConnectionBadOrOffline()) {
        const response = await ClientRepository.getClientById(id);
        ClientStore.setClient(response);
      } else {
        const allLocalClients = await getOfflineClients();
        const found = allLocalClients.find((u) => u.id === id);
        if (found) ClientStore.setClient(found);
      }
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      const allLocalClients = await getOfflineClients();
      const found = allLocalClients.find((u) => u.id === id);
      if (found) ClientStore.setClient(found);
    } finally {
      ClientStore.setLoading(false);
    }
  };

  /**
   * createClient offline/online
   */
  const createClient = async (newClient: Client): Promise<boolean> => {
    ClientStore.setLoading(true);
    try {
      if (isConnectionBadOrOffline()) {
        newClient.localOnly = true;
        await saveClientOffline(newClient);
        return true;
      } else {
        await ClientRepository.createClient(newClient);
        return true;
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
      newClient.localOnly = true;
      await saveClientOffline(newClient);
      return false;
    } finally {
      ClientStore.setLoading(false);
      await fetchClients();
    }
  };

  /**
   * updateClient offline/online
   */
  const updateClient = async (payload: Client): Promise<boolean> => {
    ClientStore.setLoading(true);
    try {
      if (!isConnectionBadOrOffline()) {
        // Actualiza en la API
        await ClientRepository.updateClient(payload);
      } else {
        // MODO OFFLINE
        if (!payload.localOnly) {
          // Significa que ya existe en el server => pendingUpdate
          payload.pendingUpdate = true;
        }
        // Si es localOnly = true, nunca llegó al server => simplemente actualizamos sus datos
        await updateClientOffline(payload);
      }
      return true;
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      return false;
    } finally {
      ClientStore.setLoading(false);
      await fetchClients();
    }
  };

  /**
   * fetchClientsActive
   */
  const fetchClientsActive = async () => {
    ClientStore.setLoading(true);
    try {
      if (!isConnectionBadOrOffline()) {
        const clientsActives = await ClientRepository.getActiveClients();
        ClientStore.setClientsActive(clientsActives);
        await saveClientsOffline(clientsActives);
      } else {
        const allLocal = await getOfflineClients();
        ClientStore.setClientsActive(allLocal);
      }
    } catch (error) {
      console.error("Error al obtener usuarios activos:", error);
    } finally {
      ClientStore.setLoading(false);
    }
  };

  // updateSearch, updatePageSize, updatePage
  const updateSearch = (newSearch: string) => {
    ClientStore.setSearch(newSearch);
  };
  const updatePageSize = (newLimit: number) => {
    ClientStore.setLimit(newLimit);
    updatePage(1);
    fetchClients();
  };
  const updatePage = (newPage: number) => {
    ClientStore.setPage(newPage);
    fetchClients();
  };

  return {
    clients, search, limit, page, meta, loading, client, clientsActive,
    fetchClients,
    getClientById,
    createClient,
    updateClient,
    fetchClientsActive,
    updateSearch,
    updatePageSize,
    updatePage
  };
}
