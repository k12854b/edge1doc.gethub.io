const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

    const client = new Client({
      user: 'postgres',  
      host: 'localhost',
      database: 'edge1_CP', 
      password: '1234',  
      port: 5432,
  });

  client.connect();
  app.post('/save-geojson', (req, res) => {
    const geoJsonData = req.body;

     // Extract type, properties, and geometry from GeoJSON data
  const { type, properties, geometry } = geoJsonData;

  let geoJsonGeometry;
  let queryValues;

   
  // Handle different geometry types
  switch (geometry.type) {
    case 'Point':
      geoJsonGeometry = `POINT(${geometry.coordinates[0]} ${geometry.coordinates[1]})`;
      break;
    case 'LineString':
      geoJsonGeometry = `LINESTRING(${geometry.coordinates.map(coord => `${coord[0]} ${coord[1]}`).join(', ')})`;
      break;
    case 'Polygon':
      geoJsonGeometry = `POLYGON((${geometry.coordinates[0].map(coord => `${coord[0]} ${coord[1]}`).join(', ')}))`;
      break;
    case 'Circle':
      // Example handling for Circle (adjust as per your application's needs)
      geoJsonGeometry = `POINT(${geometry.coordinates.center[0]} ${geometry.coordinates.center[1]})`;
      // You might want to handle the radius differently depending on your requirements
      break;
    default:
      return res.status(400).send('Invalid geometry type');
  }

  const propertiesString = JSON.stringify(properties);

  const query = `
    INSERT INTO disaster (geometry, properties)
    VALUES (ST_GeomFromText($1, 4326), $2)
    RETURNING id;
  `;

  client.query(query, [geoJsonGeometry, propertiesString], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error saving data');
    } else {
      return res.status(200).json({ id: result.rows[0].id });
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});