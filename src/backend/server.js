import express from 'express';
import PouchDB from 'pouchdb';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const db = new PouchDB('mydb');

const OURA_API_BASE_URL = 'https://api.ouraring.com/v2/usercollection/sleep';
const OURA_ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN_HERE'; // Replace with your actual token

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.get('/api/data/:date', async (req, res) => {
  const date = req.params.date;
  try {
    // Fetch data from Oura API
    const ouraResponse = await fetch(`${OURA_API_BASE_URL}?start=${date}&end=${date}`, {
      headers: {
        'Authorization': `Bearer ${OURA_ACCESS_TOKEN}`
      }
    });
    const ouraData = await ouraResponse.json();

    // Check if the data already exists in the database
    let doc;
    try {
      doc = await db.get(date);
    } catch (err) {
      if (err.status === 404) {
        doc = { _id: date };
      } else {
        throw err;
      }
    }

    // Update data in the database
    const dataContent = ouraData.sleep ? `Sleep data for ${date}: ${JSON.stringify(ouraData.sleep)}` : 'No sleep data available';
    const workoutContent = doc.workoutContent || 'No workout available';
    doc.dataContent = dataContent;
    doc.workoutContent = workoutContent;
    await db.put(doc);

    // Respond with data
    res.status(200).json({ date, dataContent, workoutContent });
  } catch (error) {
    console.error('Error fetching data from Oura API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/data/:date', async (req, res) => {
  const date = req.params.date;
  try {
    let doc;
    try {
      doc = await db.get(date);
    } catch (err) {
      if (err.status === 404) {
        doc = { _id: date, ...req.body };
        await db.put(doc);
        return res.status(201).json(doc);
      } else {
        throw err;
      }
    }

    const updatedDoc = { ...doc, ...req.body };
    await db.put(updatedDoc);
    res.status(200).json(updatedDoc);
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});