require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts")
const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views")
app.set("layout", "layouts/layout");
app.use(expressLayouts)
app.use(express.static("public"))

const Home = require("./routes/home")
const Games = require("./routes/games")
const Demons = require("./routes/demons")
const Levels = require("./routes/levels")
const Mods = require("./routes/mods")

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use("/", Home);
app.use("/games", Games)
app.use("/demons", Demons)
app.use("/levels", Levels)
app.use("/mods", Mods)

app.use((req, res, next) => {
    res.status(404).render("404", { layout: false });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running...");
});
