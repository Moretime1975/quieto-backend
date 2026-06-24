const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3001;
const GEONAMES_USERNAME = process.env.GEONAMES_USERNAME || "demo";

const APPROX_CITY_AREA_KM2 = {
  "Tokyo": 627, "Paris": 105, "New York": 783, "Berlin": 891,
  "Mumbai": 603, "Singapore": 728, "Vienna": 415, "Dubai": 4114,
  "Barcelona": 101, "Lisbon": 100, "Porto": 41, "Reykjavik": 274,
  "Marrakech": 230, "Kyoto": 828,
};

// ── QUIETO ROUTE ──
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing query parameter 'q'" });
  try {
    const url = `http://api.geonames.org/searchJSON?q=${encodeURIComponent(query)}&maxRows=10&featureClass=P&orderby=population&username=${GEONAMES_USERNAME}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.status) return res.status(502).json({ error: data.status.message || "GeoNames error" });
    const results = (data.geonames || []).map((place) => {
      const area = APPROX_CITY_AREA_KM2[place.name];
      const density = area ? Math.round(place.population / area) : null;
      return {
        name: place.name, country: place.countryName, countryCode: place.countryCode,
        latitude: parseFloat(place.lat), longitude: parseFloat(place.lng),
        population: place.population, areaKm2: area || null, popDensity: density,
        geonameId: place.geonameId,
      };
    });
    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch city data" });
  }
});

// ── EURODROIT ROUTE ──
app.post("/api/chat", async (req, res) => {
  try {
    const { system, messages } = req.body;
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system,
        messages,
      }),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.json({ 
    status: "Quieto + EuroDroit Backend läuft",
    endpoints: ["/api/search?q=cityname", "POST /api/chat"]
  });
});

app.listen(PORT, () => {
  console.log(`Backend läuft auf Port ${PORT}`);
});
