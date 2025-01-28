import { defineStore } from "pinia";
import type {
  Tenant,
  tenantState,
} from "../types/tenantInterfaces";
import type { PaginationMeta } from "@/types/theme";

export const useTenantStore = defineStore({
  id: "tenantStore",
  state: (): tenantState => ({
    tenants: [],
    search: "",
    limit: 10,
    page: 1,
    meta: {} as PaginationMeta,
    loading: false,
    tenant: {} as Tenant,
    tenantsActive: [] as Tenant[],
  }),
  actions: {
    setTenants(newTenants: Tenant[]) {
      this.tenants = newTenants;
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

    setTenant(newTenant: Tenant) {
      this.tenant = newTenant;
    },

    setTenantsActive(newTenantsActive: Tenant[]) {
      this.tenantsActive = newTenantsActive;
    },
  },
});
