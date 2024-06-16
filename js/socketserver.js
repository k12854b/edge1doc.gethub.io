
let WSServer = require('ws').Server;
let server = require('https').createServer(options);
let express = require('express');
let cllerid=0;
let https_port=443;
// Create web socket server on top of a regular http server
let wss = new WSServer({
  server: server
});
//let app = express();
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static(__dirname));
// Let's create the regular HTTP request and response
app.get('/', function(req, res) {
  console.log('Get interface');
  fs.createReadStream('./InterfaceCivilProtection').pipe(res);
});
wss.on('connection', function connection(ws) { 
	
	ws.on('message', function incoming(message) {
		let msg=JSON.parse(message);
		console.log("Message : "+msg.src+'>>'+msg.dst);
		ws.send(message);
	});
	ws.on("close", () => { 
		console.log('http/ws server closed' );
	});
});
server.listen(https_port, function() {
  console.log('http/ws server listening on ' +https_port);
});
// Also mount the app here
server.on('request', app);

const app = express();
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Disaster',
    password: '1234',
    port: 5432
});


const port = process.env.PORT || 3000;

app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

await client.connect();