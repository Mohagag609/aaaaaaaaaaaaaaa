import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Clients from './pages/Clients/Clients';
import Contracts from './pages/Contracts/Contracts';
import Units from './pages/Units/Units';
import Partners from './pages/Partners/Partners';
import Projects from './pages/Projects/Projects';
import Materials from './pages/Materials/Materials';
import Reports from './pages/Reports/Reports';
import './App.css';

// إنشاء عميل React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 دقائق
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App font-arabic" dir="rtl">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/contracts" element={<Contracts />} />
              <Route path="/units" element={<Units />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </Layout>
          
          {/* إشعارات النظام */}
          <Toaster
            position="top-left"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                fontFamily: 'Cairo, Tajawal, sans-serif',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
