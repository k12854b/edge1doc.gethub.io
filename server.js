const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const socketIoClient = require('socket.io-client');
const app = express();
const port = 3000;

    const pool = new Pool({
      user: 'postgres',  
      host: 'localhost',
      database: 'edge1_CP', 
      password: '1234',  
      port: 5432,
  });
  app.use(bodyParser.json());
  // Enable CORS for all routes
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server);

const otherServerUrl = 'http://localhost:2000'; // URL of the other server
const clientSocket = socketIoClient(otherServerUrl);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('send-geojson', async (geoJsonData) => {
    try {
      const { type, properties, geometry } = geoJsonData;
      const query = `
        INSERT INTO geojson_features (type, properties, geometry)
        VALUES ($1, $2, ST_SetSRID(ST_GeomFromGeoJSON($3), 4326))
        RETURNING id
      `;
      const values = [type, properties, JSON.stringify(geometry)];
      const result = await pool.query(query, values);
      io.emit('receive-geojson', geoJsonData);  // Emit to all connected clients
      clientSocket.emit('send-geojson', geoJsonData);  // Send to the other server
      console.log('GeoJSON data saved and broadcasted');
    } catch (error) {
      console.error('Error inserting data into database:', error);
    }
  });
});

clientSocket.on('receive-geojson', async (geoJsonData) => {
  try {
    const { type, properties, geometry } = geoJsonData;
    const query = `
      INSERT INTO geojson_features (type, properties, geometry)
      VALUES ($1, $2, ST_SetSRID(ST_GeomFromGeoJSON($3), 4326))
      RETURNING id
    `;
    const values = [type, properties, JSON.stringify(geometry)];
    await pool.query(query, values);
    io.emit('receive-geojson', geoJsonData);  // Emit to all connected clients
    console.log('GeoJSON data received from other server and saved');
  } catch (error) {
    console.error('Error inserting data into database:', error);
  }
});

// Endpoint to receive GeoJSON data
app.post('/save-geojson', async (req, res) => {
  const geoJsonData = req.body;

  // Extract the necessary data from the GeoJSON object
  const { type, properties, geometry } = geoJsonData;

  // Insert the GeoJSON data into the database
  try {
    const query = `
      INSERT INTO geojson_features (type, properties, geometry)
      VALUES ($1, $2, ST_SetSRID(ST_GeomFromGeoJSON($3), 4326))
      RETURNING id
    `;
    const values = [type, properties, JSON.stringify(geometry)];
    const result = await pool.query(query, values);

    res.json({ message: 'GeoJSON data received and stored successfully', id: result.rows[0].id });
  } catch (error) {
    console.error('Error inserting data into database:', error);
    res.status(500).json({ error: 'Failed to store GeoJSON data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// Extend server.js to include this new endpoint

app.get('/get-geojson', async (req, res) => {
  try {
    const query = 'SELECT id, type, properties, ST_AsGeoJSON(geometry) as geometry FROM geojson_features';
    const result = await pool.query(query);

    // Construct GeoJSON FeatureCollection
    const features = result.rows.map(row => ({
      type: 'Feature',
      properties: row.properties,
      geometry: JSON.parse(row.geometry)
    }));

    const geoJsonData = {
      type: 'FeatureCollection',
      features: features
    };

    res.json(geoJsonData);
  } catch (error) {
    console.error('Error fetching data from database:', error);
    res.status(500).json({ error: 'Failed to fetch GeoJSON data' });
  }
});
// Endpoint to delete all GeoJSON data
app.delete('/delete-geojson', async (req, res) => {
  try {
    const query = 'DELETE FROM geojson_features';
    await pool.query(query);
    res.json({ message: 'All GeoJSON data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data from database:', error);
    res.status(500).json({ error: 'Failed to delete GeoJSON data' });
  }
});