import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import NewQuestionPage from "./pages/NewQuestionPage";
import QuestionDetailPage from "./pages/QuestionDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/questions/new"
        element={
          <ProtectedRoute>
            <NewQuestionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/questions/:questionId"
        element={
          <ProtectedRoute>
            <QuestionDetailPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
