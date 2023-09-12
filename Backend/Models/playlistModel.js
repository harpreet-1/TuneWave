const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  desc: { type: String },
  songs: { type: Array, default: [] },
  img: { type: String },
});

const PlaylistModel = mongoose.model("playlist", playlistSchema);

module.exports = PlaylistModel;
