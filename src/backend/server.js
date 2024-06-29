// server.js (backend)
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

// Endpoint to get data for a specific date
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

// Endpoint to update data for a specific date
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

// Chat endpoints
app.get('/api/chat', async (req, res) => {
  try {
    const result = await db.allDocs({ include_docs: true });
    const chatMessages = result.rows.filter(row => row.doc.type === 'chat').map(row => row.doc);
    res.status(200).json(chatMessages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const newMessage = { _id: new Date().toISOString(), ...req.body, type: 'chat' };
    await db.put(newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error adding chat message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/chat/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const message = await db.get(id);
    const updatedMessage = { ...message, ...req.body };
    await db.put(updatedMessage);
    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error('Error updating chat message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/chat/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const message = await db.get(id);
    await db.remove(message);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});