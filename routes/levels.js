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
// Display form to edit a level
router.get("/:id/edit", async (req, res) => {
  try {
    const level = await Level.findById(req.params.id);
    res.render("levels/edit", { level: level });
  } catch (error) {
    console.error(error);
    res.redirect("/levels");
  }
});

// Handle level update
router.put("/:id", upload.single('coverImage'), async (req, res) => {
  let level;
  try {
    level = await Level.findById(req.params.id);
    level.title = req.body.title;
    level.description = req.body.description;
    level.platforms = req.body.platforms;
    level.requirements = req.body.requirements;

    if (req.file != null) {
      level.coverImage = req.file.buffer;
      level.coverImageType = req.file.mimetype;
    }

    await level.save();
    res.redirect(`/levels`);
  } catch (error) {
    console.error(error);
    if (level == null) {
      res.redirect("/");
    } else {
      res.render("levels/edit", {
        level: level,
        errorMessage: "Error updating level",
      });
    }
  }
});

// Handle level deletion
router.delete("/:id", async (req, res) => {
  let level;
  try {
    level = await Level.findById(req.params.id);
    await level.deleteOne();
    res.redirect("/levels");
  } catch (error) {
    console.error(error);
    if (level == null) {
      res.redirect("/");
    } else {
      res.redirect(`/levels/${level.id}`);
    }
  }
});



module.exports = router;
