import type { PaginationLinks } from "@/types/theme";
import type { PaginationMeta } from "@/types/theme";

export interface ListTenantResponse {
    status:  string;
    message: string;
    data:    Data;
}

export interface Data {
    current_page:   number;
    data:           Tenant[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    links: PaginationLinks[];
    next_page_url:  null;
    path:           string;
    per_page:       number;
    prev_page_url:  null;
    to:             number;
    total:          number;
}

export interface Tenant {
    id:               string;
    name:             string;
    document_number:  string;
    email:            string;
    logo:   File | null | string;
    address:          string;
    cell_phone:       string;
    primary_color:    string;
    secondary_color:  string;
    document_type_id: number;
    city_id:          number | null;
    plan_id:          number;
    domains:          Domain[];
    city:             City;
    document_type:    DocumentType;
    plan:             Plan;
    created_at:       Date;
    current_plan:     Plan;
    plans           : Plan[];
    logo_url?: string;
}

export interface Domain {
    id:           number;
    domain:       string;
    tenant_id:    string;
    domain_front: string;
}

export interface tenantState {
    tenants: Tenant[];
    search:      string;
    limit:       number;
    page:        number;
    meta:        PaginationMeta;
    loading:     boolean;
    tenant:  Tenant;
    tenantsActive: Tenant[];
}

export interface GetTenantByIiResponse {
    status:  string;
    message: string;
    data:    Tenant;
}


export interface City {
    id:   number;
    name: string;
    department_id: number;
    department: Department;
}

export interface DocumentType {
    id:   number;
    name: string;
    code: string;
}


export interface Plan {
    id:              number;
    name:            string;
    price:           number;
    number_of_month: number;
    remaining_days:  number;
    start_date:      Date;
    end_date:        Date;
    plan_name:       string;
    status:          string;
    status_color:    string;
    pivot:           Pivot;
}

export interface Pivot {
    tenant_id:  string;
    plan_id:    number;
    id:         number;
    start_date: Date;
    end_date:   Date;
    price:      number;
    is_active:  number;
    user_id:    number;
    created_at: Date;
    updated_at: Date;
}

export interface Department {
    id:         number;
    name:       string;
    country_id: number;
    country:    Country;
}

export interface Country {
    id:   number;
    name: string;
}
