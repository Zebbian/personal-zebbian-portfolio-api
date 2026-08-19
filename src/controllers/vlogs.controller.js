import Vlog from "../models/vlog.model.js";

export const getVlogs = async (req, res, next) => {
  try {
    const { tag, category } = req.query;
    const query = {};
    if (tag) query.tags = tag;
    if (category) query.category = category;

    const vlogs = await Vlog.find(query).sort({ createdAt: -1 });
    res.json(vlogs);
  } catch (err) {
    next(err);
  }
};

export const createVlog = async (req, res, next) => {
  try {
    const vlog = await Vlog.create(req.body);
    res.status(201).json(vlog);
  } catch (err) {
    next(err);
  }
};

export const updateVlog = async (req, res, next) => {
  try {
    const vlog = await Vlog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!vlog) return res.status(404).json({ message: "Vlog not found" });
    res.json(vlog);
  } catch (err) {
    next(err);
  }
};

export const deleteVlog = async (req, res, next) => {
  try {
    const vlog = await Vlog.findByIdAndDelete(req.params.id);
    if (!vlog) return res.status(404).json({ message: "Vlog not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
