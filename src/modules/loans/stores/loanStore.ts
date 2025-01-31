import { defineStore } from "pinia";
import type {
  Loan,
  LoanState,
} from "@/modules/loans/types/loanInterfaces";
import type { PaginationMeta } from "@/types/theme";

export const useLoanStore = defineStore({
  id: "loanStore",

  state: (): LoanState => ({
    loans: [],
    search: "",
    limit: 10,
    page: 1,
    meta: {} as PaginationMeta,
    loading: false,
    loan: {} as Loan,
    loansActive: [],
  }),

  actions: {
    setLoans(newLoans: Loan[]) {
      this.loans = newLoans;
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

    setLoan(newLoan: Loan) {
      this.loan = newLoan;
    },

    setLoansActive(newLoansActive: Loan[]) {
      this.loansActive = newLoansActive;
    },
  },
});
