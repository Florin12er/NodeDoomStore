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
// Display form to edit a source
router.get("/:id/edit", async (req, res) => {
  try {
    const source = await SourcePort.findById(req.params.id);
    res.render("source/edit", { source: source });
  } catch (error) {
    console.error(error);
    res.redirect("/source");
  }
});

// Handle source update
router.put("/:id", upload.single('coverImage'), async (req, res) => {
  let source;
  try {
    source = await SourcePort.findById(req.params.id);
    source.title = req.body.title;
    source.description = req.body.description;
    source.platforms = req.body.platforms;
    source.requirements = req.body.requirements;

    if (req.file != null) {
      source.coverImage = req.file.buffer;
      source.coverImageType = req.file.mimetype;
    }

    await source.save();
    res.redirect(`/source`);
  } catch (error) {
    console.error(error);
    if (source == null) {
      res.redirect("/");
    } else {
      res.render("sourcePorts/edit", {
        source: source,
        errorMessage: "Error updating source",
      });
    }
  }
});

// Handle source deletion
router.delete("/:id", async (req, res) => {
  let source;
  try {
    source = await SourcePort.findById(req.params.id);
    await source.deleteOne();
    res.redirect("/source");
  } catch (error) {
    console.error(error);
    if (source == null) {
      res.redirect("/");
    } else {
      res.redirect(`/source/${source.id}`);
    }
  }
});

module.exports = router;

