import Resume from "../models/Resume.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";


const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "job-tracker/resumes", resource_type: "raw" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await uploadToCloudinary(req.file.buffer);

    const resume = await Resume.create({
      user: req.user.id,
      name: req.body.name,
      url: result.secure_url,
      publicId: result.public_id,
      size: result.bytes,
      format: result.format,
    });

    res.status(201).json(resume);
  } catch (error) {
    console.error("Resume upload error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updated = await Resume.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true },
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    if (resume.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    await cloudinary.uploader.destroy(resume.publicId, {
      resource_type: "raw",
    });
    await resume.deleteOne();

    res.status(200).json({ message: "Resume deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
