let fs = require('fs');
let express = require('express');
let bodyParser = require('body-parser');
let httpServer = require('http').createServer();
let wsServer = require('ws').Server;

let app = express();
let http_port=3000;
let ws = new wsServer({server: httpServer});


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
