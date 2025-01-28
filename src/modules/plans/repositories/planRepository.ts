import axiosHttp from "@/utils/axios";
import type {
  ListPlansActiveResponse,
  ListPlansResponse,
  Plan,
} from "@/modules/plans/types/planInterface";

export const PlanRepository = {
  fetchPlansActive: async (): Promise<ListPlansActiveResponse> => {
    const response = await axiosHttp.get("plans/list-actives");
    return response.data;
  },

  fetchPlans: async (
    limit: number,
    search: string,
    page: number
  ): Promise<ListPlansResponse> => {
    const response = await axiosHttp.get("plans/list", {
      params: {
        limit,
        search,
        page,
      },
    });
    return response.data;
  },

  fetchPlan: async (id: number): Promise<Plan> => {
    const response = await axiosHttp.get(`plans/${id}`);
    return response.data;
  },
};
