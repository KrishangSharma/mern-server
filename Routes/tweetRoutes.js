const router = require("express").Router();
const auth = require("../Middlewares/authMiddleware");

const { createTweet, getTweets } = require("../Controllers/tweetControllers");

// @desc    GET user details
// @route   api/user/me
// @access  Private
router.get("/", auth, getTweets);

// @desc    Registers a user
// @route   api/user/register
// @access  Public
router.post("/create", auth, createTweet);

module.exports = router;
