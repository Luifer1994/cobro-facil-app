import type { PaginationLinks } from "@/types/theme";
import type { PaginationMeta } from "@/types/theme";

export interface LoanListResponse {
  status: string;
  message: string;
  data: Data;
}

export interface Data {
  current_page: number;
  data: Loan[];
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

export interface Loan {
  id?: number;
  amount: number;
  interest_rate: number;
  interest_type: string;
  payment_frequency: string;
  installments_count: number;
  start_date: string;
  outstanding_balance: number;
  status: string;
  client_id: number;
  user_id: number;
  description?: string;
  installments_total_count: number;
  installments_paid_count: number;
  installments_due_count: number;
  installments_pending_count: number;
  total_paid?: string | null;
  total_overdue: string;
  estimated_end_date: string;
  status_es: string;
  interest_type_es: string;
  payment_frequency_es: string;
  color_status: 'primary' | 'success' | 'error';
  color_interest_type: 'primary' | 'error';
  color_payment_frequency: 'primary' | 'success' | 'warning' | 'error';
  client: Client;
  user: User;
  installments?: Installment[];
  localOnly?: boolean;
  pendingUpdate?: boolean;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  document: string;
  document_type_id: number;
  document_type: DocumentType;
}

export interface DocumentType {
  id: number;
  name: string;
  code: string;
}

export interface Installment {
  loan_id: number;
  due_date: string;
  expected_amount: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: null;
}

export interface LoanState {
  loans: Loan[];
  search: string;
  limit: number;
  page: number;
  meta: PaginationMeta;
  loading: boolean;
  loan: Loan;
  loansActive: Loan[];
}
