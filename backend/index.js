import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import geminiResponse from "./gemini.js"

const app = express()

// ✅ Allow both local and deployed frontends
const allowedOrigins = [
  "http://localhost:5173",
  "https://my-assistant-frontend-iirr.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

const port = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

// Optional: a small test route to confirm working
app.get("/", (req, res) => {
  res.send("✅ Backend is running fine!");
});

app.listen(port, () => {
  connectDb()
  console.log(`🚀 Server started on port ${port}`)
});

