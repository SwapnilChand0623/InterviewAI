/**
 * Main App component with routing
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { Session } from '@/pages/Session';
import { Report } from '@/pages/Report';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/session" element={<Session />} />
        <Route path="/report" element={<Report />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
