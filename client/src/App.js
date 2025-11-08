import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./Component/Header";
import Footer from "./Component/Footer";

import Home from "./Component/Home";
import Login from "./Component/Login";
import UserRegister from "./Component/UserRegister";
import CompanyRegister from "./Component/CompanyRegister";
import PostJob from "./Component/PostJob";
import FindJob from "./Component/FindJob";
import CompanyJobs from "./Component/CompanyJobs";
import MyApplications from "./Component/MyApplications";
import UserProfile from "./Component/UserProfile";
import CompanyProfile from "./Component/CompanyProfile";
import ApplicantsJob from "./Component/ApplicantsJob";

function App() {
  return (
    <div id="root">
      <BrowserRouter>
        <Header />

        {/* ✅ المحتوى الرئيسي */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user-register" element={<UserRegister />} />
            <Route path="/company-register" element={<CompanyRegister />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/find-job" element={<FindJob />} />
            <Route path="/company-jobs" element={<CompanyJobs />} />
            <Route path="/my-app" element={<MyApplications />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/company-profile" element={<CompanyProfile />} />
            <Route path="/job-app" element={<ApplicantsJob />} />
          </Routes>
        </div>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
