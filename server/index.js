// ------------------- IMPORTS -------------------
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
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
import { PostModel } from "./Models/PostModel.js";

import * as ENV from "./config.js";

dotenv.config();


// ------------------- SERVER + SOCKET -------------------
const app = express();
const httpServer = createServer(app);

// CORS (أسلوب الدكتورة)
const corsOptions = {
  origin: ENV.CLIENT_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());


// ------------------- DATABASE CONNECTION -------------------
const connectString = ENV.MONGO_URI;

mongoose
  .connect(connectString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));


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


// ------------------- REGISTER STUDENT -------------------
app.post("/registerUser", async (req, res) => {
  try {
    const { name, email, password, major, age } = req.body;

    const exist = await UserModel.findOne({ email });
    if (exist) return res.status(400).json({ error: "Email exists" });

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
    res.send({ user, msg: "Added." });
  } catch (err) {
    res.status(500).json({ error: "Error" });
  }
});


// ------------------- REGISTER COMPANY -------------------
app.post("/registerCompany", async (req, res) => {
  try {
    const { companyName, email, password, industry, location, foundedDate } =
      req.body;

    const exist = await CompanyModel.findOne({ email });
    if (exist) return res.status(400).json({ error: "Email exists" });

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
    res.send({ company, msg: "Added." });
  } catch (err) {
    res.status(500).json({ error: "Error" });
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

    if (!user) return res.status(404).json({ error: "User not found." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Incorrect password" });

    res.send({ user, role, msg: "Success." });
  } catch (err) {
    res.status(500).json({ error: "Error" });
  }
});


// ------------------- LOAD PROFILES -------------------
app.get("/user/:email", async (req, res) => {
  const data = await UserModel.findOne({ email: req.params.email });
  res.send(data);
});

app.get("/company/:email", async (req, res) => {
  const data = await CompanyModel.findOne({ email: req.params.email });
  res.send(data);
});


// ------------------- UPLOAD CV -------------------
app.post("/uploadCV", upload.single("cv"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const email = req.body.email;
    const cvPath = `/uploads/${req.file.filename}`;

    await UserModel.findOneAndUpdate({ email }, { cvLink: cvPath });

    res.send({ cvLink: cvPath });
  } catch {
    res.status(500).json({ error: "CV upload failed" });
  }
});


// ------------------- JOBS CRUD -------------------
app.get("/jobs", async (req, res) => {
  const jobs = await JobModel.find().sort({ createdAt: -1 });
  res.send(jobs);
});

app.get("/jobs/company/:email", async (req, res) => {
  const jobs = await JobModel.find({ postedBy: req.params.email }).sort({
    createdAt: -1,
  });
  res.send(jobs);
});

app.post("/jobs", async (req, res) => {
  try {
    const newJob = new JobModel(req.body);
    await newJob.save();
    res.send(newJob);
  } catch {
    res.status(500).json({ error: "Job creation failed" });
  }
});


// ------------------- APPLICATIONS -------------------
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


// ------------------- CHAT (REST API) -------------------
app.get("/chat/:applicationId", async (req, res) => {
  const msgs = await ChatModel.find({
    applicationId: req.params.applicationId,
  }).sort({ createdAt: 1 });

  res.send(msgs);
});

app.post("/chat/send", async (req, res) => {
  try {
    const msg = new ChatModel({
      applicationId: req.body.applicationId,
      senderEmail: req.body.senderEmail,
      senderRole: req.body.senderRole,
      message: req.body.message,
      createdAt: Date.now(),
    });

    await msg.save();
    res.send(msg);
  } catch {
    res.status(500).json({ error: "Failed to send" });
  }
});


// ------------------- SOCKET.IO (REALTIME CHAT) -------------------
const io = new Server(httpServer, {
  cors: {
    origin: ENV.CLIENT_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (id) => socket.join(id));

  socket.on("send_message", async (data) => {
    const msg = new ChatModel({
      applicationId: data.applicationId,
      senderEmail: data.senderEmail,
      senderRole: data.senderRole,
      message: data.message,
      createdAt: Date.now(),
    });

    await msg.save();
    io.to(data.applicationId).emit("receive_message", msg);
  });
});


// ------------------- POSTS -------------------
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


// ------------------- START SERVER (أسلوب الدكتورة) -------------------
const port = ENV.PORT || 3001;

httpServer.listen(port, () => {
  console.log(`You are connected at port: ${port}`);
});
