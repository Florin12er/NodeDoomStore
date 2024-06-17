const express = require("express");
const router = express.Router();
const multer = require("multer");
const SourcePort = require("../models/sourcePort");

// Set up multer for file uploads
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image file (jpg, jpeg, png)"));
    }
    cb(undefined, true);
  }
});

// Display list of sourcePorts
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.title != null && req.query.title !== "") {
    searchOptions.title = new RegExp(req.query.title, "i");
  }
  try {
    const source = await SourcePort.find(searchOptions);
    res.render("sourcePorts/sourcePorts", {
      source: source,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// Display form for creating a new source
router.get("/new", (req, res) => {
  res.render("sourcePorts/new", { source: new SourcePort() });
});

// Handle new source creation
router.post("/", upload.single('coverImage'), async (req, res) => {
  const source = new SourcePort({
    title: req.body.title,
    description: req.body.description,
    platforms: req.body.platforms,
    requirements: req.body.requirements,
  });

  if (req.file != null) {
    source.coverImage = req.file.buffer;
    source.coverImageType = req.file.mimetype;
  }

  try {
    const newSourcePort = await source.save();
    res.redirect("source");
  } catch {
    res.render("source/new", {
      source: source,
      errorMessage: "Error creating source. Make sure to fill all fields.",
    });
  }
});

module.exports = router;

