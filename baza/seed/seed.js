require("dotenv").config();
const mongoose = require("mongoose");
const Item = require("../models/Item");

const items = [
    { "name": "Fresh Lift", "type": "Vitality", "subtype": "Light", "description": "Kratko osvježenje s blagim porastom energije." },
    { "name": "Gentle Charge", "type": "Vitality", "subtype": "Light", "description": "Lagani energetski gutljaj za svakodnevni boost." },
    { "name": "Power Surge", "type": "Vitality", "subtype": "Strong", "description": "Snažna, čista energija za brzi oporavak i fokus." },
    { "name": "Vital Force", "type": "Vitality", "subtype": "Strong", "description": "Intenzivan napitak za jači osjećaj snage i budnosti." },

    { "name": "Long Boost", "type": "Boost", "subtype": "Endurance", "description": "Dugotrajna energija za stabilan ritam kroz dan." },
    { "name": "Stamina Flow", "type": "Boost", "subtype": "Endurance", "description": "Postupan, ali dugotrajan val energije." },
    { "name": "Sharp Kick", "type": "Boost", "subtype": "Kick", "description": "Brz udar energije za trenutni fokus." },
    { "name": "Quick Bolt", "type": "Boost", "subtype": "Kick", "description": "Odmah podiže budnost i mentalnu oštrinu." },

    { "name": "Thin Wind", "type": "Detox", "subtype": "Mild", "description": "Blaga detox formula s laganim energetskim učinkom." },
    { "name": "Pure Stream", "type": "Detox", "subtype": "Mild", "description": "Nježan napitak za lagano osvježenje organizma." },
    { "name": "Deep Shock", "type": "Detox", "subtype": "Intense", "description": "Jači detox efekt uz svjež nalet energije." },
    { "name": "Cleansing Lightning", "type": "Detox", "subtype": "Intense", "description": "Intenzivno čišćenje i kratka, oštra energija." },

    { "name": "Steady Mind", "type": "Focus", "subtype": "Calm Focus", "description": "Lagani nalet energije za smiren i jasan fokus." },
    { "name": "Quiet Boost", "type": "Focus", "subtype": "Calm Focus", "description": "Ugodna, stabilna energija bez naglog skoka." },
    { "name": "Laser Rush", "type": "Focus", "subtype": "Sharp Focus", "description": "Brza mentalna jasnoća i snažna koncentracija." },
    { "name": "Edge Beam", "type": "Focus", "subtype": "Sharp Focus", "description": "Intenzivan nalet energije za maksimalan fokus." }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");

    await Item.deleteMany({});
    await Item.insertMany(items);

    console.log("Seed complete");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
}

seed();
