const express = require("express");
const router = express.Router();
const multer = require("multer");
const Level = require("../models/level");
const Game = require("../models/game");

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
    const levels = await Level.find(searchOptions).populate('game').exec();
    res.render("levels/level", {
      levels: levels,
      searchOptions: req.query,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});

router.get("/new", async (req, res) => {
  try {
    const games = await Game.find({});
    res.render("levels/new", { level: new Level(), games: games });
  } catch {
    res.redirect("/levels");
  }
});
router.post("/", upload.single('coverImage'), async (req, res) => {
  const level = new Level({
    title: req.body.title,
    description: req.body.description,
    game: req.body.game
  });

  if (req.file != null) {
    level.coverImage = req.file.buffer;
    level.coverImageType = req.file.mimetype;
  }

  try {
    const newLevel = await level.save();
    res.redirect("levels");
  } catch {
    const games = await Game.find({});
    res.render("levels/new", {
      levels: level,
      games: games,
      errorMessage: "Error creating Level. Make sure to fill all fields.",
    });
  }
});
router.get("/:id/edit", async (req, res) => {
  try {
    const level = await Level.findById(req.params.id).populate('game').exec();
    const games = await Game.find({});
    res.render("levels/edit", { level: level, games: games });
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
    level.game = req.body.gameId;

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
      const games = await Game.find({});
      res.render("levels/edit", {
        level: level,
        games: games,
        errorMessage: "Error updating level",
      });
    }
  }
});

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

