import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./layout/AppShell.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import InvoicePage from "./pages/InvoicePage.jsx";
import SupportPage from "./pages/SupportPage.jsx";
import MemoryPage from "./pages/MemoryPage.jsx";
import LogsPage from "./pages/LogsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/invoice" element={<InvoicePage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/memory" element={<MemoryPage />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
