require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const itemRoutes = require("./routes/itemRoutes");
const manufacturerRoutes = require("./routes/manufacturerRoutes");
const authRoutes = require("./routes/authRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes")
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use(itemRoutes);
app.use(manufacturerRoutes);
app.use(authRoutes);
app.use(favoriteRoutes);

const PORT = process.env.PORT || 5123;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
