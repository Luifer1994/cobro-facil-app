import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import svgLoader from "vite-svg-loader";
import VueDevTools from "vite-plugin-vue-devtools";
import Components from "unplugin-vue-components/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };

  return {
    plugins: [
      vue({
        script: {
          defineModel: true,
        },
      }),
      vueJsx(),
      VueDevTools(),
      svgLoader(),
      Components({
        dts: "src/unplugin.components.d.ts",
      }),
      VitePWA({
        registerType: 'autoUpdate',
        // 1) Modo "production" u "development"
        mode: "production",

        // 2) Ruta base. Con "/" suele ser suficiente para la mayoría.
        base: "/",

        // 3) El directorio donde está tu custom service worker y su nombre
        srcDir: "src",
        filename: "sw.ts",

        // 4) Para incluir iconos adicionales (favicon, etc.)
        includeAssets: ["/favicon.ico"],

        // 5) Tipo de estrategia: "injectManifest" para usar tu sw.ts personalizado
        strategies: "injectManifest",

        // 6) El manifest de tu PWA
        manifest: {
          name: "Cobro Fácil",
          short_name: "Cobro Fácil",
          description: "Cobro Fácil App",
          theme_color: "#ffffff",
          start_url: "/",
          display: "standalone",
          background_color: "#ffffff",
          icons: [
            {
              src: "/logo.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/logo.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "/logo.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    optimizeDeps: {
      include: ["fast-deep-equal"],
    },
    define: {
      __APP_ENV__: JSON.stringify(process.env.APP_ENV),
    },
    server: {
      host: true,
      port: 3001,
      watch: {
        usePolling: true,
        interval: 1000,
      },
    },
  };
});
