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
    //origin: "http://localhost:3000",
    //methods: ["GET", "POST"],
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true
  },
});

// ------------------- MIDDLEWARE -------------------
app.use(express.json());
app.use(
  cors({
    //origin: "http://localhost:3000",
    //credentials: true,
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

// ------------------- DATABASE -------------------
//const connectString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

//mongoose
  //.connect(connectString)
  //.then(() => console.log("MongoDB Connected"))
 // .catch((err) => console.error("Mongo Error:", err));

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

// LOGIN (STUDENT + COMPANY)
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
 ░░  UPLOAD CV (STUDENT PROFILE)
───────────────────────────────────────────────*/

app.post("/uploadCV", upload.single("cv"), async (req, res) => {
  try {
    const email = req.body.email;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const cvPath = `/uploads/${req.file.filename}`;

    await UserModel.findOneAndUpdate(
      { email },
      { cvLink: cvPath },
      { new: true }
    );

    res.json({ cvLink: cvPath });
  } catch (err) {
    res.status(500).json({ error: "CV upload failed" });
  }
});
app.put("/deleteCV", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user || !user.cvLink) {
      return res.status(404).json({ error: "CV not found" });
    }

    const filePath = path.join(process.cwd(), user.cvLink);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    user.cvLink = "";
    await user.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

/*───────────────────────────────────────────────
 ░░  JOBS CRUD
───────────────────────────────────────────────*/

// GET COMPANY JOBS
app.get("/jobs/company/:email", async (req, res) => {
  try {
    const jobs = await JobModel.find({ postedBy: req.params.email }).sort({
      createdAt: -1,
    });
    res.json(jobs);
  } catch {
    res.status(500).json({ error: "Failed to load company jobs" });
  }
});

// GET ALL JOBS
app.get("/jobs", async (req, res) => {
  const jobs = await JobModel.find().sort({ createdAt: -1 });
  res.json(jobs);
});

// CREATE JOB
app.post("/jobs", async (req, res) => {
  try {
    const newJob = new JobModel(req.body);
    await newJob.save();
    res.json(newJob);
  } catch {
    res.status(500).json({ error: "Job creation failed" });
  }
});

// UPDATE JOB
app.put("/jobs/:id", async (req, res) => {
  try {
    const updated = await JobModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Update failed" });
  }
});

// DELETE JOB
app.delete("/jobs/:id", async (req, res) => {
  try {
    await JobModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

/*───────────────────────────────────────────────
 ░░  APPLICATIONS
───────────────────────────────────────────────*/

// APPLY FOR JOB  ✅ Fixed
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

    if (!jobId) {
      return res.status(400).json({ error: "Missing jobId" });
    }

    const exist = await ApplicationModel.findOne({
      jobId,
      applicantEmail,
    });

    if (exist) {
      return res.status(400).json({ error: "Already applied" });
    }

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

// GET APPLICATIONS OF ONE STUDENT
app.get("/applications/:email", async (req, res) => {
  const apps = await ApplicationModel.find({
    applicantEmail: req.params.email,
  }).sort({ createdAt: -1 });

  res.json(apps);
});

// GET APPLICANTS FOR ONE JOB (FIXED)
app.get("/applicants", async (req, res) => {
  const jobId = req.query.jobId;

  if (!jobId) {
    return res.status(400).json({ error: "Missing jobId" });
  }

  const apps = await ApplicationModel.find({ jobId }).sort({ appliedAt: -1 });

  res.json(apps);
});

// UPDATE APPLICANT STATUS
app.put("/applicants/update/:id", async (req, res) => {
  const updated = await ApplicationModel.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(updated);
});

/*───────────────────────────────────────────────
 ░░  CHAT (API)
───────────────────────────────────────────────*/

app.get("/chat/:applicationId", async (req, res) => {
  const messages = await ChatModel.find({
    applicationId: req.params.applicationId,
  }).sort({ createdAt: 1 });

  res.json(messages);
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
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: "Message not saved" });
  }
});

/*───────────────────────────────────────────────
 ░░  SOCKET.IO (REALTIME)
───────────────────────────────────────────────*/

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
      createdAt: Date.now(),
    });

    await msg.save();

    io.to(data.applicationId).emit("receive_message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/*───────────────────────────────────────────────
 ░░  POSTS (CREATE)
───────────────────────────────────────────────*/

app.post("/addPost", async (req, res) => {
  try {
    const newPost = await PostModel.create(req.body);
    res.json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error adding post" });
  }
});

/*───────────────────────────────────────────────
 ░░  POSTS (LIKE)
───────────────────────────────────────────────*/

app.put("/likePost/:postId", async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await PostModel.findOne({ _id: postId });
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const hasLiked = post.likes.users.includes(userId);
    const hasDisliked = post.dislikes.users.includes(userId);

    if (hasLiked) {
      // UNLIKE
      const updated = await PostModel.findOneAndUpdate(
        { _id: postId },
        {
          $inc: { "likes.count": -1 },
          $pull: { "likes.users": userId },
        },
        { new: true }
      );
      return res.json({ post: updated });
    } else {
      // LIKE + REMOVE DISLIKE IF EXISTS
      const updated = await PostModel.findOneAndUpdate(
        { _id: postId },
        {
          $inc: {
            "likes.count": 1,
            "dislikes.count": hasDisliked ? -1 : 0,
          },
          $addToSet: { "likes.users": userId },
          $pull: { "dislikes.users": userId },
        },
        { new: true }
      );
      return res.json({ post: updated });
    }
  } catch (err) {
    res.status(500).json({ msg: "Error liking post" });
  }
});

/*───────────────────────────────────────────────
 ░░  POSTS (DISLIKE)
───────────────────────────────────────────────*/
app.put("/dislikePost/:postId", async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await PostModel.findOne({ _id: postId });
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const hasLiked = post.likes.users.includes(userId);
    const hasDisliked = post.dislikes.users.includes(userId);

    if (hasDisliked) {
      // REMOVE DISLIKE
      const updated = await PostModel.findOneAndUpdate(
        { _id: postId },
        {
          $inc: { "dislikes.count": -1 },
          $pull: { "dislikes.users": userId },
        },
        { new: true }
      );
      return res.json({ post: updated });
    } else {
      // DISLIKE + REMOVE LIKE IF EXISTS
      const updated = await PostModel.findOneAndUpdate(
        { _id: postId },
        {
          $inc: {
            "dislikes.count": 1,
            "likes.count": hasLiked ? -1 : 0,
          },
          $addToSet: { "dislikes.users": userId },
          $pull: { "likes.users": userId },
        },
        { new: true }
      );
      return res.json({ post: updated });
    }
  } catch (err) {
    res.status(500).json({ msg: "Error disliking post" });
  }
});

/*───────────────────────────────────────────────
 ░░  POSTS (GET ALL)
───────────────────────────────────────────────*/

app.get("/posts", async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching posts" });
  }
});

/*───────────────────────────────────────────────
 ░░  START SERVER
───────────────────────────────────────────────*/

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
