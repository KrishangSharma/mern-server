const Tweet = require("../Models/tweetModel");

const createTweet = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res
        .status(400)
        .json({ message: "Tweet cannot be empty", status: "Failed" });
    }

    // Create the user
    const newTweet = new Tweet({
      content,
      user: req.user.id,
    });

    const savedTweet = await newTweet.save();

    return res.status(201).json({
      message: "Tweet posted!",
      status: "Completed",
      tweet: savedTweet,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

const getTweets = async (req, res) => {
  try {
    const tweets = await Tweet.find().populate("user", "userName name");

    if (tweets.length == 0) {
      return res
        .status(200)
        .json({ message: "No tweets found! Create some tweets!" });
    }

    return res.status(200).json({ status: "Completed", tweets: tweets });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Server Error!");
  }
};

module.exports = {
  createTweet,
  getTweets,
};
