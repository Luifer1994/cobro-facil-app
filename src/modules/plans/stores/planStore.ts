import { defineStore } from "pinia";
import type { Plan, PlanState } from "@/modules/plans/types/planInterface";
import type { PaginationMeta } from "@/types/theme";

export const usePlanStore = defineStore({
  id: "planStore",
  state: (): PlanState => ({
    plansActive: [],
    plans: [],
    loading: false,
    search: "",
    limit: 10,
    page: 1,
    meta: {} as PaginationMeta,
    plan: {} as Plan,
  }),

  actions: {
    setPlansActive(plansActive: Plan[]) {
      this.plansActive = plansActive;
    },

    setPlans(plans: Plan[]) {
      this.plans = plans;
    },

    setPlan(plan: Plan) {
      this.plan = plan;
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
  },
});
