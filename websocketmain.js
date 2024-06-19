let socket = new WebSocket("wss://127.0.0.1");

			socket.onopen = function(e) {
			};

			socket.onmessage = function(event) {
				let m=JSON.parse(event.data);
				let textarea;
				switch(m.dst){
					case "Civil":
						textarea = document.getElementById("agent-rsv-1");
						textarea.value += "From "+m.src+": "+m.msg+"\n";
						break;
					case "Police":
						textarea = document.getElementById("agent-rsv-2");
						textarea.value += "From "+m.src+": "+m.msg+"\n";
						break;
					case "SAMU":
						textarea = document.getElementById("agent-rsv-3");
						textarea.value += "From "+m.src+": "+m.msg+"\n";
						break;
				}
			};

			socket.onclose = function(event) {
			};

			function OnClickSendBtn(sender){
				let textarea;
				let m;
				switch(sender.id){
					case "agent-btn-a1-to-a2":
						m=document.getElementById("agent-ipt-a1").value;
						textarea = document.getElementById("agent-rsv-1");
						textarea.value += "To Civil: "+m+"\n";
						socket.send(JSON.stringify({"src":"Civil", "dst":"Police", msg:m}));
						break;
					case "agent-btn-a1-to-a3":
						m=document.getElementById("agent-ipt-a1").value;
						textarea = document.getElementById("agent-rsv-1");
						textarea.value += "To SAMU: "+m+"\n";
						socket.send(JSON.stringify({"src":"Civil", "dst":"SAMU", msg:m}));
						break;
					case "agent-btn-a2-to-a1":
						m=document.getElementById("agent-ipt-a2").value;
						textarea = document.getElementById("agent-rsv-2");
						textarea.value += "To Civil: "+m+"\n";
						socket.send(JSON.stringify({"src":"Police", "dst":"Civil", msg:m}));
						break;
					case "agent-btn-a2-to-a3":
						m=document.getElementById("agent-ipt-a2").value;
						textarea = document.getElementById("agent-rsv-2");
						textarea.value += "To SAMU: "+m+"\n";
						socket.send(JSON.stringify({"src":"Police", "dst":"SAMU", msg:m}));
						break;
					case "agent-btn-a3-to-a1":
						m=document.getElementById("agent-ipt-a3").value;
						textarea = document.getElementById("agent-rsv-3");
						textarea.value += "To Civil: "+m+"\n";
						socket.send(JSON.stringify({"src":"SAMU", "dst":"Civil", msg:m}));
						break;
					case "agent-btn-a3-to-a2":
						m=document.getElementById("agent-ipt-a3").value;
						textarea = document.getElementById("agent-rsv-3");
						textarea.value += "To Police: "+m+"\n";
						socket.send(JSON.stringify({"src":"SAMU", "dst":"Police", msg:m}));
						break;
				}
			}