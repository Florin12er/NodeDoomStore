const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
    res.render("sourcePorts/sourcePorts")
})

module.exports = router


