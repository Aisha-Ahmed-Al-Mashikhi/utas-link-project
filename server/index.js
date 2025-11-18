import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";

import UserModel from "./Models/UserModel.js";
import CompanyModel from "./Models/CompanyModel.js";
import JobModel from "./Models/JobModel.js";
import ApplicationModel from "./Models/ApplicationModel.js";
import * as ENV from "./config.js";

dotenv.config();
const app = express();

app.use(express.json());
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

const connectString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=UtasLinkCluster`;
mongoose
  .connect(connectString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo Error:", err));

// register user
app.post("/registerUser", async (req, res) => {
  try {
    const { name, email, password, major, age } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "Missing fields" });

    const exist = await UserModel.findOne({ email });
    if (exist) return res.status(400).json({ error: "Email exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = new UserModel({
      name,
      email,
      password: hash,
      major,
      age,
      role: "Student",
    });
    await user.save();
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// register company
app.post("/registerCompany", async (req, res) => {
  try {
    const { companyName, email, password, industry, location, foundedDate } =
      req.body;
    if (!companyName || !email || !password)
      return res.status(400).json({ error: "Missing fields" });

    const exist = await CompanyModel.findOne({ email });
    if (exist) return res.status(400).json({ error: "Email exists" });

    const hash = await bcrypt.hash(password, 10);
    const company = new CompanyModel({
      companyName,
      email,
      password: hash,
      industry,
      location,
      foundedDate,
    });
    await company.save();
    res.status(201).json({ company });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// login
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

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Incorrect password" });

    res.status(200).json({ message: "Login success", user, role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get user
app.get("/user/:email", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: "Not found" });
    res.status(200).json(user);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// get company
app.get("/company/:email", async (req, res) => {
  try {
    const company = await CompanyModel.findOne({ email: req.params.email });
    if (!company) return res.status(404).json({ error: "Not found" });
    res.status(200).json(company);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// update bank info
app.post("/company/:email/bank", async (req, res) => {
  try {
    const { email } = req.params;
    const { accountHolder, bankName, accountNumber, iban } = req.body;
    const updated = await CompanyModel.findOneAndUpdate(
      { email },
      { $set: { bankInfo: { accountHolder, bankName, accountNumber, iban } } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.status(200).json({ message: "Bank info saved", company: updated });
  } catch {
    res.status(500).json({ error: "Save failed" });
  }
});

// add job
app.post("/addJob", async (req, res) => {
  try {
    const job = new JobModel(req.body);
    await job.save();
    res.status(200).json({ job });
  } catch {
    res.status(500).json({ error: "Add failed" });
  }
});

// get all jobs
app.get("/jobs", async (req, res) => {
  try {
    const jobs = await JobModel.find();
    res.status(200).json(jobs);
  } catch {
    res.status(500).json({ error: "Fetch failed" });
  }
});

// update job
app.put("/jobs/:id", async (req, res) => {
  try {
    const job = await JobModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!job) return res.status(404).json({ error: "Not found" });
    res.status(200).json({ job });
  } catch {
    res.status(500).json({ error: "Update failed" });
  }
});

// delete job
app.delete("/jobs/:id", async (req, res) => {
  try {
    const job = await JobModel.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: "Not found" });
    res.status(200).json({ message: "Deleted" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

// apply (includes CV from user profile)
app.post("/apply", async (req, res) => {
  try {
    const { jobId, jobTitle, organization, applicantEmail, applicantName } =
      req.body;

    const exist = await ApplicationModel.findOne({ jobId, applicantEmail });
    if (exist) return res.status(400).json({ error: "Already applied" });

    const user = await UserModel.findOne({ email: applicantEmail });
    const cvLink = user?.cvLink || "";

    const appData = new ApplicationModel({
      jobId,
      jobTitle,
      organization,
      applicantEmail,
      applicantName,
      cvLink,
      status: "Pending Review",
    });

    await appData.save();
    res.status(200).json({ message: "Applied", appData });
  } catch {
    res.status(500).json({ error: "Apply failed" });
  }
});

// student applications
app.get("/applications/:email", async (req, res) => {
  try {
    const apps = await ApplicationModel.find({
      applicantEmail: req.params.email,
    });
    res.status(200).json(apps);
  } catch {
    res.status(500).json({ error: "Fetch failed" });
  }
});

// company applications
app.get("/applications/company/:organization", async (req, res) => {
  try {
    const apps = await ApplicationModel.find({
      organization: req.params.organization,
    });
    res.status(200).json(apps);
  } catch {
    res.status(500).json({ error: "Fetch failed" });
  }
});

// delete application
app.delete("/applications/:id", async (req, res) => {
  try {
    const del = await ApplicationModel.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ error: "Not found" });
    res.status(200).json({ message: "Deleted" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

// update application status
app.put("/applications/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await ApplicationModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.status(200).json({ message: "Updated", updated });
  } catch {
    res.status(500).json({ error: "Update failed" });
  }
});

/* file uploads */
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

app.use("/uploads", express.static(uploadDir));

app.post("/uploadCV", upload.single("cv"), async (req, res) => {
  try {
    const { email } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file" });
    const fileUrl = `http://localhost:3001/uploads/${req.file.filename}`;
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { cvLink: fileUrl },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "CV uploaded", cvLink: fileUrl });
  } catch {
    res.status(500).json({ error: "Upload failed" });
  }
});

app.post("/uploadCompanyFile", upload.single("file"), async (req, res) => {
  try {
    const { email, type } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file" });
    const fileUrl = `http://localhost:3001/uploads/${req.file.filename}`;
    const field =
      type === "license" ? { licenseFile: fileUrl } : { profileImage: fileUrl };
    const updated = await CompanyModel.findOneAndUpdate({ email }, field, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Company not found" });
    res.status(200).json({ message: "File uploaded", fileUrl });
  } catch {
    res.status(500).json({ error: "Upload failed" });
  }
});

app.put("/updateBankCard", async (req, res) => {
  try {
    const { email, cardNumber, cardName, expiry, cvv, bankName } = req.body;

    const user = await UserModel.findOneAndUpdate(
      { email },
      { cardNumber, cardName, expiry, cvv, bankName },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Card saved", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save card" });
  }
});

const port = ENV.PORT || 3001;
app.listen(port, () => {
  console.log(`You are connected at port: ${port}`);
});
