// Import React Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout Components
import Header from "./Component/Header"; // Always visible
import Footer from "./Component/Footer"; // Always visible

// Student Pages
import StudentRegister from "./Component/StudentRegister"; // Student registration
import Login from "./Component/Login"; // Login page (student/company)
import StudentProfile from "./Component/StudentProfile"; // Student profile/dashboard
import FindJob from "./Component/FindJob"; // Student job search
import StudentApplications from "./Component/StudentApplications"; // View student's job applications

// Company Pages
import CompanyRegister from "./Component/CompanyRegister"; // Company registration
import CompanyProfile from "./Component/CompanyProfile"; // Company profile/dashboard
import PostJob from "./Component/PostJob"; // Company creates a new job
import CompanyJobs from "./Component/CompanyJobs"; // Company job listings
import ApplicantsJob from "./Component/ApplicantsJob"; // Applicants for a specific job
import ChatPage from "./Component/ChatPage"; // Chat system

// Public Pages
import Home from "./Component/Home"; // Landing page
import About from "./Component/About"; // About the platform

function App() {
  return (
    <Router>
      {/* Header appears on every page */}
      <Header />

      <Routes>
        {/* ---------------- PUBLIC ROUTES ---------------- */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* ---------------- STUDENT ROUTES ---------------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/student-profile" element={<StudentProfile />} />
        <Route path="/find-job" element={<FindJob />} />
        <Route path="/student-applications" element={<StudentApplications />} />

        {/* ---------------- COMPANY ROUTES ---------------- */}
        <Route path="/company-register" element={<CompanyRegister />} />
        <Route path="/company-profile" element={<CompanyProfile />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/company-jobs" element={<CompanyJobs />} />
        <Route path="/applicants-job" element={<ApplicantsJob />} />

        {/* ---------------- CHAT ROUTE ---------------- */}
        <Route path="/chat-page" element={<ChatPage />} />
      </Routes>

      {/* Footer appears on every page */}
      <Footer />
    </Router>
  );
}

export default App;
