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
import { PostModel } from "./Models/PostModel.js";

dotenv.config();

// ------------------- SERVER + SOCKET -------------------
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ------------------- MIDDLEWARE -------------------
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// ------------------- DATABASE -------------------
mongoose
  .connect(process.env.MONGO_URI)
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

/*───────────────────────────────────────────────
 ░░  AUTH (REGISTER + LOGIN)
───────────────────────────────────────────────*/

// REGISTER STUDENT
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

// REGISTER COMPANY
app.post("/registerCompany", async (req, res) => {
  try {
    const { companyName, email, password, industry, location, foundedDate } =
      req.body;

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

/*───────────────────────────────────────────────
 ░░  LOAD PROFILES
───────────────────────────────────────────────*/

app.get("/user/:email", async (req, res) => {
  const user = await UserModel.findOne({ email: req.params.email });
  res.json(user);
});

app.get("/company/:email", async (req, res) => {
  const company = await CompanyModel.findOne({ email: req.params.email });
  res.json(company);
});

/*───────────────────────────────────────────────
 ░░  UPLOAD CV
───────────────────────────────────────────────*/

app.post("/uploadCV", upload.single("cv"), async (req, res) => {
  try {
    const email = req.body.email;

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const cvPath = `/uploads/${req.file.filename}`;

    await UserModel.findOneAndUpdate({ email }, { cvLink: cvPath });

    res.json({ cvLink: cvPath });
  } catch {
    res.status(500).json({ error: "CV upload failed" });
  }
});

app.put("/deleteCV", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user || !user.cvLink)
      return res.status(404).json({ error: "CV not found" });

    const filePath = path.join(process.cwd(), user.cvLink);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    user.cvLink = "";
    await user.save();

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

/*───────────────────────────────────────────────
 ░░  BANK CARD (ADD / EDIT / DELETE)
───────────────────────────────────────────────*/

// UPDATE OR ADD BANK CARD
app.put("/updateBankCard", async (req, res) => {
  try {
    const { email, selectedBank, cardNumber, cardName, expiry, cvv } = req.body;

    const user = await UserModel.findOneAndUpdate(
      { email },
      {
        bankName: selectedBank,
        cardNumber,
        cardName,
        expiry,
        cvv,
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Bank update failed" });
  }
});

// DELETE BANK CARD
app.put("/deleteBankCard", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOneAndUpdate(
      { email },
      {
        bankName: "",
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvv: "",
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Bank delete failed" });
  }
});

/*───────────────────────────────────────────────
 ░░  JOBS CRUD
───────────────────────────────────────────────*/

app.get("/jobs/company/:email", async (req, res) => {
  const jobs = await JobModel.find({ postedBy: req.params.email }).sort({
    createdAt: -1,
  });
  res.json(jobs);
});

app.get("/jobs", async (req, res) => {
  res.json(await JobModel.find().sort({ createdAt: -1 }));
});

app.post("/jobs", async (req, res) => {
  try {
    const newJob = new JobModel(req.body);
    await newJob.save();
    res.json(newJob);
  } catch {
    res.status(500).json({ error: "Job creation failed" });
  }
});

/*───────────────────────────────────────────────
 ░░  APPLICATIONS
───────────────────────────────────────────────*/

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

    if (exist) return res.status(400).json({ error: "Already applied" });

    const newApp = new ApplicationModel({
      jobId,
      jobTitle,
      organization,
      applicantEmail,
      applicantName,
      cvLink,
      status: "Pending",
      createdAt: new Date(),
    });

    await newApp.save();

    res.json(newApp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*───────────────────────────────────────────────
 ░░  CHAT + SOCKET
───────────────────────────────────────────────*/

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

/*───────────────────────────────────────────────
 ░░  POSTS
───────────────────────────────────────────────*/

app.post("/addPost", async (req, res) => {
  try {
    const post = await PostModel.create(req.body);
    res.json(post);
  } catch {
    res.status(500).json({ msg: "Error adding post" });
  }
});

app.get("/posts", async (req, res) => {
  res.json(await PostModel.find().sort({ createdAt: -1 }));
});

/*───────────────────────────────────────────────
 ░░  START SERVER
───────────────────────────────────────────────*/

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () =>
  console.log("Server running on port " + PORT)
);
