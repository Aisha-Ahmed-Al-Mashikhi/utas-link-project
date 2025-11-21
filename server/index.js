// ------------------- IMPORTS -------------------
import express from "express"; // Express framework for backend server
import mongoose from "mongoose"; // MongoDB object modeling
import cors from "cors"; // Middleware for Cross-Origin requests
import bcrypt from "bcryptjs"; // Password hashing
import dotenv from "dotenv"; // Load env variables
import multer from "multer"; // Handle file uploads
import path from "path"; // File path utilities
import fs from "fs"; // File system operations

// Import Models
import UserModel from "./Models/UserModel.js"; // Student schema
import CompanyModel from "./Models/CompanyModel.js"; // Company schema
import JobModel from "./Models/JobModel.js"; // Job schema
import ApplicationModel from "./Models/ApplicationModel.js"; // Applications schema
import * as ENV from "./config.js"; // Environment variables

dotenv.config(); // Load .env variables

const app = express(); // Initialize Express app

// ------------------- MIDDLEWARE -------------------
app.use(express.json()); // Parse JSON body requests
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin, // Allow frontend origin
    credentials: true, // Include cookies
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

// REGISTER STUDENT
app.post("/registerUser", async (req, res) => {
  try {
    const { name, email, password, major, age } = req.body;

    const exist = await UserModel.findOne({ email });
    if (exist) return res.status(400).json({ error: "Email exists" });

    const hash = await bcrypt.hash(password, 10); // Hash password

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

// REGISTER COMPANY
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

// LOGIN (STUDENT OR COMPANY)
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

// ------------------- FILE UPLOADS -------------------
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });
app.use("/uploads", express.static(uploadDir));

// UPLOAD STUDENT CV
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

// UPLOAD COMPANY LICENSE OR PROFILE IMAGE
app.post("/uploadCompanyFile", upload.single("file"), async (req, res) => {
  try {
    const { email, type } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file" });

    const fileUrl = `http://localhost:3001/uploads/${req.file.filename}`;

    const updateField =
      type === "license" ? { licenseFile: fileUrl } : { profileImage: fileUrl };

    await CompanyModel.findOneAndUpdate({ email }, updateField);

    res.json({ fileUrl });
  } catch {
    res.status(500).json({ error: "Upload company failed" });
  }
});

// ------------------- BANK UPDATES -------------------
// STUDENT BANK
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

// COMPANY BANK
app.put("/company/updateBank", async (req, res) => {
  try {
    const { email, selectedBank, accountNumber, accountHolder, iban } =
      req.body;

    const updated = await CompanyModel.findOneAndUpdate(
      { email },
      {
        bankInfo: {
          bankName: selectedBank,
          accountNumber,
          accountHolder,
          iban,
        },
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Company not found" });

    res.json({ message: "Bank updated", company: updated });
  } catch (err) {
    res.status(500).json({ error: "Company bank update failed" });
  }
});

// DELETE COMPANY BANK
app.put("/company/deleteBankCard", async (req, res) => {
  try {
    const { email } = req.body;

    const updated = await CompanyModel.findOneAndUpdate(
      { email },
      {
        bankInfo: {
          bankName: "",
          accountNumber: "",
          accountHolder: "",
          iban: "",
        },
      },
      { new: true }
    );

    res.json({ message: "Company bank deleted", company: updated });
  } catch {
    res.status(500).json({ error: "Delete failed" });
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

// ------------------- SERVER START -------------------
const port = ENV.PORT || 3001;
app.listen(port, () => console.log("Server running on port", port));
