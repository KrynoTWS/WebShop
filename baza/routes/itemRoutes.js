const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

//vrati tipove i podtipove za dropdown
router.get("/products", async (req, res) => {
  try {
    const items = await Item.find();

    const tipovi = [...new Set(items.map(i => i.type))];
    const podtipovi = {};
    const itemsData = {};

    items.forEach(item => {
      if (!podtipovi[item.type]) podtipovi[item.type] = [];
      if (!podtipovi[item.type].includes(item.subtype)) podtipovi[item.type].push(item.subtype);

      if (!itemsData[item.type]) itemsData[item.type] = {};
      if (!itemsData[item.type][item.subtype]) itemsData[item.type][item.subtype] = [];
      itemsData[item.type][item.subtype].push(item);
    });

    res.json({ tipovi, podtipovi, itemsData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//vrati za id 
router.get("/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
