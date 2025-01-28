import { storeToRefs } from "pinia"
import { useUserStore } from "@/modules/users/stores/userStore"
import { UserRepository } from "@/modules/users/repositories/userRepository"
import { saveUserOffline } from "@/modules/users/composables/offlineUsers"
import { isConnectionBadOrOffline } from "@/utils/network"
import type { User } from "@/modules/users/types/userInterfaces"

export function useUsers() {
  const UserStore = useUserStore()
  const { users, search, limit, page, meta, loading, user, usersActive } =
    storeToRefs(UserStore)

  // Función para obtener usuarios
  const fetchUsers = async () => {
    UserStore.setLoading(true)
    try {
      const response = await UserRepository.fetchUsers(
        limit.value,
        search.value,
        page.value
      )
      const filteredMeta = {
        ...response.data,
        links: response.data.links.slice(1, -1),
      }
      UserStore.setUsers(response.data.data)
      UserStore.setMeta(filteredMeta)
    } catch (error) {
      console.error("Error al obtener los usuarios:", error)
    } finally {
      UserStore.setLoading(false)
    }
  }

  // Obtener un usuario por ID
  const getUserById = async (id: number) => {
    UserStore.setLoading(true)
    try {
      const userRes = await UserRepository.getUserById(id)
      UserStore.setUser(userRes)
    } catch (error) {
      console.error("Error al obtener usuario:", error)
    } finally {
      UserStore.setLoading(false)
    }
  }

  const createUser = async (newUser: User): Promise<boolean> => {
    UserStore.setLoading(true)
    try {
      if (isConnectionBadOrOffline()) {
        await saveUserOffline(newUser)
        console.log("Usuario guardado offline (red demasiado lenta o sin conexión).")
        return true
      } else {
        await UserRepository.createUser(newUser)
        return true
      }
    } catch (error) {
      console.error("Error al crear usuario en línea:", error)
      await saveUserOffline(newUser)
      return false
    } finally {
      UserStore.setLoading(false)
    }
  }

  // Actualizar usuario (aquí no hemos puesto lógica offline de ejemplo, pero podrías hacerlo igual)
  const updateUser = async (payload: User): Promise<boolean> => {
    UserStore.setLoading(true)
    try {
      await UserRepository.updateUser(payload)
      return true
    } catch (error) {
      console.error("Error al actualizar usuario:", error)
      return false
    } finally {
      UserStore.setLoading(false)
    }
  }

  // Obtener usuarios activos
  const fetchUsersActive = async () => {
    UserStore.setLoading(true)
    try {
      const usersActives = await UserRepository.getActiveUsers()
      UserStore.setUsersActive(usersActives)
    } catch (error) {
      console.error("Error al obtener usuarios activos:", error)
    } finally {
      UserStore.setLoading(false)
    }
  }

  // Actualizar búsqueda
  const updateSearch = (newSearch: string) => {
    UserStore.setSearch(newSearch)
  }

  // Actualizar el tamaño de página
  const updatePageSize = (newLimit: number) => {
    UserStore.setLimit(newLimit)
    updatePage(1)
    fetchUsers()
  }

  // Actualizar página actual
  const updatePage = (newPage: number) => {
    UserStore.setPage(newPage)
    fetchUsers()
  }

  return {
    users,
    search,
    limit,
    page,
    meta,
    loading,
    user,
    usersActive,

    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    fetchUsersActive,
    updateSearch,
    updatePageSize,
    updatePage
  }
}
