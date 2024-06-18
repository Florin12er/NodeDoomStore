const mongoose = require("mongoose");

const Demon = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Game",
  },
  coverImage: {
    type: Buffer,
    required: true,
  },
  coverImageType: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("demon", Demon);
