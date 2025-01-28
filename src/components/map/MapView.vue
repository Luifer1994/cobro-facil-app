<template>
  <div>
    <!-- Ajusta el tamaño con clases Tailwind o tu propio CSS -->
    <l-map class="w-full h-[500px]" :center="center" :zoom="zoom" @click="onMapClick">
      <!-- Capa base: OpenStreetMap -->
      <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors" />

      <!-- Marcador para la sede (draggable = arrastrable) -->
      <l-marker :lat-lng="markerPosition" :icon="customIcon" :draggable="true" @moveend="onMarkerDragEnd" />
    </l-map>

    <!-- Mostrar la latitud/longitud seleccionadas -->
    <div class="mt-4">
      <p><strong>Lat:</strong> {{ markerPosition[0] }}</p>
      <p><strong>Lng:</strong> {{ markerPosition[1] }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';

onMounted(() => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        center.value = [latitude, longitude] // mover el centro del mapa
      },
      (error) => {
        console.warn('No se pudo obtener la geolocalización:', error)
      }
    )
  }
})

// Posición inicial del mapa (por ejemplo, Bogotá)
const center = ref<[number, number]>([4.624335, -74.063644])
const zoom = ref(13)

// Posición inicial del marcador
const markerPosition = ref<[number, number]>([4.624335, -74.063644])

const customIcon = L.icon({
  // Cambia la URL a tu logo o imagen
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2791/2791217.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
})

// Evento al hacer clic en el mapa
function onMapClick(e: L.LeafletMouseEvent) {
  const { lat, lng } = e.latlng
  markerPosition.value = [lat, lng]
}

// Evento al arrastrar el marcador y soltarlo
function onMarkerDragEnd(e: L.LeafletEvent) {
  const { lat, lng } = e.target.getLatLng()
  markerPosition.value = [lat, lng]
}


</script>

<script lang="ts">
export default {
  name: 'MapView',
  components: {
    LMap,
    LTileLayer,
    LMarker
  }
}
</script>