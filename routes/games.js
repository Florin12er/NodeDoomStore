const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
    res.render("games/game")
})

module.exports = router

