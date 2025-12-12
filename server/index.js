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
  .connect(connectString)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

// ------------------- FILE UPLOAD -------------------
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
  } catch {
    res.status(500).json({ error: "Error registering user" });
  }
});
/*───────────────────────────────────────────────
 ░░ UPDATE STUDENT PROFILE
───────────────────────────────────────────────*/
app.put("/updateStudent/:email", async (req, res) => {
  try {
    const updated = await UserModel.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Student not found" });

    res.send(updated);
  } catch {
    res.status(500).json({ error: "Error updating student" });
  }
});

/*───────────────────────────────────────────────
 ░░ UPDATE COMPANY PROFILE
───────────────────────────────────────────────*/
app.put("/updateCompany/:email", async (req, res) => {
  try {
    const updated = await CompanyModel.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ error: "Company not found" });

    res.send(updated);
  } catch (err) {
    res.status(500).json({ error: "Error updating profile" });
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
  } catch {
    res.status(500).json({ error: "Login error" });
  }
});

/*───────────────────────────────────────────────
 ░░ GET PROFILES
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

    if (user.cvLink) {
      const filePath = path.join(process.cwd(), user.cvLink);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await UserModel.findOneAndUpdate({ email }, { cvLink: null });

    res.send({ msg: "CV deleted successfully" });
  } catch {
    res.status(500).json({ error: "Error deleting CV" });
  }
});

/*───────────────────────────────────────────────
  ░░ UPLOAD COMPANY LICENSE
───────────────────────────────────────────────*/
app.post("/uploadLicense", upload.single("license"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const email = req.body.email;
    const filePath = `/uploads/${req.file.filename}`;

    await CompanyModel.findOneAndUpdate(
      { email },
      { businessLicense: filePath }
    );

    res.send({ businessLicense: filePath });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "License upload failed" });
  }
});
/*───────────────────────────────────────────────
  ░░ DELETE COMPANY LICENSE
───────────────────────────────────────────────*/
app.put("/deleteLicense", async (req, res) => {
  try {
    const { email } = req.body;

    const company = await CompanyModel.findOne({ email });
    if (!company) return res.status(404).json({ error: "Company not found" });

    if (company.businessLicense) {
      const filePath = path.join(process.cwd(), company.businessLicense);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await CompanyModel.findOneAndUpdate(
      { email },
      { businessLicense: null }
    );

    res.send({ msg: "License deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting license" });
  }
});


/*───────────────────────────────────────────────
 ░░ ADD JOB  (NEW + LOCATION)
───────────────────────────────────────────────*/
app.post("/jobs", async (req, res) => {
  try {
    const job = new JobModel({
      jobTitle: req.body.jobTitle,
      sector: req.body.sector,
      category: req.body.category,
      description: req.body.description,
      skills: req.body.skills,
      rate: req.body.rate,
      rateType: req.body.rateType,
      payout: req.body.payout,
      postedBy: req.body.postedBy,
      postedAt: new Date(),
      location: req.body.location || "Not specified",
    });

    await job.save();
    res.send(job);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error saving job" });
  }
});

/*───────────────────────────────────────────────
 ░░ FETCH JOBS
───────────────────────────────────────────────*/
app.get("/jobs", async (req, res) => {
  const jobs = await JobModel.find().sort({ postedAt: -1 });
  res.send(jobs);
});

/*───────────────────────────────────────────────
 ░░ DELETE JOB  ✔ Added
───────────────────────────────────────────────*/
app.delete("/jobs/:id", async (req, res) => {
  try {
    const deleted = await JobModel.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.send({ msg: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting job" });
  }
});

/*───────────────────────────────────────────────
 ░░ COMPANY JOBS
───────────────────────────────────────────────*/
app.get("/jobs/company/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);

    const jobs = await JobModel.find({ postedBy: email }).sort({
      postedAt: -1,
    });

    res.send(jobs);
  } catch {
    res.status(500).json({ error: "Failed loading company jobs" });
  }
});
/*───────────────────────────────────────────────
 ░░ UPDATE JOB
───────────────────────────────────────────────*/
app.put("/jobs/:id", async (req, res) => {
  try {
    const updated = await JobModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.send(updated);
  } catch (err) {
    res.status(500).json({ error: "Error updating job" });
  }
});


/*───────────────────────────────────────────────
 ░░ APPLY TO JOB  (UPDATED → Saves real company name)
───────────────────────────────────────────────*/
app.post("/apply", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.applicantEmail });
    if (!user) return res.status(404).json({ error: "Student not found" });

    const job = await JobModel.findById(req.body.jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    // ✅ NEW — check if already applied
    const alreadyApplied = await ApplicationModel.findOne({
      jobId: job._id,
      applicantEmail: user.email,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        error: "You already applied for this job",
      });
    }

    const company = await CompanyModel.findOne({ email: job.postedBy });

    const newApp = new ApplicationModel({
      ...req.body,
      jobId: job._id,
      applicantName: user.name,
      applicantEmail: user.email,
      organization: company?.companyName || "Unknown Company",
      companyEmail: job.postedBy,
      status: "Pending",
    });

    await newApp.save();
    res.send(newApp);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Apply failed" });
  }
});

/*───────────────────────────────────────────────
 ░░ STUDENT APPLICATIONS
───────────────────────────────────────────────*/
/*───────────────────────────────────────────────
 ░░ STUDENT APPLICATIONS  (With jobDeleted flag)
───────────────────────────────────────────────*/
app.get("/applications/:email", async (req, res) => {
  try {
    const apps = await ApplicationModel.find({
      applicantEmail: req.params.email,
    }).sort({ appliedAt: -1 });

    // 🔥 إضافة check إن الوظيفة محذوفة
    const finalApps = await Promise.all(
      apps.map(async (app) => {
        const jobExists = await JobModel.findById(app.jobId);
        return {
          ...app._doc,
          jobDeleted: !jobExists, // 🔥 هذا هو كل المطلوب
        };
      })
    );

    res.send(finalApps);
  } catch {
    res.status(500).json({ error: "Failed loading applications" });
  }
});

/*───────────────────────────────────────────────
 ░░ DELETE APPLICATION
───────────────────────────────────────────────*/
app.delete("/applications/:applicationId", async (req, res) => {
  try {
    await ApplicationModel.findByIdAndDelete(req.params.applicationId);
    res.send({ msg: "Application canceled" });
  } catch {
    res.status(500).json({ error: "Error canceling application" });
  }
});

/*───────────────────────────────────────────────
 ░░ APPLICANTS FOR A JOB
───────────────────────────────────────────────*/
app.get("/applications/job/:jobId", async (req, res) => {
  try {
    const jobId = new mongoose.Types.ObjectId(req.params.jobId);

    const applicants = await ApplicationModel.find({
      jobId: jobId,
    }).sort({ appliedAt: -1 });

    res.send(applicants);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed loading applicants" });
  }
});


/*───────────────────────────────────────────────
 ░░ ALL APPLICATIONS FOR COMPANY
───────────────────────────────────────────────*/
app.get("/applications/company/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);

    const jobs = await JobModel.find({ postedBy: email });
    const jobIds = jobs.map((j) => j._id);

    const applications = await ApplicationModel.find({
      jobId: { $in: jobIds },
    }).sort({ appliedAt: -1 });

    res.send(applications);
  } catch {
    res.status(500).json({ error: "Failed loading company applications" });
  }
});

/*───────────────────────────────────────────────
 ░░ UPDATE APPLICATION STATUS
───────────────────────────────────────────────*/
app.put("/applications/update/:applicationId", async (req, res) => {
  try {
    const updated = await ApplicationModel.findByIdAndUpdate(
      req.params.applicationId,
      { status: req.body.status },
      { new: true }
    );

    res.send(updated);
  } catch {
    res.status(500).json({ error: "Error updating status" });
  }
});

/*───────────────────────────────────────────────
 ░░ CHAT SYSTEM
───────────────────────────────────────────────*/
app.get("/chat/:applicationId", async (req, res) => {
  try {
    const msgs = await ChatModel.find({
      applicationId: req.params.applicationId,
    }).sort({ "message.sentAt": 1 });

    res.send(msgs);
  } catch {
    res.status(500).json({ error: "Failed to load messages" });
  }
});

app.post("/chat", async (req, res) => {
  try {
    const newMsg = new ChatModel(req.body);
    await newMsg.save();
    res.send(newMsg);
  } catch {
    res.status(500).json({ error: "Failed to send message" });
  }
});

/*───────────────────────────────────────────────
 ░░ POSTS SYSTEM
───────────────────────────────────────────────*/
app.post("/addPost", async (req, res) => {
  try {
    let authorName = "Anonymous";

    if (req.body.email) {
      // check if student
      const user = await UserModel.findOne({ email: req.body.email });
      if (user) authorName = user.name;

      // check if company
      const company = await CompanyModel.findOne({ email: req.body.email });
      if (company) authorName = company.companyName;
    }

    const post = await PostModel.create({
      ...req.body,
      authorName, // اسم المستخدم أو الشركة
    });

    res.send(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error adding post" });
  }
});

app.get("/posts", async (req, res) => {
  const posts = await PostModel.find().sort({ createdAt: -1 });
  res.send(posts);
});

/* LIKE */
app.put("/likePost/:postId", async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId);
    const userId = req.body.userId;

    if (!post) return res.status(404).json({ msg: "Post not found" });

    const hasLiked = post.likes.users.includes(userId);
    const hasDisliked = post.dislikes.users.includes(userId);

    // إذا كان عامل ديسلايك → نحذفه أولاً
    if (hasDisliked) {
      post.dislikes.count -= 1;
      post.dislikes.users = post.dislikes.users.filter((u) => u !== userId);
    }

    // Toggle like
    if (hasLiked) {
      post.likes.count -= 1;
      post.likes.users = post.likes.users.filter((u) => u !== userId);
    } else {
      post.likes.count += 1;
      post.likes.users.push(userId);
    }

    await post.save();
    res.json({ post, msg: "Like updated" });
  } catch {
    res.status(500).json({ error: "Error liking post" });
  }
});

/* DISLIKE */
app.put("/dislikePost/:postId", async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId);
    const userId = req.body.userId;

    if (!post) return res.status(404).json({ msg: "Post not found" });

    const hasLiked = post.likes.users.includes(userId);
    const hasDisliked = post.dislikes.users.includes(userId);

    // إذا كان عامل لايك → نحذفه أولاً
    if (hasLiked) {
      post.likes.count -= 1;
      post.likes.users = post.likes.users.filter((u) => u !== userId);
    }

    // Toggle dislike
    if (hasDisliked) {
      post.dislikes.count -= 1;
      post.dislikes.users = post.dislikes.users.filter((u) => u !== userId);
    } else {
      post.dislikes.count += 1;
      post.dislikes.users.push(userId);
    }

    await post.save();
    res.json({ post, msg: "Dislike updated" });
  } catch {
    res.status(500).json({ error: "Error disliking post" });
  }
});

/* USER POSTS */
app.get("/posts/user/:email", async (req, res) => {
  try {
    const posts = await PostModel.find({
      email: req.params.email,
    }).sort({ createdAt: -1 });
    res.send(posts);
  } catch {
    res.status(500).json({ error: "Error loading user posts" });
  }
});

/* UPDATE POST */
app.put("/updatePost/:id", async (req, res) => {
  try {
    const updated = await PostModel.findByIdAndUpdate(
      req.params.id,
      { postMsg: req.body.postMsg },
      { new: true }
    );

    res.send(updated);
  } catch {
    res.status(500).json({ error: "Error updating post" });
  }
});

/* DELETE POST */
app.delete("/deletePost/:id", async (req, res) => {
  try {
    await PostModel.findByIdAndDelete(req.params.id);
    res.send({ msg: "Post deleted" });
  } catch {
    res.status(500).json({ error: "Error deleting post" });
  }
});

/*───────────────────────────────────────────────
 ░░ START SERVER
───────────────────────────────────────────────*/
const port = ENV.PORT || 3001;
app.listen(port, () => {
  console.log(`You are connected at port: ${port}`);
});
