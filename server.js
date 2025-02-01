require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Base URL and API key from .env file
const SPORTS_API_URL = process.env.SPORTS_API_URL;
const API_KEY = process.env.SPORTS_API_KEY;

// Define an endpoint to fetch games by date
app.get("/games/:date", async (req, res) => {
  const { date } = req.params;

  try {
    // Make a request to the Sportdata.io API
    const response = await axios.get(`${SPORTS_API_URL}/${date}`, {
      headers: {
        "Ocp-Apim-Subscription-Key": API_KEY,
      },
    });

    // Send the API response back to the client
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data from Sportdata.io:", error.message);
    res.status(500).json({
      message: "An error occurred while fetching data.",
      error: error.message,
    });
  }
});

// Default route for health check
app.get("/", (req, res) => {
  res.send("Sports API is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
