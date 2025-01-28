import axiosHttp from "@/utils/axios";
import type { GetCitiesResponse } from "@/modules/cities/types/cityInterfaces";

export const CityRepository = {

  fetCitiesByName: async (search: string): Promise<GetCitiesResponse> => {
    const response = await axiosHttp.get(
      "cities/all/", {
        params: {
          search,
        },
      }
    );
    return response.data;
  },

  fetchAllCities: async (): Promise<GetCitiesResponse> => {
    const response = await axiosHttp.get("cities/all");
    return response.data;
  },

};
