const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
  token: { type: String, require: true },
});

const BlacklistModel = mongoose.model("blacklist", blacklistSchema);

module.exports = BlacklistModel;
