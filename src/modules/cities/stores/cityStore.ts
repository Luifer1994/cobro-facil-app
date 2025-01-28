// src/modules/cities/stores/cityStore.ts
import { defineStore } from 'pinia'
import type { City } from '../types/cityInterfaces'

export const useCityStore = defineStore({
  id: 'cityStore',
  state: () => ({
    cities: [] as City[],
    loading: false
  }),
  actions: {
    setCities(newCities: City[]) {
      this.cities = newCities
    },
    setLoading(value: boolean) {
      this.loading = value
    }
  }
})
