import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";
import Login from "./auth/Login";
import Home from "./pages/service/Home";
import QuestionForm from "./pages/service/QuestionForm";
import InterviewStart from "./pages/service/InterviewStart";
import Interview from "./pages/service/Interview";
import InterviewEnd from "./pages/service/InterviewEnd";
import ThankYou from "./pages/service/ThankYou";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 管理画面用ページ
import Dashboard from "./pages/adimin/Dashboard";
import SurveyDetails from "./components/admin/SurveyDetails";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={5000} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/questions"
            element={
              <PrivateRoute>
                <QuestionForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/interview-start"
            element={
              <PrivateRoute>
                <InterviewStart />
              </PrivateRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <PrivateRoute>
                <Interview />
              </PrivateRoute>
            }
          />
          <Route
            path="/interview-end"
            element={
              <PrivateRoute>
                <InterviewEnd />
              </PrivateRoute>
            }
          />
          <Route
            path="/thank-you"
            element={
              <PrivateRoute>
                <ThankYou />
              </PrivateRoute>
            }
          />
          {/* 管理画面 */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/details/:id" element={<SurveyDetails />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
