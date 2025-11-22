// ------------------- IMPORTS -------------------
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
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

// ------------------- MIDDLEWARE -------------------
app.use(express.json());

const allowedOrigin = process.env.CLIENT_URL || "http://localhost:3000";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

// ------------------- DATABASE -------------------
const connectString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(connectString)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo Error:", err));

// ------------------- AUTH ROUTES -------------------

app.post("/registerUser", async (req, res) => {
  try {
    const { name, email, password, major, age } = req.body;

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
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/registerCompany", async (req, res) => {
  try {
    const { companyName, email, password, industry, location } = req.body;

    const exist = await CompanyModel.findOne({ email });
    if (exist) return res.status(400).json({ error: "Email exists" });

    const hash = await bcrypt.hash(password, 10);

    const company = new CompanyModel({
      companyName,
      email,
      password: hash,
      industry,
      location,
      bankInfo: {
        bankName: "",
        accountNumber: "",
        accountHolder: "",
        iban: "",
      },
    });

    await company.save();
    res.json({ company });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
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

    res.json({ user, role });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------- FETCH PROFILES -------------------

app.get("/user/:email", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.params.email });
    res.json(user);
  } catch {
    res.status(500).json({ error: "Fetch failed" });
  }
});

app.get("/company/:email", async (req, res) => {
  try {
    const company = await CompanyModel.findOne({ email: req.params.email });
    res.json(company);
  } catch {
    res.status(500).json({ error: "Fetch failed" });
  }
});

// ------------------- FILE UPLOAD -------------------

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
    await UserModel.findOneAndUpdate({ email }, { cvLink: fileUrl });

    res.json({ cvLink: fileUrl });
  } catch {
    res.status(500).json({ error: "Upload failed" });
  }
});

// ------------------- BANK UPDATES -------------------

app.put("/updateBankCard", async (req, res) => {
  try {
    const { email, bankName, cardNumber, cardName, expiry, cvv } = req.body;

    const updated = await UserModel.findOneAndUpdate(
      { email },
      { bankName, cardNumber, cardName, expiry, cvv },
      { new: true }
    );

    res.json({ user: updated });
  } catch {
    res.status(500).json({ error: "Bank update failed" });
  }
});

// ------------------- JOB ROUTES -------------------

app.post("/addJob", async (req, res) => {
  try {
    const job = new JobModel(req.body);
    await job.save();
    res.json({ job });
  } catch {
    res.status(500).json({ error: "Add failed" });
  }
});

app.get("/jobs", async (req, res) => {
  const jobs = await JobModel.find();
  res.json(jobs);
});

// ------------------- APPLICATION ROUTES (NEW!!) -------------------

// SUBMIT APPLICATION
app.post("/apply", async (req, res) => {
  try {
    const {
      jobId,
      jobTitle,
      organization,
      applicantEmail,
      applicantName,
      cvLink,
    } = req.body;

    const exist = await ApplicationModel.findOne({
      jobId,
      applicantEmail,
    });

    if (exist) {
      return res.status(400).json({ error: "You already applied." });
    }

    const newApp = new ApplicationModel({
      jobId,
      jobTitle,
      organization,
      applicantEmail,
      applicantName,
      cvLink,
      status: "Pending Review",
      createdAt: new Date(),
    });

    await newApp.save();
    res.json(newApp);
  } catch {
    res.status(500).json({ error: "Apply failed" });
  }
});

// GET APPLICATIONS BY EMAIL
app.get("/applications/:email", async (req, res) => {
  try {
    const apps = await ApplicationModel.find({
      applicantEmail: req.params.email,
    }).sort({ createdAt: -1 });

    res.json(apps);
  } catch {
    res.status(500).json({ error: "Fetch failed" });
  }
});

// DELETE APPLICATION
app.delete("/applications/:id", async (req, res) => {
  try {
    await ApplicationModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Application deleted" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

// ------------------- SERVER START -------------------
const port = ENV.PORT || 3001;
app.listen(port, () => console.log("Server running on port", port));
