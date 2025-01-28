import { precacheAndRoute } from 'workbox-precaching';

// Declare __WB_MANIFEST as a global variable
declare let self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: any;
};

// Precache files
precacheAndRoute(self.__WB_MANIFEST);