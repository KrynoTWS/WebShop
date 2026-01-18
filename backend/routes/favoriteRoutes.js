const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Item = require("../models/Item");
const { verifyJwt } = require("../middleware/auth");

/*
  GET /favorites
  Vrati listu favorita trenutno prijavljenog korisnika
*/
router.get("/favorites", verifyJwt, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/*
  POST /favorites/:itemId
  Dodaj ili ukloni item iz favorita korisnika
*/
router.post("/favorites/:itemId", verifyJwt, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const itemId = req.params.itemId;
    const index = user.favorites.findIndex(fav => fav.toString() === itemId);

    if (index === -1) {
      // dodaj u favorite
      user.favorites.push(itemId);
    } else {
      // ukloni iz favorita
      user.favorites.splice(index, 1);
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate("favorites");
    res.json(updatedUser.favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;