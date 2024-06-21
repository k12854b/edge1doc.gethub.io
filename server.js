const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const app = express();
app.use(bodyParser.json());

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

    const geometry = `POINT(${geoJson.geometry.coordinates[0]} ${geoJson.geometry.coordinates[1]})`;
    const properties = JSON.stringify(geoJson.properties);

        const query = `
            'INSERT INTO disaster (geometry, properties)
            VALUES ($1, $2)
            RETURNING id';
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