import { storeToRefs } from "pinia";
import { useUserStore } from "@/modules/users/stores/userStore";
import { UserRepository } from "@/modules/users/repositories/userRepository";
import type { User } from "@/modules/users/types/userInterfaces";

export function useUsers() {
  const UserStore = useUserStore();

  // Extraer las propiedades reactivas de la store
  const { users, search, limit, page, meta, loading, user, usersActive } =
    storeToRefs(UserStore);

  // Función para obtener los usuarios desde la API
  const fetchUsers = async () => {
    UserStore.setLoading(true);
    try {
      const response = await UserRepository.fetchUsers(
        limit.value,
        search.value,
        page.value
      );
      const filteredMeta = {
        ...response.data,
        links: response.data.links.slice(1, -1),
      };
      UserStore.setUsers(response.data.data);
      UserStore.setMeta(filteredMeta);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    } finally {
      UserStore.setLoading(false);
    }
  };

  // Función para obtener un usuario por ID
  const getUserById = async (id: number) => {
    UserStore.setLoading(true);
    try {
      const user = await UserRepository.getUserById(id);
      UserStore.setUser(user);
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
    } finally {
      UserStore.setLoading(false);
    }
  };

  // Función para crear un nuevo usuario
  const createUser = async (user: User): Promise<boolean> => {
    UserStore.setLoading(true);
    try {
      await UserRepository.createUser(user);
      return true;
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      return false;
    } finally {
      UserStore.setLoading(false);
    }
  };

  // Función para actualizar un usuario existente
  const updateUser = async (user: User): Promise<boolean> => {
    UserStore.setLoading(true);
    try {
      await UserRepository.updateUser(user);
      return true;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      return false;
    } finally {
      UserStore.setLoading(false);
    }
  };

  // Función para obtener los usuarios activos desde la API
  const fetchUsersActive = async () => {
    UserStore.setLoading(true);
    try {
      const usersActive = await UserRepository.getActiveUsers();
      UserStore.setUsersActive(usersActive);
    } catch (error) {
      console.error("Error al obtener los usuarios activos:", error);
    } finally {
      UserStore.setLoading(false);
    }
  };

  // Función para actualizar el término de búsqueda
  const updateSearch = (newSearch: string) => {
    UserStore.setSearch(newSearch);
  };

  // Función para actualizar el tamaño de página (limit)
  const updatePageSize = (newLimit: number) => {
    UserStore.setLimit(newLimit);
    updatePage(1);
    fetchUsers(); // Refrescar los datos con el nuevo tamaño de página
  };

  // Función para actualizar la página actual
  const updatePage = (newPage: number) => {
    UserStore.setPage(newPage);
    fetchUsers(); // Refrescar los datos con la nueva página
  };

  return {
    users,
    search,
    limit,
    page,
    meta,
    loading,
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    updateSearch,
    updatePageSize,
    updatePage,
    user,
    fetchUsersActive,
    usersActive,
  };
}
