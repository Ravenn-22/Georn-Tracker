import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  round: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  },
  interviewName: {
    type: String,
  },
  outcome: {
    type: String,
    enum: ["Pending", "Passed", "Failed"],
    default: "Pending",
  },
  notes: {
    type: String,
  },
});

const applictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    salaryRange: {
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
    },
    jobUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Wishlist", "Applied", "Interview", "Offer", "Rejected"],
      default: "Wishlist",
    },

    notes: {
      type: String,
    },
    notesList: [
      {
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    jobDescription: {
      type: String,
    },
    followUpDate: {
      type: Date,
    },
    deadline: {
      type: Date,
    },
    interviews: [interviewSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Application", applictionSchema);
