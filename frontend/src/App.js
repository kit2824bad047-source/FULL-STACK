import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import StudentDashboard from './pages/StudentDashboard/StudentDashboard';
import JobBrowser from './pages/JobBrowser/JobBrowser';
import StudentProfile from './pages/StudentProfile/StudentProfile';
import RecruiterDashboard from './pages/RecruiterDashboard/RecruiterDashboard';
import RecruiterJobs from './pages/RecruiterJobs/RecruiterJobs';
import RecruiterProfile from './pages/RecruiterProfile/RecruiterProfile';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import StudentApplications from './pages/StudentApplications/StudentApplications';
import StudentStats from './pages/StudentStats/StudentStats';
import RecruiterApplicants from './pages/RecruiterApplicants/RecruiterApplicants';
import RecruiterStats from './pages/RecruiterStats/RecruiterStats';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Student Routes */}
            <Route path="/student-dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/jobs" element={<ProtectedRoute><JobBrowser /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
            <Route path="/student/applications" element={<ProtectedRoute><StudentApplications /></ProtectedRoute>} />
            <Route path="/student/stats" element={<ProtectedRoute><StudentStats /></ProtectedRoute>} />

            {/* Recruiter Routes */}
            <Route path="/recruiter-dashboard" element={<ProtectedRoute><RecruiterDashboard /></ProtectedRoute>} />
            <Route path="/recruiter/jobs" element={<ProtectedRoute><RecruiterJobs /></ProtectedRoute>} />
            <Route path="/recruiter/profile" element={<ProtectedRoute><RecruiterProfile /></ProtectedRoute>} />
            <Route path="/recruiter/applicants" element={<ProtectedRoute><RecruiterApplicants /></ProtectedRoute>} />
            <Route path="/recruiter/stats" element={<ProtectedRoute><RecruiterStats /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastContainer position="top-right" autoClose={4000} />
    </Router>
  );
}

export default App;
