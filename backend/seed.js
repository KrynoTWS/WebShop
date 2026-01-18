require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Item = require("./models/Item");
const Manufacturer = require("./models/Manufacturer");

const manufacturersData = [
  {
    name: "VoltCraft",
    country: "Germany",
    foundedYear: 2014,
    description: "Craft energy drinks focused on clean stimulation.",
    logoUrl: "https://dummyimage.com/150x150/ff546b/000000.png&text=VoltCraft"
  },
  {
    name: "NordBoost",
    country: "Sweden",
    foundedYear: 2016,
    description: "Natural energy drinks with herbal extracts.",
    logoUrl: "https://dummyimage.com/150x150/8754ff/000000.png&text=NordBoost"
  },
  {
    name: "PulseLab",
    country: "USA",
    foundedYear: 2017,
    description: "High-performance energy beverages for athletes.",
    logoUrl: "https://dummyimage.com/150x150/9bf1f2/000000.png&text=PulseLab"
  }
];

const itemsData = [
  {
    name: "Fresh Lift",
    price: 2.99,
    caffeinePercent: 0.03,
    color: "yellow",
    type: "Vitality",
    subtype: "Light",
    description: "Kratko osvježenje s blagim porastom energije.",
    manufacturer: "PulseLab"
  },
  {
    name: "Gentle Charge",
    price: 2.89,
    caffeinePercent: 0.03,
    color: "yellow",
    type: "Vitality",
    subtype: "Light",
    description: "Lagani energetski gutljaj za svakodnevni boost.",
    manufacturer: "VoltCraft"
  },
  {
    name: "Power Surge",
    price: 3.49,
    caffeinePercent: 0.06,
    color: "red",
    type: "Vitality",
    subtype: "Strong",
    description: "Snažna, čista energija za brzi fokus.",
    manufacturer: "VoltCraft"
  },
  {
    name: "Vital Force",
    price: 3.59,
    caffeinePercent: 0.06,
    color: "red",
    type: "Vitality",
    subtype: "Strong",
    description: "Intenzivan napitak za jači osjećaj snage.",
    manufacturer: "PulseLab"
  },

  {
    name: "Long Boost",
    price: 3.29,
    caffeinePercent: 0.05,
    color: "blue",
    type: "Boost",
    subtype: "Endurance",
    description: "Dugotrajna energija za stabilan ritam kroz dan.",
    manufacturer: "NordBoost"
  },
  {
    name: "Stamina Flow",
    price: 3.19,
    caffeinePercent: 0.05,
    color: "blue",
    type: "Boost",
    subtype: "Endurance",
    description: "Postupan, ali dugotrajan val energije.",
    manufacturer: "PulseLab"
  },
  {
    name: "Sharp Kick",
    price: 3.39,
    caffeinePercent: 0.07,
    color: "orange",
    type: "Boost",
    subtype: "Kick",
    description: "Brz udar energije za trenutni fokus.",
    manufacturer: "NordBoost"
  },
  {
    name: "Quick Bolt",
    price: 3.29,
    caffeinePercent: 0.07,
    color: "orange",
    type: "Boost",
    subtype: "Kick",
    description: "Odmah podiže budnost i mentalnu oštrinu.",
    manufacturer: "PulseLab"
  },

  {
    name: "Thin Wind",
    price: 2.79,
    caffeinePercent: 0.02,
    color: "green",
    type: "Detox",
    subtype: "Mild",
    description: "Blaga detox formula s laganim energetskim učinkom.",
    manufacturer: "NordBoost"
  },
  {
    name: "Pure Stream",
    price: 2.69,
    caffeinePercent: 0.02,
    color: "green",
    type: "Detox",
    subtype: "Mild",
    description: "Nježan napitak za lagano osvježenje organizma.",
    manufacturer: "VoltCraft"
  },
  {
    name: "Deep Shock",
    price: 3.59,
    caffeinePercent: 0.06,
    color: "purple",
    type: "Detox",
    subtype: "Intense",
    description: "Jači detox efekt uz snažan nalet energije.",
    manufacturer: "NordBoost"
  },
  {
    name: "Cleansing Lightning",
    price: 3.69,
    caffeinePercent: 0.06,
    color: "purple",
    type: "Detox",
    subtype: "Intense",
    description: "Intenzivno čišćenje i kratka energija.",
    manufacturer: "VoltCraft"
  },

  {
    name: "Steady Mind",
    price: 3.09,
    caffeinePercent: 0.04,
    color: "teal",
    type: "Focus",
    subtype: "Calm Focus",
    description: "Lagani nalet energije za smiren i jasan fokus.",
    manufacturer: "PulseLab"
  },
  {
    name: "Quiet Boost",
    price: 3.09,
    caffeinePercent: 0.04,
    color: "teal",
    type: "Focus",
    subtype: "Calm Focus",
    description: "Ugodna, stabilna energija bez naglog skoka.",
    manufacturer: "NordBoost"
  },
  {
    name: "Laser Rush",
    price: 3.79,
    caffeinePercent: 0.08,
    color: "black",
    type: "Focus",
    subtype: "Sharp Focus",
    description: "Brza mentalna jasnoća i snažna koncentracija.",
    manufacturer: "PulseLab"
  },
  {
    name: "Edge Beam",
    price: 3.89,
    caffeinePercent: 0.08,
    color: "black",
    type: "Focus",
    subtype: "Sharp Focus",
    description: "Intenzivan nalet energije za maksimalan fokus.",
    manufacturer: "NordBoost"
  }
];

async function seed() {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    await User.deleteMany({});
    await User.create({
      username: "admin",
      password: "admin123",
      role: "admin",
      favorites: []
    });
    console.log("ADMIN USER CREATED");

    await Item.deleteMany({});
    await Manufacturer.deleteMany({});
    console.log("Old data removed");

    const manufacturers = await Manufacturer.insertMany(manufacturersData);
    console.log("MANUFACTURERS INSERTED");
    
    const manufacturerMap = {};
    manufacturers.forEach(m => {
      manufacturerMap[m.name] = m._id;
    });

    const itemsWithRefs = itemsData.map(item => ({
      ...item,
      manufacturer: manufacturerMap[item.manufacturer]
    }));

    await Item.insertMany(itemsWithRefs);
    console.log("ITEMS INSERTED");

    console.log("SEEDING FINISHED");
    process.exit();
  } catch (err) {
    console.error("SEEDING ERROR:", err);
    process.exit(1);
  }
}

seed();