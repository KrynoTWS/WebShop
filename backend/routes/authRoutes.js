const express = require("express");
const User = require("../models/User");
const { signJwt } = require("../middleware/auth");

const router = express.Router();

/*
  POST /auth/register
*/
router.post("/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    await User.create({
      username,
      password,
      role: "user"
    });

    res.status(201).json({
      message: "Registration successful"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
  POST /auth/login
*/
router.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const token = signJwt(user);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;