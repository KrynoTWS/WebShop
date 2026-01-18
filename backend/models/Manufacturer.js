const mongoose = require("mongoose");

const ManufacturerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  country: {
    type: String,
    required: true
  },

  foundedYear: {
    type: Number,
    required: true
  },

  description: {
    type: String
  },

  logoUrl: {
    type: String
  }
});

module.exports = mongoose.model("Manufacturer", ManufacturerSchema);
