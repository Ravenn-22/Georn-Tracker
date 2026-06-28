import express from "express";
import {
  getResumes,
  createResume,
  updateResume,
  deleteResume,
} from "../controllers/resumeController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getResumes).post(upload.single("file"), createResume);
router.route("/:id").put(updateResume).delete(deleteResume);

export default router;