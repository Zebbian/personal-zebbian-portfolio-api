import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "portfolio",
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    next(err);
  }
};
