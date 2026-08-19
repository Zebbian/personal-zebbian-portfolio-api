import fs from "fs/promises";
import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res, next) => {
  if (!req.file) return res.status(400).json({ message: "No file provided" });

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "portfolio",
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    next(err);
  } finally {
    await fs.unlink(req.file.path).catch(() => {});
  }
};
