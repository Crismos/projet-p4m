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
	soc.emit('user connection', {id: localStorage.user, name: localStorage.name});

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
}

var socket = new IO();