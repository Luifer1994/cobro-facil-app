import { storeToRefs } from "pinia";
import { useCityStore } from "@/modules/cities/stores/cityStore";
import { CityRepository } from "@/modules/cities/repositories/cityRepository";

export function useCity() {
  const cityStore = useCityStore();
  const { cities, loading } = storeToRefs(cityStore);

  const fetchCitiesByName = async (name: string) => {
    cityStore.setLoading(true);
    try {
      const response = await CityRepository.fetCitiesByName(name);
      cityStore.setCities(response.data);
    } catch (error) {
      console.error("Error al obtener las ciudades:", error);
    } finally {
      cityStore.setLoading(false);
    }
  };

  return {
    loading,
    cities,
    fetchCitiesByName,
  };
}
