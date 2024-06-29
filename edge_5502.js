let fs = require('fs');
let express = require('express');
let bodyParser = require('body-parser');
let httpServer = require('http').createServer();
let wsServer = require('ws').Server;

let app = express();
let http_port=5502;
let ws = new wsServer({server: httpServer});


httpServer.on('request', app);
app.use(bodyParser.json());
app.get('/', async (req, res) =>  {
	  console.log('EDGE 5502.OnIndexRequest');
	  fs.createReadStream(__dirname+'/edge.html').pipe(res);
	}
);
app.get('/p11', async (req, res) =>  {
	  console.log('EDGE 5502.OnIndexRequest');
	  fs.createReadStream(__dirname+'/p11.html').pipe(res);
	}
);
app.get('/p12', async (req, res) =>  {
	  console.log('EDGE 5502.OnIndexRequest');
	  fs.createReadStream(__dirname+'/p12.html').pipe(res);
	}
);
app.get('/p13', async (req, res) =>  {
	  console.log('EDGE 5502.OnIndexRequest');
	  fs.createReadStream(__dirname+'/p13.html').pipe(res);
	}
);



let me="EDGE-5502"
//WebSocket Client for communicating with the fog
const WebSocket = require('ws');
const wsc = new WebSocket('ws://127.0.0.1:3000');
wsc.on('error', console.error);
wsc.on('open', function open() {
	console.log('EDGE 5502::WebSocket client open');
	let message={type:"id",src:me,edge:me,dst:"server"};
	wsc.send(JSON.stringify(message));
});
wsc.on('message', function message(message) {
	console.log('EDGE 5502::WebSocket client receive: ', message);
});
wsc.on('close', function() {
	console.log('EDGE 5502::WebSocket connection closed!');
});


ws.on('connection', async (wsh) =>{
	console.log('EDGE 5502::WebSocket.OnConnection');
	wsh.on('message',async(message)=>{
		let rm=JSON.parse(message);
		console.log('EDGE 5502::WebSocket.OnMessag:Type =  '+rm.type);
		if(rm.type="id"){
			wsh.owner=rm.src;
			console.log('wsh.owne: '+wsh.owner);
		}
		if(rm.type="data"){
			console.log('FOG-3000::WebSocket.OnMessag data: =  '+message);
			if(rm.edge=="EDGE-5502"){
				if(rm.dst="all"){
					wsh.clients.forEach(function each(c) {
						if (c.isAlive === false) return ;
						if(c.owner!==me)c.send(message);
					});
				}else{
					wsh.clients.forEach(function each(c) {
						if (c.isAlive === false) return ;
						if(c.owner===rm.dst)c.send(message);
					});
				}
			}else{
				wsc.send(message);
			}
		}
	});
	wsh.on('close', () =>{
		console.log('EDGE 5502::WebSocket.OnClose');
	});
});




//Crete servers instances
httpServer.listen(http_port, function(){console.log('EDGE 5502 http/ws server listening on ' +http_port);});
