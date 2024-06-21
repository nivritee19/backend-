import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import cors from "cors";

// Load environment variables from .env file
dotenv.config({ path: ".env" });

// Connect to the database
databaseConnection();

const app = express();

// Middlewares

// Parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (API clients)
app.use(express.json());

// Parse cookies attached to the client request object
app.use(cookieParser());

// Set up CORS (Cross-Origin Resource Sharing) options
const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from this origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.) to be sent
};

// Use CORS middleware with the specified options
app.use(cors(corsOptions));

// API routes

// Route for user-related operations
app.use("/api/v1/user", userRoute);

// Route for tweet-related operations
app.use("/api/v1/tweet", tweetRoute);

// Start the server and listen on the specified port
app.listen(process.env.PORT, () => {
  console.log(`Server listening at port ${process.env.PORT}`);
});
