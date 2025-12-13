// Import React Router components
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import header layout component
import Header from "./Component/Header";

// Import footer layout component
import Footer from "./Component/Footer";

// Import student registration page
import StudentRegister from "./Component/StudentRegister";

// Import login page
import Login from "./Component/Login";

// Import student profile page
import StudentProfile from "./Component/StudentProfile";

// Import job search page
import FindJob from "./Component/FindJob";

// Import student applications page
import StudentApplications from "./Component/StudentApplications";

// Import company registration page
import CompanyRegister from "./Component/CompanyRegister";

// Import company profile page
import CompanyProfile from "./Component/CompanyProfile";

// Import post job page
import PostJob from "./Component/PostJob";

// Import company jobs list page
import CompanyJobs from "./Component/CompanyJobs";

// Import applicants per job page
import ApplicantsJob from "./Component/ApplicantsJob";

// Import home landing page
import Home from "./Component/Home";

// Import developers page
import Developers from "./Component/Developers";

// Import student chat list page
import ChatListStudent from "./Component/ChatListStudent";

// Import company chat list page
import ChatListCompany from "./Component/ChatListCompany";

// Import student chat page
import ChatPageStudent from "./Component/ChatPageStudent";

// Import company chat page
import ChatPageCompany from "./Component/ChatPageCompany";

// Import posts page
import Post from "./Component/Posts";

// Import create post page
import CreatePost from "./Component/CreatePost";

// Main application component
function App() {
  // Return router structure
  return (
    // Wrap app with router
    <Router>
      {/* Render header globally */}
      <Header />

      {/* Define application routes */}
      <Routes>
        {/* Home route */}
        <Route path="/" element={<Home />} />

        {/* Developers route */}
        <Route path="/developers" element={<Developers />} />

        {/* Login route */}
        <Route path="/login" element={<Login />} />

        {/* Student register route */}
        <Route path="/student-register" element={<StudentRegister />} />

        {/* Student profile route */}
        <Route path="/student-profile" element={<StudentProfile />} />

        {/* Find job route */}
        <Route path="/find-job" element={<FindJob />} />

        {/* Student applications route */}
        <Route path="/student-applications" element={<StudentApplications />} />

        {/* Student chat list route */}
        <Route path="/student-chats" element={<ChatListStudent />} />

        {/* Posts route */}
        <Route path="/posts" element={<Post />} />

        {/* Create post route */}
        <Route path="/create-post" element={<CreatePost />} />

        {/* Student chat page route */}
        <Route
          path="/student-chat/:applicationId"
          element={<ChatPageStudent />}
        />

        {/* Company register route */}
        <Route path="/company-register" element={<CompanyRegister />} />

        {/* Company profile route */}
        <Route path="/company-profile" element={<CompanyProfile />} />

        {/* Post job route */}
        <Route path="/post-job" element={<PostJob />} />

        {/* Company jobs route */}
        <Route path="/company-jobs" element={<CompanyJobs />} />

        {/* Applicants per job route */}
        <Route path="/applicants-job/:jobId" element={<ApplicantsJob />} />

        {/* Company chat list route */}
        <Route path="/company-chats" element={<ChatListCompany />} />

        {/* Company chat page route */}
        <Route
          path="/company-chat/:applicationId"
          element={<ChatPageCompany />}
        />
      </Routes>

      {/* Render footer globally */}
      <Footer />
    </Router>
  );
}

// Export App component
export default App;
