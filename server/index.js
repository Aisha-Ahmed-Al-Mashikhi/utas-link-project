import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import UserModel from "./Models/UserModel.js";
import CompanyModel from "./Models/CompanyModel.js";
import JobModel from "./Models/JobModel.js";
import ApplicationModel from "./Models/ApplicationModel.js";

dotenv.config();

const app = express();

// Parse JSON bodies
app.use(express.json());

// CORS: allow frontend origin (use .env CLIENT_URL or fallback to Vite 5173)
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

// MongoDB connection (all parts from .env)
const connectString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=UtasLinkCluster`;

mongoose
  .connect(connectString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

/*  AUTH & PROFILES */

// Register Student
app.post("/registerUser", async (req, res) => {
  try {
    const { name, email, password, major, age } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      major,
      age,
      role: "Student",
    });

    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register Company
app.post("/registerCompany", async (req, res) => {
  try {
    const { companyName, email, password, industry, location, foundedDate } =
      req.body;

    if (!companyName || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingCompany = await CompanyModel.findOne({ email });
    if (existingCompany)
      return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = new CompanyModel({
      companyName,
      email,
      password: hashedPassword,
      industry,
      location,
      foundedDate,
    });

    await company.save();
    res.status(201).json({ company });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login for User or Company
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await UserModel.findOne({ email });
    let role = "student";

    if (!user) {
      user = await CompanyModel.findOne({ email });
      role = "company";
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ error: "Incorrect password" });

    res.status(200).json({ message: "Login successful", user, role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Student by Email
app.get("/user/:email", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// Get Company by Email
app.get("/company/:email", async (req, res) => {
  try {
    const company = await CompanyModel.findOne({ email: req.params.email });
    if (!company) return res.status(404).json({ error: "Company not found" });
    res.status(200).json(company);
  } catch {
    res.status(500).json({ error: "Error loading company profile" });
  }
});

// Save or Update Company Bank Info
app.post("/company/:email/bank", async (req, res) => {
  try {
    const { email } = req.params;
    const { accountHolder, bankName, accountNumber, iban } = req.body;

    const updatedCompany = await CompanyModel.findOneAndUpdate(
      { email },
      { $set: { bankInfo: { accountHolder, bankName, accountNumber, iban } } },
      { new: true }
    );

    if (!updatedCompany)
      return res.status(404).json({ error: "Company not found" });

    res.status(200).json({
      message: "Bank details saved successfully",
      company: updatedCompany,
    });
  } catch {
    res.status(500).json({ error: "Failed to save bank details" });
  }
});

/*  JOBS */

// Add Job (company posts a job)
app.post("/addJob", async (req, res) => {
  try {
    const job = new JobModel(req.body);
    await job.save();
    res.status(200).json({ job, message: "Job added successfully" });
  } catch {
    res.status(500).json({ error: "Failed to add job" });
  }
});

// Get All Jobs (student Find Job)
app.get("/jobs", async (req, res) => {
  try {
    const jobs = await JobModel.find();
    res.status(200).json(jobs);
  } catch {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// Update Job by ID (company edits its job)
app.put("/jobs/:id", async (req, res) => {
  try {
    const updatedJob = await JobModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedJob) return res.status(404).json({ error: "Job not found" });
    res.status(200).json({ msg: "Job updated successfully", updatedJob });
  } catch {
    res.status(500).json({ error: "Failed to update job" });
  }
});

// Delete Job by ID (company deletes its job)
app.delete("/jobs/:id", async (req, res) => {
  try {
    const deletedJob = await JobModel.findByIdAndDelete(req.params.id);
    if (!deletedJob) return res.status(404).json({ error: "Job not found" });
    res.status(200).json({ msg: "Job deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete job" });
  }
});

/* APPLICATIONS  */

// Apply for Job (student submit)
app.post("/apply", async (req, res) => {
  try {
    const {
      jobId,
      jobTitle,
      organization,
      applicantEmail,
      applicantName,
      cvLink, // optional if you support CV links
    } = req.body;

    const existing = await ApplicationModel.findOne({ jobId, applicantEmail });
    if (existing)
      return res.status(400).json({ error: "Already applied for this job" });

    const newApplication = new ApplicationModel({
      jobId,
      jobTitle,
      organization,
      applicantEmail,
      applicantName,
      cvLink,
      status: "Pending Review",
    });

    await newApplication.save();
    res.status(200).json({ msg: "Application saved", newApplication });
  } catch {
    res.status(500).json({ error: "Failed to apply" });
  }
});

// Get Applications by Student Email (MyApplications)
app.get("/applications/:email", async (req, res) => {
  try {
    const apps = await ApplicationModel.find({
      applicantEmail: req.params.email,
    });
    res.status(200).json(apps);
  } catch {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// Get Applications for a specific Company (ApplicantsJob)
app.get("/applications/company/:organization", async (req, res) => {
  try {
    const apps = await ApplicationModel.find({
      organization: req.params.organization,
    });
    res.status(200).json(apps);
  } catch {
    res.status(500).json({ error: "Failed to fetch company applications" });
  }
});

// Delete Application by ID (student cancel)
app.delete("/applications/:id", async (req, res) => {
  try {
    const deleted = await ApplicationModel.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Application not found" });
    res.status(200).json({ msg: "Application deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete application" });
  }
});

// Update Application Status (company accept/reject)
app.put("/applications/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedApp = await ApplicationModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedApp)
      return res.status(404).json({ error: "Application not found" });
    res.status(200).json({ msg: "Status updated", updatedApp });
  } catch {
    res.status(500).json({ error: "Failed to update status" });
  }
});

/* START SERVER */

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
