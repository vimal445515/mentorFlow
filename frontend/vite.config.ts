import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import path from "path";

// Load variables from .env into process.env using dotenv
dotenv.config();

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "./src"),
      },
    },
    define: {
      // Expose process.env in the client bundle so frontend uses process.env instead of import.meta.env
      "process.env": JSON.stringify(env),
    },
    server: {
      port: Number(env.PORT) || 5173,
      proxy: {
        "/api": {
          target: env.VITE_BACKEND_URL || "http://localhost:3000",
          changeOrigin: true,
          secure: false,
        },
      },
      allowedHosts: ['catty-pedigree-grappling.ngrok-free.dev'],
    },
  };
});
