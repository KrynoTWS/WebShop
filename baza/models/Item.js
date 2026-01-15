const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: String,
  type: String,
  subtype: String,
  description: String
});

module.exports = mongoose.model("Item", ItemSchema);
