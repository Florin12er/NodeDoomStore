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

module.exports = router;
