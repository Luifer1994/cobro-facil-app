import type { PaginationLinks } from "@/types/theme";
import type { PaginationMeta } from "@/types/theme";

export interface UserListResponse {
    status: string;
    message: string;
    data: Data;
}

export interface Data {
    current_page: number;
    data: User[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLinks[];
    next_page_url: null;
    path: string;
    per_page: number;
    prev_page_url: null;
    to: number;
    total: number;
}

export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
}

export interface UserState {
    users: User[];
    search: string;
    limit: number;
    page: number;
    meta: PaginationMeta;
    loading: boolean;
    user: User;
    usersActive: User[];
}