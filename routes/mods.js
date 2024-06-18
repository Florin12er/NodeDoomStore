const express = require("express");
const router = express.Router();
const multer = require("multer");
const Mods = require("../models/mod");

// Set up multer for file uploads
const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please upload an image file (jpg, jpeg, png)"));
        }
        cb(undefined, true);
    },
});

// Display list of mods
router.get("/", async (req, res) => {
    let searchOptions = {};
    if (req.query.title != null && req.query.title !== "") {
        searchOptions.title = new RegExp(req.query.title, "i");
    }
    try {
        const mods = await Mods.find(searchOptions);
        res.render("mods/mod", {
            mods: mods,
            searchOptions: req.query,
        });
    } catch {
        res.redirect("/");
    }
});

// Display form for creating a new mods
router.get("/new", (req, res) => {
    res.render("mods/new", { mods: new Mods() });
});

// Handle new mods creation
router.post("/", upload.single("coverImage"), async (req, res) => {
    const mods = new Mods({
        title: req.body.title,
        description: req.body.description,
        requirements: req.body.requirements,
        compatibility: req.body.compatibility,
    });

    if (req.file != null) {
        mods.coverImage = req.file.buffer;
        mods.coverImageType = req.file.mimetype;
    }

    try {
        const newMods = await mods.save();
        res.redirect("mods");
    } catch {
        res.render("mods/new", {
            mods: mods,
            errorMessage: "Error creating mods. Make sure to fill all fields.",
        });
    }
});
// Display form to edit a mod
router.get("/:id/edit", async (req, res) => {
  try {
    const mod = await Mods.findById(req.params.id);
    res.render("mods/edit", { mod: mod });
  } catch (error) {
    console.error(error);
    res.redirect("/mods");
  }
});

// Handle mod update
router.put("/:id", upload.single('coverImage'), async (req, res) => {
  let mod;
  try {
    mod = await Mods.findById(req.params.id);
    mod.title = req.body.title;
    mod.description = req.body.description;
    mod.platforms = req.body.platforms;
    mod.requirements = req.body.requirements;

    if (req.file != null) {
      mod.coverImage = req.file.buffer;
      mod.coverImageType = req.file.mimetype;
    }

    await mod.save();
    res.redirect(`/mods`);
  } catch (error) {
    console.error(error);
    if (mod == null) {
      res.redirect("/");
    } else {
      res.render("mods/edit", {
        mod: mod,
        errorMessage: "Error updating mod",
      });
    }
  }
});

// Handle mod deletion
router.delete("/:id", async (req, res) => {
  let mod;
  try {
    mod = await Mods.findById(req.params.id);
    await mod.deleteOne();
    res.redirect("/mods");
  } catch (error) {
    console.error(error);
    if (mod == null) {
      res.redirect("/");
    } else {
      res.redirect(`/mods/${mod.id}`);
    }
  }
});


module.exports = router;
