import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function supabaseConfigPlugin(supabaseUrl, supabaseAnonKey) {
  const handleConfigRequest = (request, response, next) => {
    if (request.url?.split('?')[0] !== '/api/supabase-config') {
      next();
      return;
    }
    if (request.method !== 'GET') {
      response.statusCode = 405;
      response.setHeader('Allow', 'GET');
      response.end();
      return;
    }
    if (Boolean(supabaseUrl) !== Boolean(supabaseAnonKey)) {
      response.statusCode = 500;
      response.end('Both SUPABASE_URL and SUPABASE_ANON_KEY must be configured.');
      return;
    }

    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Cache-Control', 'no-store');
    response.end(JSON.stringify({
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
    }));
  };

  return {
    name: 'supabase-runtime-config',
    configureServer(server) {
      server.middlewares.use(handleConfigRequest);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleConfigRequest);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      supabaseConfigPlugin(env.SUPABASE_URL || '', env.SUPABASE_ANON_KEY || ''),
    ],
    server: {
      port: 3000,
      open: true,
    },
  };
});
