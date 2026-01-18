const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  caffeinePercent: {
    type: Number,
    required: true
  },

  color: {
    type: String
  },

  type: {
    type: String,
    required: true
  },

  subtype: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  manufacturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manufacturer",
    required: true
  }
});

module.exports = mongoose.model("Item", ItemSchema);
