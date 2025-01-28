// main.ts
import { createApp } from "vue"
import App from "@/App.vue"
import router from "@/router"
import { createPinia } from "pinia"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"

// Llama la sync global al evento 'online'
import { syncAllOfflineData } from "@/offline/syncAllOfflineData"

window.addEventListener('online', () => {
  console.log("Detectado modo online. Sincronizando datos offline...")
  syncAllOfflineData()
})

// Resto de tu setup
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount("#app")
