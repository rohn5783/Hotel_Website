import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { supabaseReady } from './lib/supabaseClient';

const root = ReactDOM.createRoot(document.getElementById('root'));

const startApp = async () => {
  try {
    await supabaseReady;
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Application configuration failed:', error);
    root.render(
      <main className="min-h-screen flex items-center justify-center bg-slate-950 p-6 text-white">
        <p role="alert" className="max-w-lg text-center">
          App configuration could not be loaded. Check the Supabase environment variables and redeploy.
        </p>
      </main>
    );
  }
};

startApp();
