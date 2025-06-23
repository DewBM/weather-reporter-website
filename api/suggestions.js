import dotenv from 'dotenv';

// This conditional block attempts to load .env.local ONLY if:
// 1. We are not in a production environment (i.e., we are in local dev).
// 2. The API_KEY environment variable is NOT already set by Vercel CLI.
// This provides a fallback if Vercel's automatic .env.local loading fails for some reason.
if (process.env.NODE_ENV !== 'production' && !process.env.API_KEY) {
    console.log("Attempting to load .env.local with dotenv...");
    dotenv.config({ path: '.env.local' });
}

export default async function handler(req, res) {
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
	console.error("API Key is undefined");
	return res.status(500).json({ error: "Server configuration error: API key missing." });
    }

    const searchText = req.query.q;

    console.log(req.query);

    try {
        const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${searchText}`);
        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        console.error("Error fetching location suggestions:", err);
        res.status(500).json({ error: "Failed to fetch location suggestions" });
    }
}
