import { storeToRefs } from "pinia";
import { usePlanStore } from "@/modules/plans/stores/planStore";
import { PlanRepository } from "@/modules/plans/repositories/planRepository";

export function usePlan() {
  const planStore = usePlanStore();
  const { plansActive, plans, loading, plan, limit, search, page, meta } =
    storeToRefs(planStore);

  const fetchPlansActive = async () => {
    try {
      const response = await PlanRepository.fetchPlansActive();
      planStore.setPlansActive(response.data);
    } catch (error) {
      console.error("Error al obtener los planes:", error);
    }
  };

  const fetchPlans = async () => {
    planStore.setLoading(true);
    try {
      const response = await PlanRepository.fetchPlans(
        limit.value,
        search.value,
        page.value
      );
      planStore.setPlans(response.data.data);
      const filteredMeta = {
        ...response.data,
        links: response.data.links.slice(1, -1),
      };
      planStore.setMeta(filteredMeta);
    } catch (error) {
      console.error("Error al obtener los planes:", error);
    } finally {
      planStore.setLoading(false);
    }
  };

  const updateSearch = (newSearch: string) => {
    planStore.setSearch(newSearch);
  };

  const updatePageSize = (newLimit: number) => {
    planStore.setLimit(newLimit);
    updatePage(1);
    fetchPlans();
  };

  const updatePage = (newPage: number) => {
    planStore.setPage(newPage);
    fetchPlans();
  };

  return {
    plansActive,
    fetchPlansActive,
    fetchPlans,
    plans,
    loading,
    plan,
    limit,
    search,
    page,
    meta,
    updateSearch,
    updatePageSize,
    updatePage,
  };
}
