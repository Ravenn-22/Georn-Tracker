import Application from "../models/Application.js";

// GET ALL APPLICATIONS FOR LOGGED IN USER
export const getApplications = async (req, res) => {
  try {
   const applications = await Application.find({ user: req.user.id }).sort({ createdAt: -1 });    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//Get single Application
export const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.status(200).json(application);
  } catch (error) {
    // console.log("GET APPLICATION ERROR:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create application
export const createApplication = async (req, res) => {
  try {
    const application = await Application.create({
      ...req.body,
      user: req.user.id,
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update application
export const updateApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete application
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await application.deleteOne();
    res.status(200).json({ message: "Application deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add interview round
export const addInterview = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    application.interviews.push(req.body);
    await application.save();

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update interview round
export const updateInterview = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const interview = application.interviews.id(req.params.interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    Object.assign(interview, req.body);
    await application.save();

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete interview round
export const deleteInterview = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    application.interviews.pull({ _id: req.params.interviewId });
    await application.save();

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get stats
export const getStats = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id });

    const total = applications.length;
    const byStatus = {
      Wishlist: 0,
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    };

    applications.forEach((app) => {
      byStatus[app.status]++;
    });

    const responseRate =
      total > 0
        ? (((byStatus.Interview + byStatus.Offer) / total) * 100).toFixed(1)
        : 0;

    // Applications per week (last 4 weeks)
    const now = new Date();
    const weeksData = [0, 1, 2, 3].map((weeksAgo) => {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (weeksAgo + 1) * 7);
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - weeksAgo * 7);

      return {
        week: `Week ${4 - weeksAgo}`,
        count: applications.filter(
          (app) => app.createdAt >= weekStart && app.createdAt < weekEnd,
        ).length,
      };
    });

    res.status(200).json({
      total,
      byStatus,
      responseRate,
      applicationsPerWeek: weeksData.reverse(),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Add note to timeline
export const addNote = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    application.notesList.push({ content: req.body.content });
    await application.save();

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete note from timeline
export const deleteNote = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    application.notesList.pull({ _id: req.params.noteId });
    await application.save();

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
