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

	this.requestGameId = function(game, callback) {
		var fct = callback || function(){};

		soc.on("your game id", function(o) {callback(o)});

		soc.emit("request game id", {game: game});
	}
	this.connectTo = function(idGame) {

		soc.emit("user want to connect to a game", {id: idGame});
	}
	this.connectChat = function(callback) {
		var fct = callback || function() {};
		soc.on("receive chat infos", function(o) {callback(o)});
	}
	this.send = function(o) {
		soc.emit("client send message", o);
	}
	this.receiveMessage = function(callback) {
		var fct = callback || function(){};

		soc.on("receive message", function(o) {
			fct(o);
		})
	}
	this.valideMessage = function(callback) {
		var fct = callback || function() {};

		soc.on("valide message", function(o) {
			fct(o);
		});
	}
}

var socket = new IO();