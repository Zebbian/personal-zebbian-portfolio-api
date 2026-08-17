// In vlogs.controller.js
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

router.get("/", getVlogs);
router.post("/", requireAuth, createVlog);
router.put("/:id", requireAuth, updateVlog);
router.delete("/:id", requireAuth, deleteVlog);
