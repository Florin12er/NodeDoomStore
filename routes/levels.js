const express = require("express");
const router = express.Router();
const multer = require("multer");
const Level = require("../models/level");

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image file (jpg, jpeg, png)"));
    }
    cb(undefined, true);
  },
});
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.title != null && req.query.title !== "") {
    searchOptions.title = new RegExp(req.query.title, "i");
  }
  try {
    const levels = await Level.find(searchOptions);
    res.render("levels/level", {
      levels: levels,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

router.get("/new", (req, res) => {
  res.render("levels/new", { levels: new Level() });
});

router.post("/", upload.single('coverImage'), async (req, res) => {
  const levels = new Level({
    title: req.body.title,
    description: req.body.description,
  });

  if (req.file != null) {
    levels.coverImage = req.file.buffer;
    levels.coverImageType = req.file.mimetype;
  }

  try {
    const newLevel = await levels.save();
    res.redirect("levels");
  } catch {
    res.render("levels/new", {
      levels: levels,
      errorMessage: "Error creating Level. Make sure to fill all fields.",
    });
  }
});


module.exports = router;
