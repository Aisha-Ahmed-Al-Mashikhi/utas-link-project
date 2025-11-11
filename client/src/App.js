import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Component/Header";
import Footer from "./Component/Footer";

import UserRegister from "./Component/UserRegister";
import Login from "./Component/Login";
import UserProfile from "./Component/UserProfile";
import FindJob from "./Component/FindJob";
import MyApplications from "./Component/MyApplications";

import CompanyRegister from "./Component/CompanyRegister";
import CompanyProfile from "./Component/CompanyProfile";
import PostJob from "./Component/PostJob";
import CompanyJobs from "./Component/CompanyJobs";
import ApplicantsJob from "./Component/ApplicantsJob";
import ChatPage from "./Component/ChatPage";

import Home from "./Component/Home";
import About from "./Component/About";
import Payment from "./Component/Payment";
import JobDetails from "./Component/JobDetails";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/jobdetails" element={<JobDetails />} />

        {/* Student Page*/}
        <Route path="/login" element={<Login />} />
        <Route path="/user-register" element={<UserRegister />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/findjob" element={<FindJob />} />
        <Route path="/myapplications" element={<MyApplications />} />

        {/*  Company Page*/}
        <Route path="/company-register" element={<CompanyRegister />} />
        <Route path="/companyprofile" element={<CompanyProfile />} />
        <Route path="/postjob" element={<PostJob />} />
        <Route path="/companyjobs" element={<CompanyJobs />} />
        <Route path="/applicantsjob" element={<ApplicantsJob />} />
        <Route path="/chatpage" element={<ChatPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
