import { precacheAndRoute } from 'workbox-precaching';

// Declarar __WB_MANIFEST como variable global
declare let self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: any;
};

// Precache de los archivos
precacheAndRoute(self.__WB_MANIFEST);
