import { defineStore } from "pinia";
import type { User, UserState } from "@/modules/users/types/userInterfaces";
import type { PaginationMeta } from "@/types/theme";

export const useUserStore = defineStore({
    id: "userStore",

    state: (): UserState => ({
        users: [],
        search: "",
        limit: 10,
        page: 1,
        meta: {} as PaginationMeta,
        loading: false,
        user: {} as User,
        usersActive: [],
    }),

    actions: {
        setUsers(newUsers: User[]) {
            this.users = newUsers;
        },

        setMeta(paginationMeta: PaginationMeta) {
            this.meta = paginationMeta;
        },

        setLoading(isLoading: boolean) {
            this.loading = isLoading;
        },

        setSearch(newSearch: string) {
            this.search = newSearch;
        },

        setLimit(newLimit: number) {
            this.limit = newLimit;
        },

        setPage(newPage: number) {
            this.page = newPage;
        },

        setUser(newUser: User) {
            this.user = newUser;
        },

        setUsersActive(newUsersActive: User[]) {
            this.usersActive = newUsersActive;
        }
    },
});
