// src/utils/network.ts
export function isConnectionBadOrOffline(): boolean {
    // Primero, si está offline de plano:
    if (!navigator.onLine) {
      return true
    }
  
    // Luego, si Chrome soporta navigator.connection
    const anyNavigator = navigator as any
    const connection = anyNavigator.connection || anyNavigator.mozConnection || anyNavigator.webkitConnection
    if (connection) {
      // EfectiveType puede ser 'slow-2g', '2g', '3g', '4g'
      if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
        console.log("Conexión muy lenta (2g o slow-2g), tratándola como offline.")
        return true
      }
      // downlink es un número (Mbps aprox)
      if (connection.downlink && connection.downlink < 0.3) {
        console.log(`downlink < 0.3 => conexión muy lenta`)
        return true
      }
    }
  
    return false
  }
  