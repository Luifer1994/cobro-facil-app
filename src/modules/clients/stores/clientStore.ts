import { defineStore } from "pinia";
import type {
  Client,
  ClientState,
} from "@/modules/clients/types/clientInterfaces";
import type { PaginationMeta } from "@/types/theme";

export const useClientStore = defineStore({
  id: "clientStore",

  state: (): ClientState => ({
    clients: [],
    search: "",
    limit: 10,
    page: 1,
    meta: {} as PaginationMeta,
    loading: false,
    client: {} as Client,
    clientsActive: [],
  }),

  actions: {
    setClients(newClients: Client[]) {
      this.clients = newClients;
    },

    setMeta(paginationMeta: PaginationMeta) {
      this.meta = paginationMeta;
    },

    setLoading(isLoading: boolean) {
      this.loading = isLoading;
    },

    setSearch(newSearch: string) {
      this.search = newSearch;
    },

    setLimit(newLimit: number) {
      this.limit = newLimit;
    },

    setPage(newPage: number) {
      this.page = newPage;
    },

    setClient(newClient: Client) {
      this.client = newClient;
    },

    setClientsActive(newClientsActive: Client[]) {
      this.clientsActive = newClientsActive;
    },
  },
});
