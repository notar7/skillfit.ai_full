import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import SignInPage from './SignInPage.js';
import SignUp from './SignUp';
import ResumeUploadPage from './ResumeUploadPage';
import AnalysisPage from './AnalysisPage';
import AdminDashboard from './AdminDashboard';
import StudentDetails from './StudentDetails';
import CourseRecommendation from './CourseRecommendation';
import ScanHistory from './ScanHistory';
import Courses from './Courses';
import ResetPassword from './components/ResetPassword';

// Mock authentication function (Replace with actual authentication logic)
const getUserRole = () => {
  const token = localStorage.getItem('token'); // Retrieve JWT token
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT
    return payload.role; // Extract user role
  } catch (error) {
    return null;
  }
};

// Protected Route Component
const ProtectedRoute = ({ element, allowedRoles }) => {
  const role = getUserRole();
  if (!role) {
    return <Navigate to="/signin" replace />; // Redirect to login if not authenticated
  }
  if (!allowedRoles.includes(role)) {
    return <Navigate to={role === 'admin' ? '/admin-dashboard' : '/upload-resume'} replace />;
  }
  return element;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/student-details" element={<StudentDetails />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course-recommendation" element={<CourseRecommendation />} />
        <Route path="/scan-history" element={<ScanHistory />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Protected Routes */}
        <Route path="/upload-resume" element={<ProtectedRoute element={<ResumeUploadPage />} allowedRoles={['user']} />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />} />

        {/* Fallback for unmatched routes */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
