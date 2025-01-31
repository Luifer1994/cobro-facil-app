// src/modules/loans/composables/useLoans.ts

import { storeToRefs } from "pinia";
import { useLoanStore } from "@/modules/loans/stores/loanStore";
import { LoanRepository } from "@/modules/loans/repositories/loanRepository";
import {
  saveLoanOffline,
  saveLoansOffline,
  getOfflineLoans,
  updateLoanOffline,
} from "@/modules/loans/composables/offlineLoans";
import { isConnectionBadOrOffline } from "@/utils/network";
import type { Loan } from "@/modules/loans/types/loanInterfaces";

export function useLoans() {
  const LoanStore = useLoanStore();
  const { loans, search, limit, page, meta, loading, loan, loansActive } =
    storeToRefs(LoanStore);

  /**
   * Filtra y pagina local
   */
  const localFilterAndPaginate = (
    allLoans: Loan[]
  ): { pageLoans: Loan[]; total: number } => {
    let filtered = allLoans;
    if (search.value.trim()) {
      const lowerS = search.value.toLowerCase();
      filtered = allLoans.filter(
        (u) =>
          u.client.name.toLowerCase().includes(lowerS) ||
          (u.client.email && u.client.email.toLowerCase().includes(lowerS))
      );
    }
    const totalCount = filtered.length;
    const currentPage = page.value;
    const itemsPerPage = limit.value;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filtered.slice(startIndex, endIndex);

    return { pageLoans: pageData, total: totalCount };
  };

  /**
   * fetchLoans
   */
  const fetchLoans = async () => {
    LoanStore.setLoading(true);
    try {
      if (isConnectionBadOrOffline()) {
        // Offline => filtrar local
        const allLocalLoans = await getOfflineLoans();
        const { pageLoans, total } = localFilterAndPaginate(allLocalLoans);

        LoanStore.setLoans(pageLoans);
        const fromValue = total > 0 ? (page.value - 1) * limit.value + 1 : 0;
        let toValue = fromValue + pageLoans.length - 1;
        if (toValue < 0) toValue = 0;

        LoanStore.setMeta({
          current_page: page.value,
          from: pageLoans.length ? fromValue : 0,
          last_page: Math.ceil(total / limit.value) || 1,
          links: [],
          next_page_url: null,
          path: "",
          per_page: limit.value,
          prev_page_url: null,
          to: pageLoans.length ? toValue : 0,
          total: total,
        });
      } else {
        // Online => API
        const response = await LoanRepository.fetchLoans(
          limit.value,
          search.value,
          page.value
        );
        LoanStore.setLoans(response.data.data);

        const filteredMeta = {
          ...response.data,
          links: response.data.links.slice(1, -1),
        };
        LoanStore.setMeta(filteredMeta);

        // Guardar en IDB con localOnly=false
        await saveLoansOffline(response.data.data);
      }
    } catch (error) {
      console.error("Error en fetchLoans:", error);

      // fallback
      const allLocalLoans = await getOfflineLoans();
      const { pageLoans, total } = localFilterAndPaginate(allLocalLoans);
      LoanStore.setLoans(pageLoans);

      const fromValue = total > 0 ? (page.value - 1) * limit.value + 1 : 0;
      let toValue = fromValue + pageLoans.length - 1;
      if (toValue < 0) toValue = 0;

      LoanStore.setMeta({
        current_page: page.value,
        from: pageLoans.length ? fromValue : 0,
        last_page: Math.ceil(total / limit.value) || 1,
        links: [],
        next_page_url: null,
        path: "",
        per_page: limit.value,
        prev_page_url: null,
        to: pageLoans.length ? toValue : 0,
        total: total,
      });
    } finally {
      LoanStore.setLoading(false);
    }
  };

  /**
   * getLoanById
   */
  const getLoanById = async (id: number) => {
    LoanStore.setLoading(true);
    try {
      if (!isConnectionBadOrOffline()) {
        const response = await LoanRepository.getLoanById(id);
        LoanStore.setLoan(response);
      } else {
        const allLocalLoans = await getOfflineLoans();
        const found = allLocalLoans.find((u) => u.id === id);
        if (found) LoanStore.setLoan(found);
      }
    } catch (error) {
      console.error("Error al obtener prestamo:", error);
      const allLocalLoans = await getOfflineLoans();
      const found = allLocalLoans.find((u) => u.id === id);
      if (found) LoanStore.setLoan(found);
    } finally {
      LoanStore.setLoading(false);
    }
  };

  /**
   * createLoan offline/online
   */
  const createLoan = async (newLoan: Loan): Promise<boolean> => {
    LoanStore.setLoading(true);
    try {
      if (isConnectionBadOrOffline()) {
        newLoan.localOnly = true;
        await saveLoanOffline(newLoan);
        return true;
      } else {
        await LoanRepository.createLoan(newLoan);
        return true;
      }
    } catch (error) {
      console.error("Error al crear prestamo:", error);
      newLoan.localOnly = true;
      await saveLoanOffline(newLoan);
      return false;
    } finally {
      LoanStore.setLoading(false);
      await fetchLoans();
    }
  };

  /**
   * updateLoan offline/online
   */
  const updateLoan = async (payload: Loan): Promise<boolean> => {
    LoanStore.setLoading(true);
    try {
      if (!isConnectionBadOrOffline()) {
        // Actualiza en la API
        await LoanRepository.updateLoan(payload);
      } else {
        // MODO OFFLINE
        if (!payload.localOnly) {
          // Significa que ya existe en el server => pendingUpdate
          payload.pendingUpdate = true;
        }
        // Si es localOnly = true, nunca llegó al server => simplemente actualizamos sus datos
        await updateLoanOffline(payload);
      }
      return true;
    } catch (error) {
      console.error("Error al actualizar prestamo:", error);
      return false;
    } finally {
      LoanStore.setLoading(false);
      await fetchLoans();
    }
  };

  /**
   * fetchLoansActive
   */
  const fetchLoansActive = async () => {
    LoanStore.setLoading(true);
    try {
      if (!isConnectionBadOrOffline()) {
        const loansActives = await LoanRepository.getActiveLoans();
        LoanStore.setLoansActive(loansActives);
      } else {
        const allLocal = await getOfflineLoans();
        const actives = allLocal.filter((u) => (u as any).status === "active");
        LoanStore.setLoansActive(actives);
      }
    } catch (error) {
      console.error("Error al obtener prestamos activos:", error);
    } finally {
      LoanStore.setLoading(false);
    }
  };

  // updateSearch, updatePageSize, updatePage
  const updateSearch = (newSearch: string) => {
    LoanStore.setSearch(newSearch);
  };
  const updatePageSize = (newLimit: number) => {
    LoanStore.setLimit(newLimit);
    updatePage(1);
    fetchLoans();
  };
  const updatePage = (newPage: number) => {
    LoanStore.setPage(newPage);
    fetchLoans();
  };

  return {
    loans,
    search,
    limit,
    page,
    meta,
    loading,
    loan,
    loansActive,
    fetchLoans,
    getLoanById,
    createLoan,
    updateLoan,
    fetchLoansActive,
    updateSearch,
    updatePageSize,
    updatePage,
  };
}
