// Load dotenv package
import dotenv from "dotenv";

// Read environment variables
dotenv.config();

// Server port
export const PORT = process.env.PORT;

// Database username
export const DB_USER = process.env.DB_USER;

// Database password
export const DB_PASSWORD = process.env.DB_PASSWORD;

// Database name
export const DB_NAME = process.env.DB_NAME;

// MongoDB cluster
export const DB_CLUSTER = process.env.DB_CLUSTER;

// Client URL
export const CLIENT_URL = process.env.CLIENT_URL;

// Application name
export const APPNAME = process.env.APPNAME;
