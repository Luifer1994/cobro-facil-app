import type { PaginationLinks, PaginationMeta } from "@/types/theme";

export interface ListPlansActiveResponse {
  status: string;
  message: string;
  data: Plan[];
}

export interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  is_active: boolean;
  number_of_month: number;
  full_name: string;
}

export interface PlanState {
  plansActive: Plan[];
  plans: Plan[];
  loading: boolean;
  search: string;
  limit: number;
  page: number;
  meta: PaginationMeta;
  plan: Plan;
}

export interface ListPlansResponse {
  status: string;
  message: string;
  data: Data;
}

export interface Data {
  current_page: number;
  data: Plan[];
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
