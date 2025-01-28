import axiosHttp from "@/utils/axios";
import type { LoginResponse } from "../types/authInterfaces";

export const authRepository = {

    async login(data: { email: string; password: string }): Promise<LoginResponse> {
        const res = await axiosHttp.post("/auth/login", data);
        return res.data;
    },

    async logout() {
        return axiosHttp.get("/auth/logout");
    },

};