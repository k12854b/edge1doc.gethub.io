const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
let fs = require('fs');
let express = require('express');
let httpServer = require('http').createServer();
let wsServer = require('ws').Server;


let app = express();
let http_port=3000;
let ws = new wsServer({server: httpServer});
app.use(cors());

httpServer.on('request', app);
app.use(bodyParser.json());
app.get('/', async (req, res) =>  {
	  console.log('FOG 3000.OnIndexRequest');
	  fs.createReadStream(__dirname+'/fog.html').pipe(res);
	}
);


ws.on('connection', async (wsh) =>{
	console.log('FOG-3000::WebSocket.OnConnection');
	wsh.on('message',async(message)=>{
		let rm=JSON.parse(message);
		console.log('FOG-3000::WebSocket.OnMessag:Type =  '+rm.type);
		if(rm.type="id"){
			wsh.owner=rm.src;
			wsh.edge=rm.edge;
			console.log('ws.owne: '+wsh.owner);
		}
		if(rm.type="data"){
			console.log('FOG-3000::WebSocket.OnMessag data: =  '+message);
			ws.clients.forEach(function each(c) {
				if (c.isAlive === false) return ;
				if(c.edge===rm.edge)c.send(message);
			});
		}
	});
	wsh.on('close', () =>{
		console.log('FOG-3000::WebSocket.OnClose');
	});
});

//Crete servers instances
httpServer.listen(http_port, function(){console.log('http/ws server listening on ' +http_port);});


    const pool = new Pool({
      user: 'postgres',  
      host: 'localhost',
      database: 'edge1_CP', 
      password: '1234',  
      port: 5432,
  });


// Endpoint to receive GeoJSON data
app.post('/save-geojson', async (req, res) => {
  const geoJsonData = req.body;

  // Extract the necessary data from the GeoJSON object
  const { type, properties, geometry } = geoJsonData;

  // Insert the GeoJSON data into the database
  try {
    const query = 
      `
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