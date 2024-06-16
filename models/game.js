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
  },
  requirements: {
    type: String,
  },
  coverImage: {
    type: Buffer,
  },
  coverImageType: {
    type: String,
  },
});
GameSchema.virtual('coverImagePath').get(function() {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
})


module.exports = mongoose.model("Game", GameSchema);
