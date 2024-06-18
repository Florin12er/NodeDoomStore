const express = require("express");
const router = express.Router();
const multer = require("multer");
const Game = require("../models/game");
const methodOverride = require('method-override');


// Set up method-override
router.use(methodOverride('_method'));

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

// Display list of games
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.title != null && req.query.title !== "") {
    searchOptions.title = new RegExp(req.query.title, "i");
  }
  try {
    const games = await Game.find(searchOptions);
    res.render("games/game", {
      games: games,
      searchOptions: req.query,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});
// Display form for creating a new game
router.get("/new", (req, res) => {
  res.render("games/new", { game: new Game() });
});

// Handle new game creation
router.post("/", upload.single('coverImage'), async (req, res) => {
  const game = new Game({
    title: req.body.title,
    description: req.body.description,
    platforms: req.body.platforms,
    requirements: req.body.requirements,
  });

  if (req.file != null) {
    game.coverImage = req.file.buffer;
    game.coverImageType = req.file.mimetype;
  }

  try {
    const newGame = await game.save();
    res.redirect("games");
  } catch (error) {
    console.error(error);
    res.render("games/new", {
      game: game,
      errorMessage: "Error creating game. Make sure to fill all fields.",
    });
  }
});

// Display form to edit a game
router.get("/:id/edit", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    res.render("games/edit", { game: game });
  } catch (error) {
    console.error(error);
    res.redirect("/games");
  }
});

// Handle game update
router.put("/:id", upload.single('coverImage'), async (req, res) => {
  let game;
  try {
    game = await Game.findById(req.params.id);
    game.title = req.body.title;
    game.description = req.body.description;
    game.platforms = req.body.platforms;
    game.requirements = req.body.requirements;

    if (req.file != null) {
      game.coverImage = req.file.buffer;
      game.coverImageType = req.file.mimetype;
    }

    await game.save();
    res.redirect(`/games`);
  } catch (error) {
    console.error(error);
    if (game == null) {
      res.redirect("/");
    } else {
      res.render("games/edit", {
        game: game,
        errorMessage: "Error updating game",
      });
    }
  }
});

// Handle game deletion
router.delete("/:id", async (req, res) => {
  let game;
  try {
    game = await Game.findById(req.params.id);
    await game.deleteOne();
    res.redirect("/games");
  } catch (error) {
    console.error(error);
    if (game == null) {
      res.redirect("/");
    } else {
      res.redirect(`/games/${game.id}`);
    }
  }
});

module.exports = router;

