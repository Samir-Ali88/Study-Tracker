import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProgressPage from "./pages/ProgressPage";
import ResourcesPage from "./pages/ResourcesPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      {/* Public auth route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected main routes (all share the Navbar via AppLayout) */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
      </Route>

      {/* Fallback route for any unknown address */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
