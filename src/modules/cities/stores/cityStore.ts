import { defineStore } from "pinia";
import type { City, CityState } from "@/modules/cities/types/cityInterfaces";

export const useCityStore = defineStore({
  id: "cityStore",
  state: (): CityState => ({
    cities: [] as City[],
    loading: false,
  }),
  actions: {
    setCities(cities: City[]) {
      this.cities = cities;
    },

    setLoading(isLoading: boolean) {
      this.loading = isLoading;
    },
  },
});
