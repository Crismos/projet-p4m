/*
* Cette classe permet de mettre à jour des informations de façon asynchrone
* en utilisant les sockets :
*
* socket.bind(id, var, callback)
*
* Appelera la fonction callback dès que la variable var sera modifiée
* Il est possible de unbind une fonction
*
* socket.unbind(id, var)
*/


var IO = function() {
	// connection au socket
	var soc = io.connect(config.server.socket.addr+":"+config.server.socket.port);
	// envoi d'une requete d'identification
	

	var params = {
		onlines: 0
	};

	var binded = {
		onlines: {}
	};
	this.binded = binded;

	var call = function(varName) {
		for(var key in binded[varName]) {
			binded[varName][key](params[varName]);
		}
	}
	this.bind = function(ref, varName, callback) {
		binded[varName][ref] = callback;
		callback(params[varName]);
	}
	this.unbind = function(ref, varName) {
		delete binded[varName][ref];
	}
	this.updateName = function(newName) {
		soc.emit('user update name', {name: newName});
	}

	soc.on("connection infos", function(o) {
		params = o;
		call("onlines");
	});

	this.login = function(callback) {
		var fct = callback || function() {};

		soc.on("connection success", function(o){fct(o);});

		soc.emit('user connection', {id: localStorage.user, name: localStorage.name});
	}

	this.onUserConnection = function(callback) {
		var fct = callback || function(){};
		soc.on("new user connected", function(o) {
			fct(o.id, {name: o.name, status: o.status});
		});
	}

	this.onUserDisconnect = function(callback) {
		var fct = callback || function() {};

		soc.on("user disconnect", function(o) {
			fct(o.id);
		});
	}




	this.requestPuissanceQuatre = function(callback) {
		var callback = callback;

		soc.on("server accept request : create p4 game", function(link_id) {
			console.log("request create p4 ok, mise a jour de linterface graphique");
			callback(link_id);
		});
		soc.emit("client wants to create p4 game");
	}

	this.joinGame = function(link_id, callback) {
		var callback = callback;

		soc.on("server accept request : want to join game",function(o){
			console.log("request join game ok, mise a jour de linterface graphique");
			callback(o)
		});
		soc.emit("client wants to join game", link_id);
	}




	this.connectChat = function(callback) {
		var fct = callback || function() {};
		soc.on("receive chat infos", function(o) {callback(o)});
	}
	this.send = function(o) {
		soc.emit("client send message", o);
	}
	this.receiveMessage = function(callback) {

		console.log("receive message binded");

		var fct = callback || function(){};

		soc.on("receive message", function(o) {
			console.log(">> receive message");
			console.log(o);
			fct(o);
		})
	}
	this.valideMessage = function(callback) {
		console.log("valide message binded");
		console.log(callback);

		var fct = callback || function() {};

		soc.on("message sended", function(o) {
			console.log(">> message sended");
			console.log(o);
			fct(o);
		});
	}

	this.getSocket = function(){
		return soc;
	}
}

var socket = new IO();