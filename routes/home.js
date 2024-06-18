const express = require("express");
const router = express.Router();
const Game = require("../models/game");
const Level = require("../models/level");
const Demon = require("../models/demon");
const SourcePort = require("../models/sourcePort");
const Mods = require("../models/mod");

router.get("/", async (req, res) => {
    const { title } = req.query;

    try {
        const searchOptions = title ? { title: new RegExp(title, "i") } : {};

        const [games, levels, demons, source, mods] = await Promise.all([
            Game.find(searchOptions),
            Level.find(searchOptions),
            Demon.find(searchOptions),
            SourcePort.find(searchOptions),
            Mods.find(searchOptions),
        ]);

        res.render("index", {
            games,
            levels,
            demons,
            source,
            mods,
            searchOptions: req.query,
        });
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
});
module.exports = router;
