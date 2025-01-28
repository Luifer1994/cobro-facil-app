import { storeToRefs } from "pinia";
import { useCityStore } from "@/modules/cities/stores/cityStore";
import { CityRepository } from "@/modules/cities/repositories/cityRepository";
import {
  getCitiesOffline,
  saveCitiesOffline,
} from "@/modules/cities/composables/offlineCities";
import type { City } from "@/modules/cities/types/cityInterfaces";

export function useCity() {
  const cityStore = useCityStore();
  const { cities, loading } = storeToRefs(cityStore);

  // Cargar TODAS las ciudades al inicio
  const fetchAllCities = async () => {
    cityStore.setLoading(true);
    try {
      if (!navigator.onLine) {
        // offline -> obtener de IDB
        const offlineData = await getCitiesOffline();
        cityStore.setCities(offlineData);
      } else {
        // online -> API + guardar offline
        const response = await CityRepository.fetchAllCities();
        cityStore.setCities(response.data);
        await saveCitiesOffline(response.data);
      }
    } catch (error) {
      console.error("Error al obtener todas las ciudades:", error);
      // fallback a IDB
      const offlineData = await getCitiesOffline();
      if (offlineData.length) {
        cityStore.setCities(offlineData);
      }
    } finally {
      cityStore.setLoading(false);
    }
  };

  const fetchCitiesByName = (name: string): City[] => {
    return cities.value.filter((city) => city.name
      .toLowerCase()
      .includes(name.toLowerCase())
    );
  };
  

  return {
    loading,
    cities,
    fetchAllCities,
    fetchCitiesByName,
  };
}
