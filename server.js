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
      database: 'disaster',  
      password: '1234',  
      port: 5432,
  });

  client.connect();
  app.post('/save-geojson', (req, res) => {
    const geoJson = req.body;
    let geometry;

   // Handle different geometry types
  switch (geoJson.geometry.type) {
    case 'Point':
      geometry = `POINT(${geoJson.geometry.coordinates[0]} ${geoJson.geometry.coordinates[1]})`;
      break;
    case 'LineString':
      geometry = `LINESTRING(${geoJson.geometry.coordinates.map(coord => `${coord[0]} ${coord[1]}`).join(', ')})`;
      break;
    case 'Polygon':
      geometry = `POLYGON((${geoJson.geometry.coordinates[0].map(coord => `${coord[0]} ${coord[1]}`).join(', ')}))`;
      break;
    case 'Circle':
      // Circles are not a standard GeoJSON type; this assumes you want to store the center as a point and save the radius separately
      geometry = `POINT(${geoJson.geometry.coordinates.center[0]} ${geoJson.geometry.coordinates.center[1]})`;
      // You might want to handle the radius differently depending on your requirements
      break;
    default:
      res.status(400).send('Invalid geometry type');
      return;
  }

  const properties = JSON.stringify(geoJson.properties);

  const query = `
    INSERT INTO disaster (geometry, properties)
    VALUES (ST_GeomFromText($1, 4326), $2)
    RETURNING id;
  `;

  client.query(query, [geometry, properties], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving data');
    } else {
      res.status(200).json({ id: result.rows[0].id });
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});