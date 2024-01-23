const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
  authToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
}, {
  versionKey: false
});

const Blacklist = mongoose.model("blacklist", blacklistSchema);

module.exports = Blacklist