import express from "express";
import {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  addInterview,
  updateInterview,
  deleteInterview,
  getStats,
  addNote,
  deleteNote,
} from "../controllers/applicationController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/stats", getStats);
router.route("/").get(getApplications).post(createApplication);
router
  .route("/:id")
  .get(getApplication)
  .put(updateApplication)
  .delete(deleteApplication);

router.route("/:id/interviews").post(addInterview);
router
  .route("/:id/interviews/:interviewId")
  .put(updateInterview)
  .delete(deleteInterview);

router.route("/:id/notes").post(addNote);
router.route("/:id/notes/:noteId").delete(deleteNote);

export default router;
