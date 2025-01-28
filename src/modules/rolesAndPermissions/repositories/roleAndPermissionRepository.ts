import axiosHttp from "@/utils/axios";
import type { GetRolesResponse } from "../types/roleAndPermissionInterfaces";

export const roleAndPermissionRepository = {
  fetRoles: async (): Promise<GetRolesResponse> => {
    const response = await axiosHttp.get(
      "roles/list",
    );
    return response.data;
  },
};
