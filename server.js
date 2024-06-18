const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const fs = require('fs');
const options = {
  key: fs.readFileSync('D:/MAP CIVIL_PROTECTION/server-key.pem'),
  cert: fs.readFileSync('D:/MAP CIVIL_PROTECTION/server.pem')
};


app.post('', async (req, res) => {
    const geojson = req.body;
    const client = new Client({
      user: 'postgres',  
      host: 'localhost',
      database: 'Disaster',  
      password: '1234',  
      port: 5432,
  });

  await client.connect();

    try {
        const query = `
            'INSERT INTO Disaster (type, propreties, geom)
            VALUES ($1, $2, ST_SetSRID(ST_GeomFromGeoJSON($3), 4326), $4)
            RETURNING id';
        `;
        
        const values = [
            geojson.geometry.type,
            JSON.stringify(geojson.properties),
            JSON.stringify(geojson.geom)
        ];
        
        const result = await pool.query(query, values);
        res.status(200).json({ id: result.rows[0].id });
    } catch (err) {
        console.error('Error saving GeoJSON to database:', err);
        res.status(500).json({ error: 'Failed to save GeoJSON' });
        await client.end();
    }
});
 
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});