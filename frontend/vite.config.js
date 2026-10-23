import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const frontendRoot = fileURLToPath(new URL('.', import.meta.url));
const projectRoot = fileURLToPath(new URL('..', import.meta.url));

export default defineConfig(({ mode }) => {
  const { PORT = '5000' } = loadEnv(mode, projectRoot, '');
  const backendPort = Number(PORT);

  if (!Number.isInteger(backendPort) || backendPort < 1 || backendPort > 65535) {
    throw new Error('PORT must be a valid port number between 1 and 65535.');
  }

  return {
    root: frontendRoot,
    plugins: [react()],
    server: {
      port: 3000,
      strictPort: true,
      open: true,
      proxy: {
        '/api': `http://localhost:${backendPort}`,
      },
    },
  };
});
