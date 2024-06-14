const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
    res.render("mods/mod")
})

module.exports = router



