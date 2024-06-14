const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  platforms: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model('Game', GameSchema)
