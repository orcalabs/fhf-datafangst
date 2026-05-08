import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import checker from "vite-plugin-checker";
import { compression } from "vite-plugin-compression2";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const https = env.HTTPS === "true";

  return {
    plugins: [
      ...(https ? [basicSsl()] : []),
      react(),
      checker({
        enableBuild: false,
        typescript: {
          tsconfigPath: "./tsconfig.app.json",
        },
        eslint: {
          lintCommand: 'eslint "./src/**/*.{ts,tsx,js,jsx}"',
        },
      }),
      compression({
        algorithms: ["gzip"],
      }),
    ],
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://192.168.0.60:8080",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
