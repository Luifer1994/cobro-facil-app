import { authRepository } from "../repositories/authRepository";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import { fetchAllCommonData } from "@/offline/fetchAllCommonData";
import { deleteDB } from "@/offline/offlineDB";

export const useAuth = () => {
  const message = useMessage();
  const store = useAuthStore();
  const router = useRouter();
  const { role, user } = storeToRefs(store);

  const login = async (data: { email: string; password: string }) => {
    try {
      const response = await authRepository.login(data);
      store.setLogged(response.data.user, response.data.token);
      await fetchAllCommonData();
      window.location.href = "/";
    } catch (error) {
      message.error("Credenciales incorrectas");
    }
  };

  const logout = async () => {
    try {
      await authRepository.logout();
      await deleteDB();
      store.setLogout();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    role,
    user,
    login,
    logout,
    router,
  };
};
