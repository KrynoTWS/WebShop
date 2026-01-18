const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const { verifyJwt } = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");

/*
  GET /items
  Vrati sve proizvode s proizvođačem
*/
router.get("/items", async (req, res) => {
  try {
    const items = await Item.find()
      .populate("manufacturer")
      .sort({ name: 1 });

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
  GET /items/:id
  Detalji jednog proizvoda
*/
router.get("/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("manufacturer");

    if (!item) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
  POST /items
*/
router.post("/items", verifyJwt, isAdmin, async (req, res) => {
  try {
    const item = new Item(req.body);
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/*
  PUT /items/:id
*/
router.put("/items/:id", verifyJwt, isAdmin, async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/*
  DELETE /items/:id
*/
router.delete("/items/:id", verifyJwt, isAdmin, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;