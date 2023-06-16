const router = require("express").Router();
const upload = require("../Middlewares/fileHandling");
const auth = require("../Middlewares/authMiddleware");

const {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUser,
} = require("../Controllers/userControllers");

// @desc    GET user details
// @route   api/user/me
// @access  Private
router.get("/:id", auth, getUser);

// @desc    Registers a user
// @route   api/user/register
// @access  Public
router.post("/register", upload.single("avatar"), registerUser);

// @desc    User login
// @route   api/user/login
// @access  Public
router.post("/login", loginUser);

// @desc    User Update
// @route   api/user/update/:id
// @access  Protected
router.put("/update/:id", auth, upload.single("avatar"), updateUser);

// @desc    Delete User
// @route   api/user/delete/:id
// @access  Protected
router.delete("/delete/:id", auth, deleteUser);

module.exports = router;
