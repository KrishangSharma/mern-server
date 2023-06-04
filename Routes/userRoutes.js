const router = require("express").Router();
const auth = require("../Middlewares/authMiddleware");

const {
  registerUser,
  loginUser,
  getUser,
} = require("../Controllers/userControllers");

// @desc    GET user details
// @route   api/user/me
// @access  Private
router.get("/:id", auth, getUser);

// @desc    Registers a user
// @route   api/user/register
// @access  Public
router.post("/register", registerUser);

// @desc    User login
// @route   api/user/login
// @access  Public
router.post("/login", loginUser);

module.exports = router;
