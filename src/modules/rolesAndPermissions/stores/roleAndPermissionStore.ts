import { defineStore } from "pinia";
import type { Role, RoleState } from "../types/roleAndPermissionInterfaces";

export const useRoleAndPermissionStore = defineStore({
  id: "roleAndPermissionStore",
  state: (): RoleState => ({
    roles: [] as Role[],
    loading: false,
  }),
  actions: {
    setRoles(roles: Role[]) {
      this.roles = roles;
    },

    setLoading(isLoading: boolean) {
      this.loading = isLoading;
    },
  },
});
