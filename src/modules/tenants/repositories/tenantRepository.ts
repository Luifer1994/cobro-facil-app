import axiosHttp from "@/utils/axios";
import type {
  GetTenantByIiResponse,
  ListTenantResponse,
} from "../types/tenantInterfaces";

export const tenantRepository = {
  fetchTenants: async (
    limit: number,
    search: string,
    page: number
  ): Promise<ListTenantResponse> => {
    const response = await axiosHttp.get("tenants/list", {
      params: {
        limit,
        search,
        page,
      },
    });
    return response.data;
  },

  createTenant: async (Tenant: FormData): Promise<void> => {
    await axiosHttp.post("tenants/create", Tenant);
  },

  updateTenant: async (Tenant: FormData): Promise<void> => {
    await axiosHttp.post("tenants/update/" + Tenant.get("id"), Tenant);
  },

  getTenantById: async (id: string): Promise<GetTenantByIiResponse> => {
    const response = await axiosHttp.get(`tenants/show/${id}`);
    return response.data;
  },

  renovatePlan(id: string, planId: number): Promise<void> {
    return axiosHttp.post(`tenants/renovate-plan`, { plan_id: planId, tenant_id: id });
  }
};
