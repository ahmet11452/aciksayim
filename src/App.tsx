import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PrisonProvider } from './context/PrisonContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import Inmates from './pages/Inmates';

function App() {
  return (
    <PrisonProvider>
      <Router>
        <div className="flex min-h-screen bg-slate-50">
          <Sidebar />
          <main className="flex-1 ml-64">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inmates" element={<Inmates />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
      </Router>
    </PrisonProvider>
  );
}

export default App;
