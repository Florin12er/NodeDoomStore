const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
    res.render("demons/demon")
})

module.exports = router

