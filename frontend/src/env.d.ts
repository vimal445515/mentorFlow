/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly VITE_BACKEND_URL?: string;
    readonly API_BASE_URL?: string;
    readonly VITE_API_BASE_URL?: string;
    readonly PORT?: string;
    [key: string]: string | undefined;
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
};
