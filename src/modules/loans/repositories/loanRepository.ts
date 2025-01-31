import axiosHttp from "@/utils/axios";
import type {
  Loan,
  LoanListResponse,
} from "@/modules/loans/types/loanInterfaces";

export const LoanRepository = {
  fetchLoans: async (
    limit: number,
    search: string,
    page: number
  ): Promise<LoanListResponse> => {
    const response = await axiosHttp.get("loans/list", {
      params: {
        limit,
        search,
        page,
      },
    });
    return response.data;
  },

  getLoanById: async (id: number): Promise<Loan> => {
    const response = await axiosHttp.get(`loans/show/${id}`);
    return response.data.data;
  },

  createLoan: async (Loan: Loan): Promise<void> => {
    await axiosHttp.post("loans/create", Loan);
  },

  updateLoan: async (Loan: Loan): Promise<void> => {
    await axiosHttp.put(`loans/update/${Loan.id}`, Loan);
  },

  getActiveLoans: async (): Promise<Loan[]> => {
    const response = await axiosHttp.get("loans/list-active");
    return response.data.data;
  },
};
