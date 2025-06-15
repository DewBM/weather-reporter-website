export default async function handler(req, res) {
  const apiKey = process.env.WEATHER_API_KEY;
  const location = req.query.q || "Colombo";

  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
}

