import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import scheduleReminders from "./config/scheduler.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/resumes", resumeRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Job Tracker API running" });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    scheduleReminders();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
