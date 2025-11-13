import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            className:
              'bg-slate-900/80 text-slate-50 backdrop-blur-xl border border-white/10 shadow-soft-lg rounded-2xl',
            success: { iconTheme: { primary: '#22d3ee', secondary: '#0f172a' } },
            error: { iconTheme: { primary: '#f87171', secondary: '#0f172a' } }
          }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);

