const cors = require("cors");
const env = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./Routes/userRoutes");
const tweetRoutes = require("./Routes/tweetRoutes");

// Enable env variables
env.config();

// Initialize the app
const app = express();

app.use(cors());
app.use(express.json());

// App Routes
app.use("/api/user", userRoutes);
app.use("/api/tweets", tweetRoutes);

const port = 5000 || process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on  Port: ${port}`);
});

// Connect to DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((error) => console.log(error.message));
