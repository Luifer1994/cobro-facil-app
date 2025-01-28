import axiosHttp from "@/utils/axios";
import type {
    User,
    UserListResponse,
} from "@/modules/users/types/userInterfaces";

export const UserRepository = {
    fetchUsers: async (
        limit: number,
        search: string,
        page: number
    ): Promise<UserListResponse> => {
        const response = await axiosHttp.get("users/list", {
            params: {
                limit,
                search,
                page,
            },
        });
        return response.data;
    },

    getUserById: async (id: number): Promise<User> => {
        const response = await axiosHttp.get(`users/show/${id}`);
        return response.data.data;
    },

    createUser: async (user: User): Promise<void> => {
        await axiosHttp.post("users/create", user);
    },

    updateUser: async (user: User): Promise<void> => {
        await axiosHttp.put(`users/update/${user.id}`, user);
    },
    
    getActiveUsers: async (): Promise<User[]> => {
        const response = await axiosHttp.get("users/list-active");
        return response.data.data;
    }
};
