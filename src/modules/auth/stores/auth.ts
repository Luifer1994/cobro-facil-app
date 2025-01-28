import { defineStore, acceptHMRUpdate } from "pinia";
import type { Role, Roles } from "@/modules/auth/types/auth";
import _castArray from "lodash/castArray";
import type { User } from "../types/authInterfaces";
const userLoggedIn = localStorage.getItem("userLoggedIn");
const token = localStorage.getItem("token");
export const useAuthStore = defineStore("auth", {
  state: () => ({
    role: "admin" as Role | null,
    user: userLoggedIn ? JSON.parse(userLoggedIn) : ({} as User),
    token: token ? token : ("" as string),
  }),
  actions: {
    setLogged(payload?: User, token?: string) {
      this.role = "admin";
      localStorage.setItem("userLoggedIn", JSON.stringify(payload));
      localStorage.setItem("token", token || "");
      this.user = payload || ({} as User);
    },
    setLogout() {
      this.role = null;
      this.user = {} as User;
      localStorage.clear();
    },
  },
  getters: {
    userRole(state) {
      return state.role;
    },
    isRoleGranted(state) {
      return (roles?: Roles) => {
        if (!roles) {
          return true;
        }
        if (!state.role) {
          return false;
        }

        const arrRoles: Role[] = _castArray(roles);

        if (arrRoles.includes("all")) {
          return true;
        }

        return arrRoles.includes(state.role);
      };
    },
  },
  persist: {
    paths: ["logged", "role"],
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
