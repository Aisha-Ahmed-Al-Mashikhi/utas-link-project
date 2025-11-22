// ------------------- IMPORTS -------------------
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createServer } from "http";
import { Server } from "socket.io";

import UserModel from "./Models/UserModel.js";
import CompanyModel from "./Models/CompanyModel.js";
import JobModel from "./Models/JobModel.js";
import ApplicationModel from "./Models/ApplicationModel.js";
import ChatModel from "./Models/ChatModel.js";

dotenv.config();

// ------------------- SERVER + SOCKET -------------------
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// ------------------- MIDDLEWARE -------------------
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// ------------------- DATABASE -------------------
const connectString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(connectString)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo Error:", err));

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

// ------------------- REGISTER USER -------------------
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

// ------------------- REGISTER COMPANY -------------------
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
    });

    await company.save();
    res.json({ company });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- LOGIN -------------------
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
  const user = await UserModel.findOne({ email: req.params.email });
  res.json(user);
});

app.get("/company/:email", async (req, res) => {
  const company = await CompanyModel.findOne({ email: req.params.email });
  res.json(company);
});

// ------------------- FETCH JOBS FOR COMPANY -------------------
app.get("/jobs/company/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const jobs = await JobModel.find({ postedBy: email }).sort({
      createdAt: -1,
    });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to load company jobs" });
  }
});

// ------------------- FETCH ALL JOBS -------------------
app.get("/jobs", async (req, res) => {
  const jobs = await JobModel.find().sort({ createdAt: -1 });
  res.json(jobs);
});

// ------------------- CREATE JOB -------------------
app.post("/jobs", async (req, res) => {
  try {
    const newJob = new JobModel(req.body);
    await newJob.save();
    res.json(newJob);
  } catch (err) {
    res.status(500).json({ error: "Job creation failed" });
  }
});

// ------------------- UPDATE JOB -------------------
app.put("/jobs/:id", async (req, res) => {
  try {
    const updated = await JobModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// ------------------- DELETE JOB -------------------
app.delete("/jobs/:id", async (req, res) => {
  try {
    await JobModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// ------------------- STUDENT APPLICATIONS -------------------
app.get("/applications/:email", async (req, res) => {
  const apps = await ApplicationModel.find({
    applicantEmail: req.params.email,
  }).sort({ createdAt: -1 });

  res.json(apps);
});

// ------------------- APPLICANTS FOR ONE JOB -------------------
app.get("/applicants/:jobId", async (req, res) => {
  const apps = await ApplicationModel.find({
    jobId: req.params.jobId,
  }).sort({ createdAt: -1 });

  res.json(apps);
});

// ------------------- UPDATE APPLICANT STATUS -------------------
app.put("/applicants/update/:id", async (req, res) => {
  const updated = await ApplicationModel.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(updated);
});

// ------------------- CHAT -------------------
app.get("/chat/:applicationId", async (req, res) => {
  const messages = await ChatModel.find({
    applicationId: req.params.applicationId,
  }).sort({ createdAt: 1 });

  res.json(messages);
});

// ------------------- SOCKET.IO CHAT -------------------
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (applicationId) => {
    socket.join(applicationId);
  });

  socket.on("send_message", async (data) => {
    const msg = new ChatModel({
      applicationId: data.applicationId,
      senderEmail: data.senderEmail,
      senderRole: data.senderRole,
      message: data.message,
      createdAt: new Date(),
    });

    await msg.save();

    io.to(data.applicationId).emit("receive_message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ------------------- START SERVER -------------------
httpServer.listen(3001, () =>
  console.log("Server + Socket.io running on port 3001")
);
