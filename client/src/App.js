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
// import ChatPage from "./Component/ChatPage"; // Chat system

// Public Pages
import Home from "./Component/Home"; // Landing page
import About from "./Component/About"; // About the platform
import Developers from "./Component/Developers";


// Chat Pages
import ChatListStudent from "./Component/ChatListStudent";
import ChatListCompany from "./Component/ChatListCompany";
import ChatPageStudent from "./Component/ChatPageStudent";
import ChatPageCompany from "./Component/ChatPageCompany";

// Post Page
import Post from "./Component/Posts";
import CreatePost from "./Component/CreatePost";

function App() {
  return (
    <Router>
      {/* Header appears on every page */}
      <Header />

      <Routes>
        {/* ---------------- PUBLIC ROUTES ---------------- */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/developers" element={<Developers />} />


        {/* ---------------- STUDENT ROUTES ---------------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/student-profile" element={<StudentProfile />} />
        <Route path="/find-job" element={<FindJob />} />
        <Route path="/student-applications" element={<StudentApplications />} />
        {/* Student chat list */}
        <Route path="/student-chats" element={<ChatListStudent />} />
        <Route path="/posts" element={<Post />} />
        <Route path="/create-post" element={<CreatePost />} />

        {/* Student chat page (each application) */}
        <Route
          path="/student-chat/:applicationId"
          element={<ChatPageStudent />}
        />

        {/* ---------------- COMPANY ROUTES ---------------- */}
        <Route path="/company-register" element={<CompanyRegister />} />
        <Route path="/company-profile" element={<CompanyProfile />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/company-jobs" element={<CompanyJobs />} />
        <Route path="/applicants-job/:jobId" element={<ApplicantsJob />} />
        {/* Company chat list */}
        <Route path="/company-chats" element={<ChatListCompany />} />
        <Route path="/posts" element={<Post />} />
        <Route path="/create-post" element={<CreatePost />} />

        {/* Company chat page */}
        <Route
          path="/company-chat/:applicationId"
          element={<ChatPageCompany />}
        />

        {/* ---------------- CHAT ROUTE ---------------- */}
        {/* <Route path="/chat-page" element={<ChatPage />} /> */}
      </Routes>

      {/* Footer appears on every page */}
      <Footer />
    </Router>
  );
}

export default App;
