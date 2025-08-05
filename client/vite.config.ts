import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const isDev = env.VITE_ENVIRONMENT === 'dev';

  return {
    plugins: [react()],
    server: isDev ? {
      https: {
        key: fs.readFileSync(env.VITE_CERT_KEY),
        cert: fs.readFileSync(env.VITE_CERT),
      },
    } : undefined,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, "src"),
      },
    },
  };
});