// ------------------- IMPORTS -------------------
import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import UserModel from "./Models/UserModel.js";
import CompanyModel from "./Models/CompanyModel.js";
import JobModel from "./Models/JobModel.js";
import ApplicationModel from "./Models/ApplicationModel.js";
import ChatModel from "./Models/ChatModel.js";
import { PostModel } from "./Models/PostModel.js";

import multer from "multer";
import path from "path";
import fs from "fs";

import * as ENV from "./config.js";

dotenv.config();

// ------------------- APP INIT -------------------
const app = express();
app.use(express.json());

// ------------------- CORS -------------------
const corsOptions = {
  origin: ENV.CLIENT_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

// ------------------- DATABASE CONNECTION -------------------
const connectString = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASSWORD}@${ENV.DB_CLUSTER}/${ENV.DB_NAME}?retryWrites=true&w=majority&appName=${ENV.APPNAME}`;

mongoose
  .connect(connectString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

// ------------------- FILE UPLOAD (CV) -------------------
const uploadFolder = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });

app.use("/uploads", express.static(uploadFolder));

/*───────────────────────────────────────────────
 ░░ REGISTER STUDENT
───────────────────────────────────────────────*/
app.post("/registerUser", async (req, res) => {
  try {
    const { name, email, password, major, age } = req.body;

    const exist = await UserModel.findOne({ email });
    if (exist) return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      email,
      password: hashed,
      major,
      age,
      role: "Student",
    });

    await user.save();
    res.send({ user, msg: "Added" });
  } catch (err) {
    res.status(500).json({ error: "Error registering user" });
  }
});

/*───────────────────────────────────────────────
 ░░ REGISTER COMPANY
───────────────────────────────────────────────*/
app.post("/registerCompany", async (req, res) => {
  try {
    const { companyName, email, password, industry, location, foundedDate } =
      req.body;

    const exist = await CompanyModel.findOne({ email });
    if (exist) return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const company = new CompanyModel({
      companyName,
      email,
      password: hashed,
      industry,
      location,
      foundedDate,
    });

    await company.save();
    res.send({ company, msg: "Added" });
  } catch {
    res.status(500).json({ error: "Error registering company" });
  }
});

/*───────────────────────────────────────────────
 ░░ LOGIN
───────────────────────────────────────────────*/
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
    if (!match) return res.status(401).json({ error: "Wrong password" });

    res.send({ user, role, message: "Success" });
  } catch (err) {
    res.status(500).json({ error: "Login error" });
  }
});

/*───────────────────────────────────────────────
 ░░ LOAD PROFILES
───────────────────────────────────────────────*/
app.get("/user/:email", async (req, res) => {
  const data = await UserModel.findOne({ email: req.params.email });
  res.send(data);
});

app.get("/company/:email", async (req, res) => {
  const data = await CompanyModel.findOne({ email: req.params.email });
  res.send(data);
});

/*───────────────────────────────────────────────
 ░░ UPLOAD CV
───────────────────────────────────────────────*/
app.post("/uploadCV", upload.single("cv"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No CV uploaded" });

    const email = req.body.email;
    const cvPath = `/uploads/${req.file.filename}`;

    await UserModel.findOneAndUpdate({ email }, { cvLink: cvPath });

    res.send({ cvLink: cvPath });
  } catch {
    res.status(500).json({ error: "CV upload failed" });
  }
});
/*───────────────────────────────────────────────
 ░░ DELETE CV
───────────────────────────────────────────────*/
app.put("/deleteCV", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // لو فيه CV سابق → نحذفه من مجلد uploads
    if (user.cvLink) {
      const filePath = path.join(process.cwd(), user.cvLink);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // نحذف الرابط من قاعدة البيانات
    await UserModel.findOneAndUpdate(
      { email },
      { cvLink: null }
    );

    res.send({ msg: "CV deleted successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error deleting CV" });
  }
});

/*───────────────────────────────────────────────
 ░░ JOBS
───────────────────────────────────────────────*/
app.get("/jobs", async (req, res) => {
  const jobs = await JobModel.find().sort({ createdAt: -1 });
  res.send(jobs);
});

app.get("/jobs/company/:email", async (req, res) => {
  const jobs = await JobModel.find({ postedBy: req.params.email });
  res.send(jobs);
});

app.post("/jobs", async (req, res) => {
  try {
    const job = new JobModel(req.body);
    await job.save();
    res.send(job);
  } catch {
    res.status(500).json({ error: "Job creation failed" });
  }
});

/*───────────────────────────────────────────────
 ░░ APPLICATIONS
───────────────────────────────────────────────*/

// ---- STUDENT APPLICATIONS ----
app.post("/apply", async (req, res) => {
  try {
    const exist = await ApplicationModel.findOne({
      jobId: req.body.jobId,
      applicantEmail: req.body.applicantEmail,
    });

    if (exist) return res.status(400).json({ error: "Already applied" });

    const newApp = new ApplicationModel({
      ...req.body,
      status: "Pending",
      appliedAt: new Date(),
    });

    await newApp.save();
    res.send(newApp);
  } catch {
    res.status(500).json({ error: "Apply failed" });
  }
});

app.get("/applications/:email", async (req, res) => {
  const apps = await ApplicationModel.find({
    applicantEmail: req.params.email,
  }).sort({ createdAt: -1 });

  res.send(apps);
});

// ---- COMPANY APPLICATIONS (FIX ADDED) ----
app.get("/applications/job/:jobId", async (req, res) => {
  try {
    const apps = await ApplicationModel.find({
      jobId: req.params.jobId,
    }).sort({ appliedAt: -1 });

    res.send(apps);
  } catch (err) {
    res.status(500).json({ error: "Failed to load applicants" });
  }
});

/*───────────────────────────────────────────────
 ░░ CHAT (GET + POST)
───────────────────────────────────────────────*/

// GET all messages for application
app.get("/chat/:applicationId", async (req, res) => {
  try {
    const msgs = await ChatModel.find({
      applicationId: req.params.applicationId,
    }).sort({ "message.sentAt": 1 });

    res.send(msgs);
  } catch (err) {
    res.status(500).json({ error: "Failed to load messages" });
  }
});

// POST new message
app.post("/chat", async (req, res) => {
  try {
    const newMsg = new ChatModel(req.body);
    await newMsg.save();

    res.send(newMsg);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

/*───────────────────────────────────────────────
 ░░ POSTS
───────────────────────────────────────────────*/
app.post("/addPost", async (req, res) => {
  try {
    const p = await PostModel.create(req.body);
    res.send(p);
  } catch {
    res.status(500).json({ msg: "Error adding post" });
  }
});

app.get("/posts", async (req, res) => {
  const posts = await PostModel.find().sort({ createdAt: -1 });
  res.send(posts);
});

/*───────────────────────────────────────────────
 ░░ START SERVER
───────────────────────────────────────────────*/
const port = ENV.PORT || 3001;
app.listen(port, () => {
  console.log(`You are connected at port: ${port}`);
});
