import express, { static as pub } from 'express';
import { config } from 'dotenv';
import fetch from 'node-fetch';

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(pub('public')); // Assuming your HTML and client-side JS are in the 'public' folder

app.get('/data', async (req, res) => {
  try {
    const sheetId = process.env.GOOGLE_SHEET;
    const apiKey = process.env.GOOGLE_API_KEY;
    const sheetName = 'Data';

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    res.json(data.values);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
