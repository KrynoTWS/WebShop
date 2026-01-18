const express = require("express");
const router = express.Router();
const Manufacturer = require("../models/Manufacturer");
const Item = require("../models/Item");
const { verifyJwt } = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");

/*
  GET /manufacturers
  Svi proizvođači
*/
router.get("/manufacturers", async (req, res) => {
  try {
    const manufacturers = await Manufacturer.find().sort({ name: 1 });
    res.json(manufacturers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
  GET /manufacturers/:id
  Proizvođač + njegovi proizvodi
*/
router.get("/manufacturers/:id", async (req, res) => {
  try {
    const manufacturer = await Manufacturer.findById(req.params.id);

    if (!manufacturer) {
      return res.status(404).json({ message: "Manufacterer not found" });
    }

    const items = await Item.find({ manufacturer: manufacturer._id });

    res.json({
      manufacturer,
      items
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
  POST /manufacturers
*/
router.post("/manufacturers", verifyJwt, isAdmin, async (req, res) => {
  try {
    const manufacturer = new Manufacturer(req.body);
    const saved = await manufacturer.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/*
  PUT /manufacturers/:id
*/
router.put("/manufacturers/:id", verifyJwt, isAdmin, async (req, res) => {
  try {
    const updated = await Manufacturer.findByIdAndUpdate(
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
  DELETE /manufacturers/:id
  Ne smije se obrisati ako postoje artikli
*/
router.delete("/manufacturers/:id", verifyJwt, isAdmin, async (req, res) => {
  try {
    const count = await Item.countDocuments({
      manufacturer: req.params.id
    });

    if (count > 0) {
      return res.status(400).json({
        message: "Cannot delete manufacturer with existing items"
      });
    }

    await Manufacturer.findByIdAndDelete(req.params.id);
    res.json({ message: "Proizvođač obrisan" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;