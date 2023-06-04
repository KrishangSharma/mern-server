const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = Tweet = mongoose.model("Tweet", tweetSchema);
