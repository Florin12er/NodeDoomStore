
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Demon = require("../models/demon");

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
    const demons = await Demon.find(searchOptions);
    res.render("demons/demon", {
      demons: demons,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

router.get("/new", (req, res) => {
  res.render("demons/new", { demons: new Demon() });
});

router.post("/", upload.single('coverImage'), async (req, res) => {
  const demons = new Demon({
    title: req.body.title,
    description: req.body.description,
  });

  if (req.file != null) {
    demons.coverImage = req.file.buffer;
    demons.coverImageType = req.file.mimetype;
  }

  try {
    const newDemon = await demons.save();
    res.redirect("demons");
  } catch {
    res.render("demons/new", {
      demons: demons,
      errorMessage: "Error creating Demon. Make sure to fill all fields.",
    });
  }
});


module.exports = router

