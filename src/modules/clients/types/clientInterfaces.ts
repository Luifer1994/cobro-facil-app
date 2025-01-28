import type { PaginationLinks } from "@/types/theme";
import type { PaginationMeta } from "@/types/theme";

export interface ClientListResponse {
    status: string;
    message: string;
    data: Data;
}

export interface Data {
    current_page: number;
    data: Client[];
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

export interface Client {
    id?: number;
    name: string;
    email: string;
    address: string;
    localOnly?: boolean,
    pendingUpdate?: boolean;
    phone: string;
    document_type_id: number;
    document: string;
}

export interface ClientState {
    clients: Client[];
    search: string;
    limit: number;
    page: number;
    meta: PaginationMeta;
    loading: boolean;
    client: Client;
    clientsActive: Client[];
}