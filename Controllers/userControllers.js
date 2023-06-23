const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const registerUser = async (req, res) => {
  try {
    const { name, userName, email, password } = req.body;
    const avatar = req.file;

    let profilePicturePath;
    if (avatar) {
      profilePicturePath = req.file.path;
    }

    const ifExists = await User.findOne({ email });

    if (ifExists) {
      return res
        .status(400)
        .json({ message: "Email already registered!", status: "Failed" });
    }

    if (!name || !userName || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required!", status: "Failed" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Construct URL for profile picture
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const avatarUrl = `${baseUrl}/${profilePicturePath.replace(/\\/g, "/")}`;

    // Create the user
    const newUser = new User({
      name,
      userName,
      avatar: avatarUrl,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      message: "User Registered",
      status: "Completed",
      id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      avatar: avatarUrl,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are requried", status: "Failed" });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found!!" });
    }

    // Compare passwords and login
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid login credentials", status: "Failed" });
    }

    // Assign JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, userName, email } = req.body;
    const avatar = req.file;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    if (name) {
      user.name = name;
    }

    if (userName) {
      user.userName = userName;
    }

    if (email) {
      user.email = email;
    }

    if (avatar) {
      const profilePicturePath = avatar.path;
      user.avatar = profilePicturePath;
    }

    // Save the updated user
    const savedUser = await user.save();

    // Return the updated user details
    return res.status(200).json({
      message: "User profile updated",
      status: "Completed",
      id: savedUser._id,
      name: savedUser.name,
      userName: savedUser.userName,
      email: savedUser.email,
      avatar: savedUser.avatar,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    const modifiedUser = {
      ...user._doc,
      avatar: user.avatar
        ? `${req.protocol}://${req.get("host")}/${user.avatar.replace(
            "\\",
            "/"
          )}`
        : null,
    };

    return res.status(200).json({ status: "Completed", user: modifiedUser });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Server Error!");
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedUser = await user.deleteOne();

    return res.status(200).json({ status: "Completed", user: deletedUser });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Server Error");
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUser,
};
