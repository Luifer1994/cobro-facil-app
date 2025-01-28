<template>
    <div class="w-full h-[400px]">
      <l-map
        style="width: 100%; height: 100%"
        :center="center"
        :zoom="zoom"
        @click="onMapClick"
      >
        <!-- Capa de OpenStreetMap -->
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <l-marker
          v-if="markerPosition"
          :lat-lng="markerPosition"
          :icon="customIcon"
          :draggable="true"
          @moveend="onMarkerDragEnd"
        />
      </l-map>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch, onMounted, computed,watchEffect } from 'vue'
  import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'
  import L from 'leaflet'
  import { useThemeStore } from "@/stores/theme"
  
  /**
   * Props:
   *  - address: string (ej: "Carrera 15 # 10-50")
   *  - cityName: string (ej: "Plato")
   *  - departmentName: string (ej: "Magdalena")
   *  - countryName: string (ej: "Colombia")
   *  - latitude, longitude: para edición o si ya se conocen
   */
  const props = defineProps<{
    address: string
    cityName: string
    departmentName: string
    countryName: string
    latitude?: string | number
    longitude?: string | number
  }>()

  const themeStore = useThemeStore()

  const logoTenant = computed<string>(() => themeStore.getLogoTenant())
const logo = ref<string>("")

watchEffect(() => {
	logo.value = logoTenant.value ? logoTenant.value : "/logo.png"
});
  
  /**
   * Emits:
   *  - update-location: para pasar lat/lng al padre
   *  - update-address: cuando obtengamos una dirección nueva (reverse geocoding)
   */
  const emits = defineEmits<{
    (e: 'update-location', coords: { lat: number; lng: number }): void
    (e: 'update-address', newAddress: string): void
  }>()
  
  /** Centro y zoom inicial */
  const center = ref<[number, number]>([4.624335, -74.063644]) // Bogotá por defecto
  const zoom = ref(15)
  /** Posición del marcador */
  const markerPosition = ref<[number, number] | null>(null)
  /** Ícono personalizado */
  const customIcon = L.icon({
    iconUrl: logo.value,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  })
  
  /** 
   * 1. onMounted -> si tenemos latitude/longitude válidos, los usamos.
   */
  onMounted(() => {
    const latNum = parseFloat(String(props.latitude))
    const lngNum = parseFloat(String(props.longitude))
    if (!Number.isNaN(latNum) && !Number.isNaN(lngNum)) {
      markerPosition.value = [latNum, lngNum]
      center.value = [latNum, lngNum]
      zoom.value = 15
    }
  })
  
  /**
   * 2. watch -> cuando cambian address, cityName, dept, country
   *    hacemos geocodificación estructurada. Si no hay resultados,
   *    centramos en la ciudad. 
   */
  watch(
    () => [props.address, props.cityName, props.departmentName, props.countryName],
    async ([newAddress, newCity, newDept, newCountry]) => {
      if (!newCity?.trim() || !newDept?.trim() || !newCountry?.trim()) return
  
      // 2.1 Intentar geocodificación estructurada (street=, city=, state=, country=)
      const coords = await geocodeStructured(newAddress, newCity, newDept, newCountry)
      if (coords) {
        markerPosition.value = [coords.lat, coords.lng]
        center.value = [coords.lat, coords.lng]
        zoom.value = 15
        emits('update-location', { lat: coords.lat, lng: coords.lng })
      } else {
        // 2.2 Si no encontró la dirección, geocodificar sólo la ciudad:
        const coordsCity = await geocodeStructured('', newCity, newDept, newCountry)
        if (coordsCity) {
          markerPosition.value = [coordsCity.lat, coordsCity.lng]
          center.value = [coordsCity.lat, coordsCity.lng]
          zoom.value = 14
          emits('update-location', { lat: coordsCity.lat, lng: coordsCity.lng })
        }
      }
    },
    { immediate: true }
  )
  
  /**
   * Función geocodificación estructurada con Nominatim
   * (street, city, state, country).
   */
  async function geocodeStructured(
    street: string,
    city: string,
    state: string,
    country: string
  ): Promise<{ lat: number; lng: number } | null> {
    const baseUrl = 'https://nominatim.openstreetmap.org/search?'
    const params = new URLSearchParams({
      street,
      city,
      state,
      country,
      format: 'json',
      limit: '1'
    })
  
    try {
      const res = await fetch(baseUrl + params.toString())
      const data = await res.json()
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        }
      }
    } catch (error) {
      console.error('Error al geocodificar:', error)
    }
    return null
  }
  
  /**
   * 3. Reverse geocoding: dada lat/lng, obtener la dirección textual aproximada.
   *    Usamos la API de Nominatim: /reverse
   */
  async function reverseGeocode(lat: number, lon: number): Promise<string> {
    const baseUrl = 'https://nominatim.openstreetmap.org/reverse?'
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      format: 'json'
    })
    try {
      const res = await fetch(baseUrl + params.toString())
      const data = await res.json()
      if (data && data.address) {
        // Construimos una dirección resultante (puedes adaptarla a tu gusto)
        // Ejemplo: data.display_name o "Road, Suburb, City, Country"...
        return data.display_name || '' 
      }
    } catch (error) {
      console.error('Error en reverse geocoding:', error)
    }
    return ''
  }
  
  /**
   * Eventos de Leaflet (clic, arrastre del pin)
   * -> Al mover, asignamos lat/lng y tratamos de obtener la dirección con reverse geocoding.
   */
  async function onMapClick(e: L.LeafletMouseEvent) {
    markerPosition.value = [e.latlng.lat, e.latlng.lng]
    emits('update-location', { lat: e.latlng.lat, lng: e.latlng.lng })
  
    // Reverse geocoding
    const newAddress = await reverseGeocode(e.latlng.lat, e.latlng.lng)
    if (newAddress) {
      emits('update-address', newAddress)
    }
  }
  
  async function onMarkerDragEnd(e: L.LeafletEvent) {
    const { lat, lng } = e.target.getLatLng()
    markerPosition.value = [lat, lng]
    emits('update-location', { lat, lng })
  
    // Reverse geocoding
    const newAddress = await reverseGeocode(lat, lng)
    if (newAddress) {
      emits('update-address', newAddress)
    }
  }
  </script>
  
  <style scoped>
  /* Ajusta el tamaño a tu gusto */
  </style>
  