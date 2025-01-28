import { storeToRefs } from "pinia";
import { useTenantStore } from "@/modules/tenants/stores/tenantStore";
import { tenantRepository } from "@/modules/tenants/repositories/tenantRepository";
import type { Tenant } from "../types/tenantInterfaces";
import { base64ToFile } from "@/utils/generateImageByBase64";

export function useTenant() {
  const tenantStore = useTenantStore();
  const { tenants, search, limit, page, meta, loading, tenant } =
    storeToRefs(tenantStore);

  const fetchTenants = async () => {
    tenantStore.setLoading(true);
    try {
      const response = await tenantRepository.fetchTenants(
        limit.value,
        search.value,
        page.value
      );
      tenantStore.setTenants(response.data.data);
      const filteredMeta = {
        ...response.data,
        links: response.data.links.slice(1, -1),
      };
      tenantStore.setMeta(filteredMeta);
    } catch (error) {
      console.error("Error al obtener los Inquilinos:", error);
    } finally {
      tenantStore.setLoading(false);
    }
  };

  const prepareFormData = (TenantData: Tenant): FormData => {
    const formData = new FormData();

    Object.entries(TenantData).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      // Handle logo specially
      if (key === "logo") {
        if (value instanceof File) {
          formData.append("logo", value);
        } else if (typeof value === "string" && value.includes("base64")) {
          // Convert base64 to File if needed
          const file = base64ToFile(value);
          formData.append("logo", file);
        }
        return;
      }

      // Skip nested city object
      if (key === "city") return;

      formData.append(key, String(value));
    });

    return formData;
  };

  const createTenant = async (Tenant: Tenant): Promise<boolean> => {
    tenantStore.setLoading(true);
    try {
      const formData = prepareFormData(Tenant);
      await tenantRepository.createTenant(formData);
      return true;
    } catch (error) {
      console.error("Error al crear el inquilino:", error);
      return false;
    } finally {
      tenantStore.setLoading(false);
    }
  };

  const updateTenant = async (Tenant: Tenant): Promise<boolean> => {
    tenantStore.setLoading(true);
    try {
      const formData = prepareFormData(Tenant);
      await tenantRepository.updateTenant(formData);
      return true;
    } catch (error) {
      console.error("Error al actualizar el inquilino:", error);
      return false;
    } finally {
      tenantStore.setLoading(false);
    }
  };

  const getTenantById = async (id: string): Promise<boolean> => {
    tenantStore.setLoading(true);
    try {
      const response = await tenantRepository.getTenantById(id);
      if (response.data.logo && typeof response.data.logo === "string") {
        const logoUrl = response.data.logo;
        response.data.logo = logoUrl;
      }
      tenantStore.setTenant(response.data);
      return true;
    } catch (error) {
      console.error("Error al obtener el inquilino:", error);
      return false;
    } finally {
      tenantStore.setLoading(false);
    }
  };

  const renovatePlan = async (id: string, planId: number): Promise<boolean> => {
    tenantStore.setLoading(true);
    try {
      await tenantRepository.renovatePlan(id, planId);
      return true;
    } catch (error) {
      console.error("Error al renovar el plan:", error);
      return false;
    } finally {
      tenantStore.setLoading(false);
    }
  };

  const updateSearch = (newSearch: string) => {
    tenantStore.setSearch(newSearch);
  };

  const updatePageSize = (newLimit: number) => {
    tenantStore.setLimit(newLimit);
    updatePage(1);
    fetchTenants();
  };

  const updatePage = (newPage: number) => {
    tenantStore.setPage(newPage);
    fetchTenants();
  };

  const setTenant = (newTenant: Tenant) => {
    tenantStore.setTenant(newTenant);
  };

  return {
    loading,
    fetchTenants,
    tenants,
    search,
    limit,
    page,
    meta,
    updateSearch,
    updatePageSize,
    updatePage,
    tenant,
    createTenant,
    getTenantById,
    setTenant,
    updateTenant,
    renovatePlan
  };
}
