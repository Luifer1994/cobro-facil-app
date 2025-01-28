// src/modules/users/composables/useUsers.ts

import { storeToRefs } from "pinia";
import { useUserStore } from "@/modules/users/stores/userStore";
import { UserRepository } from "@/modules/users/repositories/userRepository";
import {
  saveUserOffline,
  saveUsersOffline,
  getOfflineUsers,
  updateUserOffline,
} from "@/modules/users/composables/offlineUsers";
import { isConnectionBadOrOffline } from "@/utils/network";
import type { User } from "@/modules/users/types/userInterfaces";

export function useUsers() {
  const UserStore = useUserStore();
  const { users, search, limit, page, meta, loading, user, usersActive } =
    storeToRefs(UserStore);

  /**
   * Filtra y pagina local
   */
  const localFilterAndPaginate = (allUsers: User[]): { pageUsers: User[]; total: number } => {
    let filtered = allUsers;
    if (search.value.trim()) {
      const lowerS = search.value.toLowerCase();
      filtered = allUsers.filter(
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

    return { pageUsers: pageData, total: totalCount };
  };

  /**
   * fetchUsers
   */
  const fetchUsers = async () => {
    UserStore.setLoading(true);
    try {
      if (isConnectionBadOrOffline()) {
        // Offline => filtrar local
        const allLocalUsers = await getOfflineUsers();
        const { pageUsers, total } = localFilterAndPaginate(allLocalUsers);

        UserStore.setUsers(pageUsers);
        const fromValue = total > 0 ? (page.value - 1) * limit.value + 1 : 0;
        let toValue = fromValue + pageUsers.length - 1;
        if (toValue < 0) toValue = 0;

        UserStore.setMeta({
          current_page: page.value,
          from: pageUsers.length ? fromValue : 0,
          last_page: Math.ceil(total / limit.value) || 1,
          links: [],
          next_page_url: null,
          path: "",
          per_page: limit.value,
          prev_page_url: null,
          to: pageUsers.length ? toValue : 0,
          total: total,
        });
      } else {
        // Online => API
        const response = await UserRepository.fetchUsers(
          limit.value,
          search.value,
          page.value
        );
        UserStore.setUsers(response.data.data);

        const filteredMeta = {
          ...response.data,
          links: response.data.links.slice(1, -1),
        };
        UserStore.setMeta(filteredMeta);

        // Guardar en IDB con localOnly=false
        await saveUsersOffline(response.data.data);
      }
    } catch (error) {
      console.error("Error en fetchUsers:", error);

      // fallback
      const allLocalUsers = await getOfflineUsers();
      const { pageUsers, total } = localFilterAndPaginate(allLocalUsers);
      UserStore.setUsers(pageUsers);

      const fromValue = total > 0 ? (page.value - 1) * limit.value + 1 : 0;
      let toValue = fromValue + pageUsers.length - 1;
      if (toValue < 0) toValue = 0;

      UserStore.setMeta({
        current_page: page.value,
        from: pageUsers.length ? fromValue : 0,
        last_page: Math.ceil(total / limit.value) || 1,
        links: [],
        next_page_url: null,
        path: "",
        per_page: limit.value,
        prev_page_url: null,
        to: pageUsers.length ? toValue : 0,
        total: total,
      });
    } finally {
      UserStore.setLoading(false);
    }
  };

  /**
   * getUserById
   */
  const getUserById = async (id: number) => {
    UserStore.setLoading(true);
    try {
      if (!isConnectionBadOrOffline()) {
        const response = await UserRepository.getUserById(id);
        UserStore.setUser(response);
      } else {
        const allLocalUsers = await getOfflineUsers();
        const found = allLocalUsers.find((u) => u.id === id);
        if (found) UserStore.setUser(found);
      }
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      const allLocalUsers = await getOfflineUsers();
      const found = allLocalUsers.find((u) => u.id === id);
      if (found) UserStore.setUser(found);
    } finally {
      UserStore.setLoading(false);
    }
  };

  /**
   * createUser offline/online
   */
  const createUser = async (newUser: User): Promise<boolean> => {
    UserStore.setLoading(true);
    try {
      if (isConnectionBadOrOffline()) {
        newUser.localOnly = true;
        await saveUserOffline(newUser);
        return true;
      } else {
        await UserRepository.createUser(newUser);
        return true;
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
      newUser.localOnly = true;
      await saveUserOffline(newUser);
      return false;
    } finally {
      UserStore.setLoading(false);
      await fetchUsers();
    }
  };

  /**
   * updateUser offline/online
   */
  const updateUser = async (payload: User): Promise<boolean> => {
    UserStore.setLoading(true);
    try {
      if (!isConnectionBadOrOffline()) {
        // Actualiza en la API
        await UserRepository.updateUser(payload);
      } else {
        // MODO OFFLINE
        if (!payload.localOnly) {
          // Significa que ya existe en el server => pendingUpdate
          payload.pendingUpdate = true;
        }
        // Si es localOnly = true, nunca llegó al server => simplemente actualizamos sus datos
        await updateUserOffline(payload);
      }
      return true;
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      return false;
    } finally {
      UserStore.setLoading(false);
      await fetchUsers();
    }
  };

  /**
   * fetchUsersActive
   */
  const fetchUsersActive = async () => {
    UserStore.setLoading(true);
    try {
      if (!isConnectionBadOrOffline()) {
        const usersActives = await UserRepository.getActiveUsers();
        UserStore.setUsersActive(usersActives);
      } else {
        const allLocal = await getOfflineUsers();
        const actives = allLocal.filter((u) => (u as any).status === "active");
        UserStore.setUsersActive(actives);
      }
    } catch (error) {
      console.error("Error al obtener usuarios activos:", error);
    } finally {
      UserStore.setLoading(false);
    }
  };

  // updateSearch, updatePageSize, updatePage
  const updateSearch = (newSearch: string) => {
    UserStore.setSearch(newSearch);
  };
  const updatePageSize = (newLimit: number) => {
    UserStore.setLimit(newLimit);
    updatePage(1);
    fetchUsers();
  };
  const updatePage = (newPage: number) => {
    UserStore.setPage(newPage);
    fetchUsers();
  };

  return {
    users, search, limit, page, meta, loading, user, usersActive,
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    fetchUsersActive,
    updateSearch,
    updatePageSize,
    updatePage
  };
}
