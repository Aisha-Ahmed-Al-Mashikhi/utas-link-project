import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import UserModel from "./Models/UserModel.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
